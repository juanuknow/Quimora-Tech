# Plan: HSTS y CSP Report-Only en el Worker

**Fecha:** 2026-11-10. **Base:** `aefd56b`. **Rama:** `security/hsts-csp-report-only`.
**Autorización:** el responsable permitió plan e implementación juntos sin spec separada (regla de conflicto 3) y ahora autoriza un commit local de los tres archivos. No autoriza integración ni publicación.

## Problema y alcance

El Director verificó cuatro cabeceras en el HTML del Worker y HSTS/CSP solo en estáticos. `public/_headers:6-7` define la política; `src/server.ts:68-70` mantiene el wrapper solo con `import.meta.env.PROD` y no se modifica. Falta cubrir SSR, 404 y errores con HSTS y una primera CSP observacional.
Cambios: `src/lib/security-headers.ts`, este plan y solo sección 7 de `docs/ESTRUCTURA.md` para retirar su descripción obsoleta. Sin dependencias, orígenes nuevos de la aplicación ni cambios en `public/_headers`, servidor, Worker o DNS.

## Inventario CSP

«Cubierto» compara las fuentes con la política de `public/_headers:7`; ese archivo no aplica su CSP al documento SSR. Las referencias son líneas de la base salvo las fuentes de dependencias instaladas.

| Recurso                                        | Archivo:línea                                                                                                          | Directiva / cobertura actual                                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Bootstrap y serialización inline TanStack      | `src/routes/__root.tsx:190`; `node_modules/@tanstack/router-core/src/ssr/ssr-server.ts:485-487,595-599`                | `script-src 'unsafe-inline'`: sí                                                                               |
| Módulo de hidratación `/assets/*.js`           | `src/routes/__root.tsx:190`; `node_modules/@tanstack/react-router/src/Scripts.tsx:29-38`                               | `script-src 'self'`: sí                                                                                        |
| Inicialización GA4 inline                      | `src/routes/__root.tsx:180-183`                                                                                        | `script-src 'unsafe-inline'`: sí                                                                               |
| Script GA4 `www.googletagmanager.com/gtag/js`  | `src/routes/__root.tsx:176-178`                                                                                        | `script-src https://www.googletagmanager.com`: sí                                                              |
| JSON-LD raíz, FAQ, servicios y verticales      | `src/routes/__root.tsx:169-171`; `src/components/FAQ.tsx:74-76`, `ServiceDetail.tsx:38-40`, `VerticalDetail.tsx:34-36` | Inline, sin descarga a schema.org; cubierto conservadoramente por `script-src 'unsafe-inline'`                 |
| Estilos de progreso e invitación               | `src/components/DiagnosisDialog.tsx:371`; `DiagnosisInvite.tsx:254-259`                                                | `style-src 'unsafe-inline'`: sí                                                                                |
| Estilos de navegación, reveal y galería        | `src/components/Nav.tsx:293`; `Reveal.tsx:34`; `ShowcaseGallery.tsx:169`                                               | `style-src 'unsafe-inline'`: sí                                                                                |
| Rejilla, SVG y timeline                        | `src/components/SoftwareSolutions.tsx:20-24,44`; `SolutionsVisual.tsx:80-82`; `Timeline.tsx:82,91,125`                 | `style-src 'unsafe-inline'`: sí; gradientes sin red                                                            |
| Mutaciones CSSOM                               | `src/lib/hooks.ts:46-63`; `src/components/Nav.tsx:194-227`; `DiagnosisDialog.tsx:181-196`                              | Sin origen externo; política conserva estilos inline                                                           |
| `<style>` de error autónomo                    | `src/lib/error-page.ts:19-29`                                                                                          | `style-src 'unsafe-inline'`: sí                                                                                |
| CSS externo propio                             | `src/routes/__root.tsx:112-115`                                                                                        | `style-src 'self'`: sí                                                                                         |
| Fuentes Inter y Space Grotesk autoalojadas     | `src/styles.css:10-22`; `src/routes/__root.tsx:118-133`                                                                | `font-src 'self'`: sí                                                                                          |
| Imágenes propias y SVG inline                  | `src/components/Showcase3D.tsx:54,85,108-202`; `Nav.tsx:248`; `Footer.tsx:59`; `SolutionsVisual.tsx:86`                | `img-src 'self'`: sí; SVG inline no descarga                                                                   |
| Vídeo `/videos/soluciones.mp4`                 | `src/components/SolutionsVisual.tsx:39-40`; `public/videos/soluciones.mp4`                                             | Sin media-src, hereda `default-src 'self'`: sí                                                                 |
| Fetch JSON del formulario a Formspree          | `src/components/Contact.tsx:65-70`; `src/lib/site.ts:18`                                                               | `connect-src https://formspree.io`; form-action existente también lo permite: sí                               |
| Eventos GA4 mediante gtag                      | `src/lib/site.ts:27-31`; `src/routes/__root.tsx:182`                                                                   | Colectores ya permitidos: www.google-analytics.com y region1.google-analytics.com; no se ejecutó medición real |
| Beacon Cloudflare inyectado en el borde        | `specs/001-diagnostico-captacion/baseline-network.md:10`                                                               | Pendiente de observar en Report-Only; no se amplía la política                                                 |
| Transporte RUM `/cdn-cgi/rum` en sitio proxied | Misma referencia y documentación oficial de Cloudflare enlazada abajo                                                  | `connect-src 'self'`: sí; no se añade el destino alternativo de sitios no proxied                              |
| Reporte Lovable                                | `src/lib/lovable-error-reporting.ts:22-35`                                                                             | Solo delega a window.\_\_lovableEvents; no define URL, fetch ni beacon. No inventar un origen                  |
| web-vitals                                     | `package.json:25`; búsqueda completa en src sin importación ni use-web-vitals.ts                                       | Dependencia declarada pero no usada; ningún destino de red propio demostrado                                   |
| WhatsApp                                       | `src/lib/site.ts:35-36`                                                                                                | Navegación a wa.me, no fetch, iframe ni subrecurso; no necesita connect-src                                    |

