# Implementation Plan: Diagnóstico Digital Gratuito como herramienta de captación

**Branch**: `feat/diagnostico-captacion` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-diagnostico-captacion/spec.md`

## Summary

Convertir el diagnóstico de la home en una herramienta de captación: invitación a los 2,5 s (ventana con el contenido completo en escritorio; en móvil, tarjeta reducida no bloqueante que solo aparece si cumple el límite del 25 % y el resto de condiciones; una vez por sesión), una única ventana de diagnóstico con cinco preguntas, recomendación integral determinista limitada al catálogo publicado, sin precios ni plazos, y salida a WhatsApp con un mensaje completo y copiable. Enfoque técnico: un motor puro y verificable de forma exhaustiva (`diagnosis-engine.ts`), el elemento nativo `<dialog>`, el evento de ventana `diagnosis:start` ya existente como punto único de apertura, y los datos del catálogo y de los planes como fuentes únicas. Sin dependencias nuevas. Detalle en [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.9 (modo estricto), React 19.2, Node 24 para las verificaciones

**Primary Dependencies**: TanStack Start 1.168 (SSR), Vite 8, Tailwind CSS 4.2, lucide-react 0.575. Sin dependencias nuevas.

**Storage**: `sessionStorage` (clave `qt:diagnosis-invite`) solo para el estado de la invitación; nada en servidor

**Testing**: Sin ejecutor en el repositorio (P5 pendiente). Script de Node fuera del repositorio para el motor (6 300 combinaciones); Playwright + axe-core en `C:\tmp\pwenv` para extremo a extremo y regresión ([quickstart.md](./quickstart.md))

**Target Platform**: Navegadores actuales, de 320 a 1440 px; Cloudflare Workers con renderizado en servidor

**Project Type**: Sitio web (aplicación web de un solo proyecto, SSR)

**Performance Goals**: CLS sin aportación de la funcionalidad (0 px de desplazamiento al abrir y cerrar); la invitación no participa en el LCP; INP de los controles ≤ 200 ms; tamaño del bundle de la home parecido al actual (se retira tanto código como se añade)

**Constraints**: sin precios ni plazos (FR-018, FR-018b); textos rastreables al catálogo (FR-016b); sin datos personales en GA4 (FR-026); identidad monocroma zinc; WCAG 2.2 AA; sin cambios en navbar, orden de secciones, cabeceras, Cloudflare ni dependencias

**Scale/Scope**: 1 ruta (`/`); 5 preguntas; 6 300 combinaciones de respuestas; 8 soluciones principales y 4 reglas de complementos; 6 eventos de analítica

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principio                                   | Comprobación                                                                                                                                                                                                  | Antes del diseño | Después del diseño                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| I. Producción protegida                     | Trabajo en la rama local `feat/diagnostico-captacion`; nada en `main`; cada commit, merge, push y despliegue con autorización expresa                                                                         | Cumple           | Cumple. La integración en `main` (D4) queda diferida y documentada abajo                                             |
| II. Arquitectura preservada                 | Sin sustituciones; sin dependencias nuevas; `<dialog>` nativo; una sección por componente (la ventana y la invitación son superposiciones, no secciones)                                                      | Cumple           | Cumple. Dos refactorizaciones sin cambio visible: `id` en el catálogo (R8) y planes a `src/lib/pricing-data.ts` (R9) |
| III. Especificación antes de implementación | Spec aprobada el 2026-11-07 con condiciones, todas incorporadas; D1–D4 resueltas o diferidas por el responsable                                                                                               | Cumple           | Cumple. D1 incorporada a la spec (FR-003a, FR-003b, FR-007b, FR-007c)                                                |
| IV. Reversión proporcional                  | Riesgo **alto** (captación de leads y analítica): plan de reversión escrito abajo, versión previa de Cloudflare identificada al desplegar, supervisión inmediata                                              | Cumple           | Cumple                                                                                                               |
| V. Calidad de código                        | TypeScript estricto sin `any`; errores explícitos en `sessionStorage` y portapapeles; sin `console.log`                                                                                                       | Cumple           | Cumple                                                                                                               |
| VI. Rendimiento                             | Mediciones informativas antes y después (no hay línea base aprobada)                                                                                                                                          | Cumple           | Cumple                                                                                                               |
| VII. Accesibilidad                          | Revisión manual de los criterios afectados más NVDA (quickstart §6); no se declara conformidad total                                                                                                          | Cumple           | Cumple                                                                                                               |
| VIII. Responsive y sistema visual           | Solo tokens existentes; etiquetas nuevas ("Comenzar diagnóstico gratuito", "Continuar por WhatsApp", "Copiar mensaje") documentadas en `CLAUDE.md` en el mismo cambio; verificación a 320, 375, 768 y 1440 px | Cumple           | Cumple                                                                                                               |
| IX. SEO técnico                             | La sección `#diagnostico` sigue renderizada en el servidor; sin rutas nuevas; sin interstitial bloqueante en móvil                                                                                            | Cumple           | Cumple                                                                                                               |
| X. Secretos y orígenes externos             | Sin secretos; sin orígenes nuevos, así que no cambian la CSP ni la política de privacidad                                                                                                                     | Cumple           | Cumple                                                                                                               |
| XI. Veracidad                               | Recomendaciones limitadas a lo publicado (tabla "Respaldo de cada recomendación"); sin cifras ni plazos                                                                                                       | Cumple           | Cumple                                                                                                               |
| XII. Ramas y commits                        | Rama `tipo/descripcion`; commits atómicos; diff revisable antes de cada commit                                                                                                                                | Cumple           | Cumple                                                                                                               |

