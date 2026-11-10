/**
 * Cabeceras de seguridad para las respuestas DINÁMICAS del Worker (HTML SSR,
 * 404, redirecciones de TanStack y páginas de error).
 *
 * Por qué aquí y no en `public/_headers`: Cloudflare solo aplica `_headers` a
 * los archivos estáticos (Static Assets). El HTML lo genera el Worker y nunca
 * pasa por ese archivo.
 *
 * HSTS y CSP coinciden con `public/_headers`. Los orígenes de analítica se
 * limitan a los observados en producción y a la guía oficial de GA4.
 *
 * La CSP del Worker solo informa: activarla y añadir nonces/reportes son fases
 * posteriores. src/server.ts mantiene estas cabeceras solo en producción.
 */
const SELF = "'self'";
const UNSAFE_INLINE = "'unsafe-inline'";
const FORMSPREE_ORIGIN = "https://formspree.io";

const CSP_DIRECTIVES = {
  "default-src": [SELF],
  "script-src": [
    SELF,
    UNSAFE_INLINE,
    "https://*.googletagmanager.com",
    "https://static.cloudflareinsights.com",
  ],
  "connect-src": [
    SELF,
    FORMSPREE_ORIGIN,
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
  ],
  "img-src": [SELF, "data:", "https://*.google-analytics.com", "https://*.googletagmanager.com"],
  "style-src": [SELF, UNSAFE_INLINE],
  "font-src": [SELF],
  "frame-ancestors": ["'none'"],
  "base-uri": [SELF],
  "form-action": [SELF, FORMSPREE_ORIGIN],
} as const;

const CONTENT_SECURITY_POLICY = Object.entries(CSP_DIRECTIVES)
  .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
  .join("; ");

export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy-Report-Only": CONTENT_SECURITY_POLICY,
};

/**
 * Devuelve la respuesta con las cabeceras de seguridad que falten.
 *
 * - Solo AÑADE las que falten: si una capa interior (TanStack, un middleware)
 *   ya fijó alguna de estas cabeceras, se respeta su valor en vez de pisarlo.
 * - No lee el cuerpo: el `ReadableStream` original se pasa tal cual al nuevo
 *   `Response`, así que el streaming SSR sigue funcionando.
 * - Siempre crea un `Response` nuevo con una copia de las cabeceras, porque las
 *   de algunas respuestas son inmutables (`Response.redirect()`, respuestas de
 *   `fetch`) y mutarlas directamente lanzaría un `TypeError`.
 * - Conserva status, statusText y el resto de cabeceras (Location,
 *   Content-Type, Set-Cookie…).
 */
export function withSecurityHeaders(response: Response): Response {
  const missing = Object.entries(SECURITY_HEADERS).filter(([name]) => !response.headers.has(name));
  if (missing.length === 0) return response;

  const headers = new Headers(response.headers);
  for (const [name, value] of missing) headers.set(name, value);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