No se encontraron imágenes data:/blob: ni iframes externos en src o en el CSS compilado inspeccionado. Se conserva `img-src data:` ya existente; no se añade blob:. No se encontró sendBeacon propio. Una petición HTTP sin ejecutar JavaScript a la home de producción devolvió GA4 y assets propios, cinco scripts inline (dos JSON-LD) y cero `<style>`; no mostró el beacon Cloudflare. Aunque hay una referencia histórica, el beacon queda pendiente de observar en Report-Only y no se amplía la política. Los destinos dinámicos de GA4/Lovable y los transportes alternativos requieren observación en navegador antes de activar CSP; no se añaden comodines ni orígenes especulativos.

## Política propuesta

HSTS idéntico a estáticos: `max-age=31536000; includeSubDomains; preload`.
CSP conservada en una estructura de directivas y serializada con `; `, reutilizando fuentes repetidas:

```text
default-src 'self'
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com
connect-src 'self' https://formspree.io https://www.google-analytics.com https://region1.google-analytics.com
img-src 'self' data:
style-src 'self' 'unsafe-inline'
font-src 'self'
frame-ancestors 'none'
base-uri 'self'
form-action 'self' https://formspree.io
```

Solo se añade `Content-Security-Policy-Report-Only`, nunca Content-Security-Policy en el Worker. Su valor es idéntico byte a byte a la CSP de `public/_headers:7`. El beacon queda pendiente de observar en Report-Only; no se añade su origen sin evidencia de producción. No se introduce un servicio nuevo ni se cambia su configuración. Referencias: [beacon y destinos Cloudflare](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/), [CSP y Analytics](https://developers.google.com/tag-platform/security/guides/csp).

## Por qué Report-Only primero

Permite observar violaciones sin bloquear hidratación, formulario, analítica ni estilos. No equivale a protección CSP activa, no impide XSS por sí sola y conserva unsafe-inline por compatibilidad. Sin endpoint de reportes no hay recopilación remota: revisar consola del navegador, incluyendo recorridos y errores. Las cuatro cabeceras previas conservan su protección y HSTS sí se aplica en HTTPS.

## Constitution Check, riesgo y reversión

Riesgo **alto** por cabeceras y HSTS (Principio IV). Arquitectura, SSR, cuerpo streaming y control PROD preservados; wrapper solo añade las cabeceras ausentes y conserva valores interiores, status y statusText. Principio X: HSTS exacto y una CSP única idéntica a la de estáticos. La excepción expresa permite este plan sin spec independiente.
Versión activa de reversión identificada por el Director: Cloudflare version `872516db`, commit `aefd56b`, 100 % del tráfico en Worker **quimoratech**. Antes de un despliegue autorizado, confirmar que esa versión sigue disponible para restauración.
Señales de fallo: cabeceras previas alteradas, CSP bloqueante accidental, respuesta/cuerpo roto, error de build, nueva violación CSP sin explicar o acceso HTTPS/subdominios afectado. Con autorización, revertir el commit completo y restaurar la versión Cloudflare registrada; comprobar V9. HSTS cacheado no desaparece inmediatamente al revertir código: una retirada con max-age=0 sería otra acción expresa y no elimina automáticamente políticas heredadas/preload. No cambiar preload ni DNS aquí.

## Verificación y cierre

1. Bun: tipos, lint, Prettier solo del módulo y este plan, build; registrar códigos y avisos. No normalizar documentos con deuda P4.
2. Buscar las cabeceras nuevas y la política en `.output/server/`; comparar HSTS y CSP byte a byte con public/\_headers. Confirmar que no hay CSP bloqueante ni el origen de Cloudflare Insights sin evidencia.
3. Con Wrangler ya instalado, intentar servir exclusivamente el build con `dev --local`, config generada, persistencia temporal fuera del repo y sin deploy; HEAD a `/` y una ruta inexistente. La verificación HEAD local no fue posible: el runtime instalado admite como máximo compatibilidad `2026-07-21`, mientras el Worker requiere `2026-07-22`. No cambiar compatibilidad ni sustituir por vite dev.
4. Verificar conservación de valores interiores y del cuerpo en el wrapper; ausencia de CSP bloqueante añadida. Conservar el control PROD sin tocar src/server.ts.
5. Diff de archivos protegidos vacío; solo módulo, este plan y sección 7 documental modificados. Detener todo servidor local iniciado. V8 antes de cualquier commit autorizado; V9 en producción solo tras autorización y a cargo del responsable.

## Fuera de alcance y preguntas pendientes

Fase 2: activar CSP bloqueante, nonces/hashes para retirar unsafe-inline, endpoint/report-to/report-uri, ampliar destinos sin evidencia y sincronizar ampliaciones futuras en public/\_headers. También fuera: dependencias, privacidad, servicios nuevos, DNS, preload, nombre del Worker y otras secciones documentales. Confirmar destinos reales de GA4, condiciones del beacon y la integración Lovable mediante navegador antes de activar CSP. ¿Qué procedimiento de revisión de violaciones se aprobará para la fase 2?