**Resultado del gate**: se puede avanzar a `/speckit-tasks` cuando el responsable revise esta versión del plan.

## Decisiones del responsable (2026-11-07)

| ID  | Decisión                                                                                                                                                                | Estado                      | Dónde se refleja                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| D1  | Invitación móvil con contenido reducido; párrafo de apoyo sobre la primera pregunta; 25 % sin excepciones; si la tarjeta no cumple todas las condiciones, no se muestra | Aprobada con modificaciones | Spec FR-003, FR-003a, FR-003b, FR-007b, FR-007c, US3-3/10/11, SC-001, SC-010; [research.md](./research.md) R3 y R4 |
| D2  | Conservar `generate_lead` junto con `diagnosis_whatsapp_click`; ambos son un clic, nunca un envío ni un lead recibido                                                   | Aprobada                    | Spec FR-025, FR-025a, FR-026; R14; [contracts/analytics-events.md](./contracts/analytics-events.md)                |
| D3  | Botón de la sección: «Comenzar diagnóstico gratuito»                                                                                                                    | Aprobada                    | Spec FR-013a; R11                                                                                                  |
| D4  | Integración de Spec Kit en `main`                                                                                                                                       | Diferida                    | Sección "Integración en `main` (D4)" de este plan                                                                  |

**Pendiente de verificar por el responsable** (sin acceso desde este entorno): si `generate_lead` está marcado como evento clave en GA4.

## Project Structure

### Documentation (this feature)

