# Baseline: home antes de la funcionalidad 001

**Fecha**: 2026-11-07 · **Commit del código**: `ce793c2` (código de `src/` idéntico a `main` = `feca905`) · **Servidor**: build de producción servido en local con `wrangler dev --local` (puerto 8801, `compatibility_date` 2026-07-21)

Medición de T003. Todas las pruebas con la analítica bloqueada.

| Verificación                                  | Resultado                                                                                                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`                               | Código 0; **1 aviso** (`inlineDynamicImports option is ignored because the codeSplitting option is specified`)                                                    |
| Inventario de la home (`home-inventory.cjs`)  | 14 bloques en `<main>`, un solo `h1`, sin saltos de encabezado; alto 14 627 px a 1440 y 17 971 px a 768; sin desplazamiento horizontal en 1440, 768, 375 y 320 px |
| `nav-verify.cjs`                              | 30/30                                                                                                                                                             |
| `fase3-prod-interact.cjs`                     | 50/50                                                                                                                                                             |
| `fase3-prod-axe.cjs` (13 rutas × 2 viewports) | Total 22, solo `region`                                                                                                                                           |
| `liveperf-height.cjs`                         | Altura del documento estable en los 4 anchos                                                                                                                      |

## JS del cliente que carga `/`

| Archivo                  | Bytes       |
| ------------------------ | ----------- |
| `index-Xu1mrRfJ.js`      | 353 011     |
| `routes-B2RZIwZE.js`     | 110 666     |
| `Footer-DSzgKOw0.js`     | 18 690      |
| `arrow-left-zoghyJZI.js` | 154         |
| **Total**                | **482 521** |

Capturas e inventario JSON en el scratchpad de la sesión (`home001\antes-*`).
