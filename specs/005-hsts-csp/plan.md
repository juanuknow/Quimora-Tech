# Plan: HSTS y CSP en el Worker

**Fecha:** 2026-11-10. **Base:** `aefd56b`. **Rama:** `security/hsts-csp-report-only`.
**Autorización inicial:** el responsable permitió plan e implementación juntos sin spec separada (regla de conflicto 3). Para la Fase 2, autoriza un commit local y su integración fast-forward con push a `main`.

## Problema y alcance

El Director verificó originalmente cuatro cabeceras ausentes en el HTML del Worker; HSTS y CSP ya estaban definidos para estáticos en `public/_headers:6-7`. `src/server.ts:68-70` activa el wrapper solo con `import.meta.env.PROD` y no se modifica. Las fases 1 y 1b añadieron las cabeceras al SSR, 404 y errores y sincronizaron la política estática. La fase 2 cambia solo el modo de entrega de la CSP.
Alcance de esta fase: `src/lib/security-headers.ts`, este registro y solo sección 7 de `docs/ESTRUCTURA.md`. Sin dependencias, cambios en `public/_headers`, servidor, Worker ni DNS.

## Inventario CSP

«Cubierto» compara las fuentes con la política de `public/_headers:7`; ese archivo no aplica su CSP al documento SSR. Las referencias son líneas de la base salvo las fuentes de dependencias instaladas.

| Recurso                                        | Archivo:línea                                                                                                          | Directiva / cobertura actual                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Bootstrap y serialización inline TanStack      | `src/routes/__root.tsx:190`; `node_modules/@tanstack/router-core/src/ssr/ssr-server.ts:485-487,595-599`                | `script-src 'unsafe-inline'`: sí                                                               |
| Módulo de hidratación `/assets/*.js`           | `src/routes/__root.tsx:190`; `node_modules/@tanstack/react-router/src/Scripts.tsx:29-38`                               | `script-src 'self'`: sí                                                                        |
| Inicialización GA4 inline                      | `src/routes/__root.tsx:180-183`                                                                                        | `script-src 'unsafe-inline'`: sí                                                               |
| Script GA4 `www.googletagmanager.com/gtag/js`  | `src/routes/__root.tsx:176-178`                                                                                        | `script-src https://*.googletagmanager.com`: sí                                                |
| JSON-LD raíz, FAQ, servicios y verticales      | `src/routes/__root.tsx:169-171`; `src/components/FAQ.tsx:74-76`, `ServiceDetail.tsx:38-40`, `VerticalDetail.tsx:34-36` | Inline, sin descarga a schema.org; cubierto conservadoramente por `script-src 'unsafe-inline'` |
| Estilos de progreso e invitación               | `src/components/DiagnosisDialog.tsx:371`; `DiagnosisInvite.tsx:254-259`                                                | `style-src 'unsafe-inline'`: sí                                                                |
| Estilos de navegación, reveal y galería        | `src/components/Nav.tsx:293`; `Reveal.tsx:34`; `ShowcaseGallery.tsx:169`                                               | `style-src 'unsafe-inline'`: sí                                                                |
| Rejilla, SVG y timeline                        | `src/components/SoftwareSolutions.tsx:20-24,44`; `SolutionsVisual.tsx:80-82`; `Timeline.tsx:82,91,125`                 | `style-src 'unsafe-inline'`: sí; gradientes sin red                                            |
| Mutaciones CSSOM                               | `src/lib/hooks.ts:46-63`; `src/components/Nav.tsx:194-227`; `DiagnosisDialog.tsx:181-196`                              | Sin origen externo; política conserva estilos inline                                           |
| `<style>` de error autónomo                    | `src/lib/error-page.ts:19-29`                                                                                          | `style-src 'unsafe-inline'`: sí                                                                |
| CSS externo propio                             | `src/routes/__root.tsx:112-115`                                                                                        | `style-src 'self'`: sí                                                                         |
| Fuentes Inter y Space Grotesk autoalojadas     | `src/styles.css:10-22`; `src/routes/__root.tsx:118-133`                                                                | `font-src 'self'`: sí                                                                          |
| Imágenes propias y SVG inline                  | `src/components/Showcase3D.tsx:54,85,108-202`; `Nav.tsx:248`; `Footer.tsx:59`; `SolutionsVisual.tsx:86`                | `img-src 'self'`: sí; SVG inline no descarga                                                   |
| Vídeo `/videos/soluciones.mp4`                 | `src/components/SolutionsVisual.tsx:39-40`; `public/videos/soluciones.mp4`                                             | Sin media-src, hereda `default-src 'self'`: sí                                                 |
| Fetch JSON del formulario a Formspree          | `src/components/Contact.tsx:65-70`; `src/lib/site.ts:18`                                                               | `connect-src https://formspree.io`; form-action existente también lo permite: sí               |
| Eventos GA4 mediante gtag                      | `src/lib/site.ts:27-31`; `src/routes/__root.tsx:182`                                                                   | Conexión observada a analytics.google.com; cubierto por `*.analytics.google.com`               |
| Beacon Cloudflare inyectado en el borde        | Hallazgo del Director en Chrome sobre la home de producción                                                            | `script-src https://static.cloudflareinsights.com`: sí                                         |
| Transporte RUM `/cdn-cgi/rum` en sitio proxied | Hallazgo del Director en Chrome sobre la home de producción                                                            | `connect-src 'self'`: sí; no se añade el destino alternativo de sitios no proxied              |
| Reporte Lovable                                | `src/lib/lovable-error-reporting.ts:22-35`                                                                             | Solo delega a window.\_\_lovableEvents; no define URL, fetch ni beacon. No inventar un origen  |
| web-vitals                                     | `package.json:25`; búsqueda completa en src sin importación ni use-web-vitals.ts                                       | Dependencia declarada pero no usada; ningún destino de red propio demostrado                   |
| WhatsApp                                       | `src/lib/site.ts:35-36`                                                                                                | Navegación a wa.me, no fetch, iframe ni subrecurso; no necesita connect-src                    |

