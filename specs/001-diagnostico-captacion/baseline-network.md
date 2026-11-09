# Baseline: orígenes de red de la home antes de la funcionalidad 001

**Fecha**: 2026-11-07 · Medición de T005 con `C:\tmp\pwenv\net-origins.cjs` contra el build local (puerto 8801). La analítica se intercepta y se aborta, y `window.gtag` se sustituye por un registrador: no se envió ningún evento real. La página se desplaza hasta el final para cargar todo lo diferido.

| Viewport                | Orígenes solicitados                                                          |
| ----------------------- | ----------------------------------------------------------------------------- |
| Escritorio (1440 × 900) | `http://127.0.0.1:8801` (el propio sitio), `https://www.googletagmanager.com` |
| Móvil (375 × 812)       | `http://127.0.0.1:8801` (el propio sitio), `https://www.googletagmanager.com` |

En producción se añade el beacon de Cloudflare Web Analytics (`static.cloudflareinsights.com`), que Cloudflare inyecta en el borde y no existe en el servidor local.

**Referencia para E27**: la funcionalidad no debe añadir ningún origen a esta lista.