```text
specs/001-diagnostico-captacion/
├── spec.md
├── plan.md              # Este archivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/           # Fase 1
│   ├── diagnosis-engine.md
│   ├── whatsapp-message.md
│   ├── analytics-events.md
│   └── open-diagnosis.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks; no se crea aquí)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── diagnosis-engine.ts      # NUEVO: opciones 2–5, recommend(), buildWhatsAppMessage() (puro)
│   ├── diagnosis.ts             # MODIFICADO: DiagnosisStartDetail, requestDiagnosis({source, business?}) sin desplazar
│   ├── diagnosis-invite.ts      # NUEVO: estado de la invitación en sessionStorage, con respaldo en memoria
│   ├── services-data.ts         # MODIFICADO: campo id tipado en los 14 servicios (sin cambios visibles)
│   ├── pricing-data.ts          # NUEVO: planes extraídos de Pricing.tsx (fuente única)
│   └── site.ts                  # SIN CAMBIOS: whatsappHref, WHATSAPP_NUMBER, trackEvent
├── components/
│   ├── DigitalDiagnosis.tsx     # MODIFICADO: solo la presentación de la sección y su botón «Comenzar diagnóstico gratuito»; se retiran wizard,
│   │                            #   madurez, rangos, MultiSelect, CostEstimator, Stars, MetricTile, MaturityBar
│   ├── DiagnosisDialog.tsx      # NUEVO: <dialog> con las 5 preguntas y el resultado; reutiliza SingleSelect
│   ├── DiagnosisInvite.tsx      # NUEVO: invitación (<dialog> en escritorio; <aside> fijo en móvil, con medición y supresión)
│   ├── DiagnosisShortcuts.tsx   # MODIFICADO: requestDiagnosis({ source: "atajo", business })
│   └── Pricing.tsx              # MODIFICADO: importa los planes desde pricing-data.ts (sin cambios visibles)
└── routes/
    └── index.tsx                # MODIFICADO: monta DiagnosisInvite y DiagnosisDialog (no cambia el orden de secciones)

CLAUDE.md                        # MODIFICADO: etiquetas de CTA nuevas
docs/ESTRUCTURA.md               # MODIFICADO: componentes y fuentes de datos nuevas
```

Fuera del repositorio (no se versiona): scripts de verificación en `C:\tmp\pwenv`.

**Structure Decision**: proyecto único existente. La lógica pura va a `src/lib/` (como `security-headers.ts` y `services-data.ts`) y la interfaz a `src/components/`, un archivo por pieza. `SingleSelect` se mueve de `DigitalDiagnosis.tsx` a `DiagnosisDialog.tsx`, su único consumidor, sin cambiar su comportamiento accesible. No se tocan `Nav.tsx`, `Footer.tsx`, `server.ts`, `security-headers.ts`, `public/_headers`, `wrangler.jsonc`, `vite.config.ts` ni `package.json`.

## Condiciones para la lista de tareas (aprobadas por el responsable, 2026-11-07)

`/speckit-tasks` debe incluir, como tareas explícitas:

**Analítica**

1. Inventario de los eventos que el sitio envía hoy a GA4 (`trackEvent` en `src/`), antes de cambiar nada.
2. Conservar `generate_lead` y `diagnosis_whatsapp_click` según [contracts/analytics-events.md](./contracts/analytics-events.md), con una sola emisión de cada por clic (FR-025a).
3. Prevenir duplicados por redibujado (efectos protegidos por apertura) y verificarlo (E16, E23).
4. Mantener diferenciados los clics de WhatsApp (`method: "whatsapp"`) de los contactos confirmados (`method: "contact_form"`).
5. Auditoría de eventos clave de GA4 en modo solo lectura antes de producción (E31). No se modifica la configuración de GA4 sin autorización.
6. Prohibición verificable de enviar respuestas individuales o datos personales (E16).

**Invitación móvil**

1. Las 14 configuraciones de pantalla (E20).
2. Zoom y texto ampliado (E25).
3. Cambios de orientación (E21).
4. Áreas seguras en dispositivos reales (§4.1).
5. Convivencia con el botón flotante de WhatsApp (E2, E20).
6. Teclado y tecnologías de apoyo (E26, §6).
7. Supresión automática cuando no se puedan cumplir las condiciones (E20, E21). Sin excepciones al 25 %.

**Restricciones de implementación**

Sin dependencias nuevas; reutilizar componentes existentes (`SingleSelect`, `whatsappHref`, `trackEvent`, evento `diagnosis:start`); motor determinista separado de la interfaz; una experiencia compartida; sin precios ni plazos; sin funcionalidades comerciales no publicadas; sin cambios innecesarios en navegación, infraestructura ni estilos globales.

**Integración**

La estrategia preferida es la alternativa A de "Integración en `main` (D4)". No autoriza ningún merge, push ni despliegue.

## Plan de reversión (Principio IV, riesgo alto)