No se encontraron imágenes data:/blob: ni iframes externos en src o en el CSS compilado inspeccionado. No se encontró sendBeacon propio. La petición HTTP sin JavaScript no puede observar las solicitudes de analítica ejecutadas en navegador; el Director confirma que Chrome observó el beacon Cloudflare y el colector `analytics.google.com`, además de GTM y el RUM propio. El envío a Formspree sigue sin probarse en navegador. Los destinos dinámicos de GA4/Lovable y los transportes alternativos requieren observación antes de activar CSP; no se añaden comodines fuera de las recomendaciones oficiales para GA4.

## Política aplicada en fases 1 y 1b

HSTS idéntico a estáticos: `max-age=31536000; includeSubDomains; preload`.
CSP conservada en una estructura de directivas y serializada con `; `, reutilizando fuentes repetidas. Para GA4 se usan los hosts wildcard de la guía oficial, más el host raíz `https://analytics.google.com` que el comodín `https://*.analytics.google.com` no cubre:

```text
default-src 'self'
script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://static.cloudflareinsights.com
connect-src 'self' https://formspree.io https://*.google-analytics.com https://*.analytics.google.com https://analytics.google.com https://*.googletagmanager.com
img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com
style-src 'self' 'unsafe-inline'
font-src 'self'
frame-ancestors 'none'
base-uri 'self'
form-action 'self' https://formspree.io
```

En las fases 1 y 1b la política del Worker se entregó en modo Report-Only. Su valor es idéntico byte a byte a la CSP de `public/_headers:7`. Los orígenes de Cloudflare y GA4 incorporados se justifican por los hallazgos del Director y la guía oficial. No se introduce un servicio nuevo ni se cambia su configuración.

## Fase 1b — orígenes observados en producción

El Director verificó en Chrome, sobre la home de producción: (1) Cloudflare inyecta `https://static.cloudflareinsights.com/beacon.min.js/...` con `integrity` y `data-cf-beacon`; CSP reportó una infracción `script-src-elem`; (2) GA4 envía mediciones por `fetch` a `https://analytics.google.com/g/collect`, que infringía `connect-src` porque `https://*.analytics.google.com` no cubre el host raíz; se añade el host exacto; (3) se observaron `https://www.googletagmanager.com/gtag/js` y una solicitud XHR same-origin a `https://quimoratech.com/cdn-cgi/rum`; (4) no se observaron iframes. El Director también observó el píxel `https://www.google.com.co/ads/ga-audiences`, que infringe `img-src`; por decisión del responsable no se permite y se desactivan las señales publicitarias en GA4. El envío a Formspree no se probó en navegador.

