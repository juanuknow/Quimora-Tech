# Rendimiento informativo: funcionalidad 001

**Fecha**: 2026-11-07 · Mediciones informativas (Principio VI: no hay línea base aprobada de Lighthouse). Build de producción servido en local con `wrangler dev --local`; analítica bloqueada. Línea base: [baseline.md](./baseline.md).

## JS del cliente que carga `/`

| Archivo              | Antes (bytes) | Después (bytes) | Diferencia           |
| -------------------- | ------------- | --------------- | -------------------- |
| `index-*.js`         | 353 011       | 353 471         | +460                 |
| `routes-*.js` (home) | 110 666       | 120 380         | +9 714               |
| `Footer-*.js`        | 18 690        | 18 692          | +2                   |
| `arrow-left-*.js`    | 154           | 154             | 0                    |
| **Total**            | **482 521**   | **492 697**     | **+10 176 (+2,1 %)** |

El aumento corresponde a la ventana del diagnóstico, la invitación y el motor, menos lo retirado (madurez, rangos, calculadora y wizard antiguo). Sin carga diferida, como decide research R16.

## Cambios de diseño (layout shift) con la invitación

`perf-001.cjs`: observador de `layout-shift` desde la carga; la invitación aparece a los 2,5 s y se cierra con «Ahora no».

| Build      | Pantalla   | Invitación | Desplazamientos entre 1,5 y 5 s | CLS total sin interacción |
| ---------- | ---------- | ---------- | ------------------------------- | ------------------------- |
| Línea base | 1440 × 900 | —          | 0                               | 0,0001                    |
| Línea base | 375 × 812  | —          | 0                               | 0,0000                    |
| Final      | 1440 × 900 | Ventana    | 0                               | 0,0001                    |
| Final      | 375 × 812  | Tarjeta    | 0                               | 0,0000                    |

La invitación no aporta ningún cambio de diseño (FR-006, SC-005): la ventana vive en la capa superior y la tarjeta es `fixed` y se mide con `visibility: hidden`.

## Pendiente

Lighthouse móvil y Core Web Vitals de campo (verificaciones P1 y P2 de la constitución, pendientes de procedimiento aprobado).