- **Antes de desplegar**: anotar la versión de Cloudflare en producción (hoy `4cde89d3-1dfa-43b4-8513-9956b7a6647e`, commit `feca905`).
- **Commits atómicos** para revertir por partes: (1) refactor de datos (`id` y `pricing-data.ts`), (2) motor, (3) ventana y sección, (4) invitación, (5) documentación. La invitación (P3) puede revertirse sola sin perder el diagnóstico (P1, P2).
- **Señales de fallo en producción**:
  - la invitación aparece más de una vez por sesión, fuera de la home o antes de 2 s;
  - la tarjeta móvil supera el 25 %, tapa el header o el botón de WhatsApp, o aparece en un teléfono en horizontal;
  - el enlace de WhatsApp abre un número distinto o un mensaje incompleto;
  - errores de consola o de hidratación en `/`;
  - eventos de analítica con parámetros fuera del contrato;
  - caída de `generate_lead` (`method: "whatsapp"`) respecto a la semana anterior, o más de un `generate_lead` por clic.
- **Reversión**: `git revert` del commit afectado en una rama, con autorización, y push a `main` (nunca `reset --hard` ni `push --force`). Si el fallo es grave, mientras tanto se puede volver a la versión anterior desde el panel de Cloudflare (lo hace el responsable).
- **Supervisión tras el despliegue**: V9 de la constitución (Workers Builds en verde, cabeceras, carga de `/` y de una ruta de servicio), más E1, E2, E14 y E16 de [quickstart.md](./quickstart.md) contra producción con la analítica bloqueada.

## Integración en `main` (D4, diferida)

**Situación**: la rama contiene, sobre `main` (`feca905`), los commits de Spec Kit `759dacc` (scaffolding: 28 archivos en `.claude/skills/speckit-*` y `.specify/`), `183f9c4` (`.prettierignore`) y `b036cee` (constitución), más `df29bf8` (spec) y los commits futuros de esta funcionalidad (`specs/` y `src/`). Todo push a `main` despliega con Workers Builds y el repositorio es público; las ramas publicadas también pueden construirse en Cloudflare.

| Alternativa                                                                                       | Qué entra en `main`                                                              | Consecuencias                                                                                                                                             | Reversión                                                                      |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| A. Spec Kit primero, por separado; después la funcionalidad                                       | Paso 1: los 3 commits de Spec Kit. Paso 2: `specs/001-…` y los cambios de `src/` | Dos despliegues; el primero no cambia el sitio (solo documentación y configuración del agente), el segundo sí. Spec Kit y la constitución quedan públicos | `git revert` del paso afectado; el paso 1 se puede revertir sin tocar el sitio |
| B. Todo junto (fast-forward de la rama)                                                           | Spec Kit, specs y funcionalidad en un solo push                                  | Un despliegue; mezcla un cambio de gobierno del repositorio con uno de riesgo alto del sitio, lo que complica aislar un fallo                             | Revertir varios commits a la vez                                               |
| C. Solo la funcionalidad (rama nueva desde `main` con los commits de `src/` mediante cherry-pick) | Solo los cambios de `src/`, `CLAUDE.md` y `docs/`                                | Spec Kit y `specs/` siguen fuera del repositorio público; la trazabilidad spec ↔ código queda solo en local; los hashes cambian                           | `git revert` de los commits de la funcionalidad                                |

**Recomendación**: A. Separa el cambio sin efecto en el sitio del cambio de riesgo alto y deja una reversión independiente para cada uno.

**Antes de cualquier integración** (requisito del responsable): presentar la lista exacta de commits y archivos (`git log` y `git diff --stat main..<rama>`), qué se despliega, qué queda público, la versión de Cloudflare vigente para revertir y el procedimiento de reversión. Cada merge, push y despliegue requiere una autorización independiente. Ninguna rama se publica en GitHub sin autorización, para evitar construcciones de Cloudflare no previstas.

## Complexity Tracking

Sin infracciones de la constitución que justificar. El único bloqueo, D1, es un conflicto dentro de la spec, no una excepción a la constitución.
