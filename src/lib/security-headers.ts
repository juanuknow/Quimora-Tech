/**
 * Cabeceras de seguridad para las respuestas DINÁMICAS del Worker (HTML SSR,
 * 404, redirecciones de TanStack y páginas de error).
 *
 * Por qué aquí y no en `public/_headers`: Cloudflare solo aplica `_headers` a
 * los archivos estáticos (Static Assets). El HTML lo genera el Worker y nunca
 * pasa por ese archivo, así que hasta ahora salía sin estas cabeceras.
 *
 * Los valores coinciden con los que `public/_headers` ya envía para los
 * estáticos, de modo que el sitio entero queda con una sola política.
 *
 * Fuera de alcance a propósito (fases posteriores): CSP y HSTS.
 */
export const BASIC_SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

/**
 * Devuelve la respuesta con las cabeceras básicas añadidas.
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
  const missing = Object.entries(BASIC_SECURITY_HEADERS).filter(
    ([name]) => !response.headers.has(name),
  );
  if (missing.length === 0) return response;

  const headers = new Headers(response.headers);
  for (const [name, value] of missing) headers.set(name, value);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