La guía oficial [Use Tag Manager with a Content Security Policy](https://developers.google.com/tag-platform/security/guides/csp), apartado “Google Analytics 4 (Google Analytics)”, recomienda exactamente:

```text
script-src: https://*.googletagmanager.com
img-src: https://*.google-analytics.com https://*.googletagmanager.com
connect-src: https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com
```

La política resultante conserva los orígenes propios y Formspree, incorpora `https://static.cloudflareinsights.com` en `script-src` y aplica las recomendaciones GA4. En `connect-src` también permite explícitamente `https://analytics.google.com`, porque el comodín `*.analytics.google.com` no cubre el host sin subdominio. Los hosts específicos `www.googletagmanager.com`, `www.google-analytics.com` y `region1.google-analytics.com` se eliminan al quedar cubiertos por los comodines indicados. Las directivas permanecen en modo Report-Only en el Worker y la línea CSP de `public/_headers` se sincroniza byte a byte. No se agregan los destinos adicionales de Google Signals, Ads ni Tag Manager Preview; el píxel `ga-audiences` sigue bloqueado por `img-src`.

## Motivo de Report-Only en las fases 1 y 1b

Permite observar violaciones sin bloquear hidratación, formulario, analítica ni estilos. No equivale a protección CSP activa, no impide XSS por sí sola y conserva unsafe-inline por compatibilidad. Sin endpoint de reportes no hay recopilación remota: revisar consola del navegador, incluyendo recorridos y errores. Las cuatro cabeceras previas conservan su protección y HSTS sí se aplica en HTTPS.

## Fase 2 — CSP activada

**Fecha:** 2026-11-10. El Director verificó en Chrome que el píxel `ga-audiences` ya no se solicita, GA4 sigue enviando `page_view` y eventos de contacto a `www.google-analytics.com/g/collect` con `npa=1`, no hay infracciones CSP en `/` ni en `/servicios/tiendas-online`, y el beacon de Cloudflare carga sin infracción. El responsable desactivó también Google Signals y la personalización de anuncios en el panel de GA4.

La cabecera del Worker pasa a `Content-Security-Policy`, conservando exactamente las mismas directivas y fuentes. La versión Cloudflare previa para reversión es la activa antes del despliegue y corresponde al commit `d27aa79`.

Señales de fallo: deja de medirse la analítica, falla el envío del formulario, se rompe el estilo o la hidratación, o la consola muestra recursos legítimos bloqueados. Revertir el commit y restaurar la versión Cloudflare previa ante esas señales.

Pendientes: el responsable debe probar el formulario de contacto real. Nonces para retirar `'unsafe-inline'` y un endpoint de reportes siguen siendo mejoras futuras.

## Constitution Check, riesgo y reversión

Riesgo **alto** por cabeceras y HSTS (Principio IV). Arquitectura, SSR, cuerpo streaming y control PROD preservados; wrapper solo añade las cabeceras ausentes y conserva valores interiores, status y statusText. Principio X: HSTS exacto y una CSP única idéntica a la de estáticos. La excepción expresa permite este plan sin spec independiente.
La versión Cloudflare activa antes de la Fase 2, identificada por el Director para reversión, corresponde al commit `d27aa79` en Worker **quimoratech**. La versión `872516db` (commit `aefd56b`) fue la referencia de reversión de una fase anterior.
Señales de fallo: cabeceras previas alteradas, CSP bloqueante accidental, respuesta/cuerpo roto, error de build, nueva violación CSP sin explicar o acceso HTTPS/subdominios afectado. Con autorización, revertir el commit completo y restaurar la versión Cloudflare registrada; comprobar V9. HSTS cacheado no desaparece inmediatamente al revertir código: una retirada con max-age=0 sería otra acción expresa y no elimina automáticamente políticas heredadas/preload. No cambiar preload ni DNS aquí.

## Verificación y cierre

1. Bun: tipos, lint, Prettier solo del módulo y este plan, build; registrar códigos y avisos. No normalizar documentos con deuda P4.
2. Buscar las cabeceras nuevas y la política en `.output/server/`; comparar HSTS y CSP byte a byte con public/\_headers. En fase 2 debe aparecer `Content-Security-Policy` y no `Content-Security-Policy-Report-Only`.
3. Con Wrangler ya instalado, intentar servir exclusivamente el build con `dev --local`, config generada, persistencia temporal fuera del repo y sin deploy; HEAD a `/` y una ruta inexistente. La verificación HEAD local no fue posible: el runtime instalado admite como máximo compatibilidad `2026-07-21`, mientras el Worker requiere `2026-07-22`. No cambiar compatibilidad ni sustituir por vite dev.
4. Verificar conservación de valores interiores y del cuerpo en el wrapper; confirmar que solo se aplica la CSP activa prevista. Conservar el control PROD sin tocar src/server.ts.
5. Diff de archivos protegidos vacío; solo módulo, este plan y sección 7 documental modificados. Detener todo servidor local iniciado. V8 antes de cualquier commit autorizado; V9 en producción solo tras autorización y a cargo del responsable.

## Fuera de alcance y preguntas pendientes

Fase 3: introducir nonces o hashes para retirar unsafe-inline y habilitar un endpoint de reportes. También fuera: dependencias, privacidad, servicios nuevos, DNS, preload, nombre del Worker y otras secciones documentales. Antes de ampliar la política, observar en navegador el origen nuevo y actualizar en el mismo cambio tanto `src/lib/security-headers.ts` como `public/_headers`. El envío real a Formspree sigue pendiente de prueba por el responsable.
