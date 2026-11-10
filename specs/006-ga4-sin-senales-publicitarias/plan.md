# Plan: GA4 sin señales publicitarias

## Problema y evidencia

El Director observó en Chrome de producción el píxel `https://www.google.com.co/ads/ga-audiences`. La política `src/routes/privacidad.tsx:65` declara: «No vendemos, alquilamos ni compartimos tus datos con terceros para fines publicitarios.»
La inicialización actual de GA4 está en `src/routes/__root.tsx` y no desactiva Google Signals ni la personalización de anuncios.

## Decisión y cambio

El responsable decidió no enviar señales publicitarias a Google y confirmó que el píxel no se permite en la CSP. La configuración del tag añade `allow_google_signals: false` y `allow_ad_personalization_signals: false`. El ID de medición y `trackEvent` no cambian; no se incorpora Consent Mode.

## Efectos

La medición estándar de GA4, incluidos `page_view` y los eventos de contacto, permanece habilitada. Se pierden audiencias de remarketing y datos demográficos/intereses asociados a Google Signals; se desactiva la personalización publicitaria. La CSP no permite `www.google.com.co` ni el píxel `ga-audiences`.

## Riesgo, señal y reversión

Riesgo **alto** por modificar analítica. Señal de fallo: dejan de llegar `page_view` o los eventos de contacto. Revertir el commit de esta configuración si se confirma el fallo; si el despliegue completo requiere rollback, la versión previa registrada en Cloudflare es la que corresponde al commit `d8bf91a` (Worker `quimoratech`). El rollback debe conservar la política de privacidad como criterio rector.

## Verificación y tarea manual

Verificar tipos, lint, formato y build; inspeccionar el HTML SSR sin ejecutar JavaScript y confirmar ambos campos en el `gtag('config', ...)`. El Director comprobará en navegador que no se solicita el píxel y que GA4 sigue midiendo.
El responsable debe desactivar también Google Signals y la personalización de anuncios en el panel de GA4; la configuración de código no sustituye ese control administrativo.

## Referencia oficial

La [documentación de configuración de GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) define `allow_google_signals` y `allow_ad_personalization_signals` como campos booleanos vigentes y describe `false` como valor para desactivar esas funciones.
