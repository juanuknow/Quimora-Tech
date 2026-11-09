# Implementation Plan: Diagnóstico Digital Gratuito como herramienta de captación

**Branch**: `feat/diagnostico-captacion` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-diagnostico-captacion/spec.md`

## Summary

Convertir el diagnóstico de la home en una herramienta de captación: invitación a los 2,5 s (ventana con el contenido completo en escritorio; en móvil, tarjeta reducida no bloqueante que solo aparece si cumple el límite del 25 % y el resto de condiciones; una vez por sesión), una única ventana de diagnóstico con cinco preguntas, recomendación integral determinista limitada al catálogo publicado, sin precios ni plazos, y salida a WhatsApp con un mensaje completo y copiable. Enfoque técnico: un motor puro y verificable de forma exhaustiva (`diagnosis-engine.ts`), el elemento nativo `<dialog>`, el evento de ventana `diagnosis:start` ya existente como punto único de apertura, y los datos del catálogo y de los planes como fuentes únicas. Sin dependencias nuevas. Detalle en [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.9 (modo estricto), React 19.2, Node 24 para las verificaciones

**Primary Dependencies**: TanStack Start 1.168 (SSR), Vite 8, Tailwind CSS 4.2, lucide-react 0.575. Sin dependencias nuevas.

**Storage**: `sessionStorage` para el estado de la invitación (`qt:diagnosis-invite`) y las respuestas del último diagnóstico terminado (`qt:diagnosis-last-answers`); nada en servidor

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

**Resultado del gate**: la auditoría `/speckit-analyze` (2026-11-07) encontró 3 hallazgos críticos de alineación con la constitución (C1 MVP sin salida comercial, C2 etiquetas de CTA documentadas fuera de su commit, C3 V5 y V8 sin tarea), todos corregidos en esta versión. Se puede avanzar a `/speckit-implement` cuando el responsable apruebe la versión corregida.

## Decisiones del responsable (2026-11-07)

| ID  | Decisión                                                                                                                                                                | Estado                      | Dónde se refleja                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| D1  | Invitación móvil con contenido reducido; párrafo de apoyo sobre la primera pregunta; 25 % sin excepciones; si la tarjeta no cumple todas las condiciones, no se muestra | Aprobada con modificaciones | Spec FR-003, FR-003a, FR-003b, FR-007b, FR-007c, US3-3/10/11, SC-001, SC-010; [research.md](./research.md) R3 y R4 |
| D2  | Conservar `generate_lead` junto con `diagnosis_whatsapp_click`; ambos son un clic, nunca un envío ni un lead recibido                                                   | Aprobada                    | Spec FR-025, FR-025a, FR-026; R14; [contracts/analytics-events.md](./contracts/analytics-events.md)                |
| D3  | Botón de la sección: «Comenzar diagnóstico gratuito»                                                                                                                    | Aprobada                    | Spec FR-013a; R11                                                                                                  |
| D4  | Integración de Spec Kit en `main`                                                                                                                                       | Diferida                    | Sección "Integración en `main` (D4)" de este plan                                                                  |

**Bloqueo de publicación (A1, FR-025b)**: el responsable audita GA4 en solo lectura antes de producción. Si `generate_lead` es evento clave, la publicación queda bloqueada hasta que elija por escrito una alternativa de [contracts/analytics-events.md](./contracts/analytics-events.md) (A: evento clave derivado; B: mantener y documentar; C: desmarcar). Ninguna configuración de GA4 se cambia sin autorización expresa. Esto no bloquea la implementación local.

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
2. Conservar `generate_lead` y `diagnosis_whatsapp_click` según [contracts/analytics-events.md](./contracts/analytics-events.md), con una sola emisión de cada por clic (FR-025a). `generate_lead` se emite en la tarea del botón de WhatsApp (US2); `diagnosis_whatsapp_click`, en la de analítica (US4).
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

**Verificaciones obligatorias en cada propuesta de commit (C3)**

- **V5**: recorridos críticos a mano en `npm run dev` (formulario de contacto con éxito y error, enlaces de WhatsApp, anclas en escritorio y móvil, páginas legales, 404 y consola sin errores), además de lo que el cambio toque.
- **V8**: revisión de `git diff --cached`, incluido el contenido completo de los archivos nuevos, sin secretos ni credenciales; si aparece algo, detenerse sin reproducirlo.

**MVP publicable (C1)**

Fase 1, Fase 2, US1 y US2. El diagnóstico nunca pierde su salida comercial: el botón «Continuar por WhatsApp» y su `generate_lead` llegan en la misma tarea (US2). Los commits de US1 y de US2 no se integran por separado en `main`.

**Integración**

La estrategia preferida es la alternativa A de "Integración en `main` (D4)". No autoriza ningún merge, push ni despliegue.

## Plan de reversión (Principio IV, riesgo alto)

- **Antes de desplegar**: anotar la versión de Cloudflare en producción (hoy `4cde89d3-1dfa-43b4-8513-9956b7a6647e`, commit `feca905`).
- **Commits atómicos** (mismo orden que en [tasks.md](./tasks.md); cada uno con V5 y V8 y su autorización):

  | #   | Commit                                                             | Contenido                                                                                                    | ¿Se puede integrar solo?                                 |
  | --- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
  | 1   | `refactor(data): add stable service ids and extract pricing plans` | Fase 2                                                                                                       | Sí (sin cambio visible)                                  |
  | 2   | `feat(diagnosis): add deterministic recommendation engine`         | Motor y `shortExplanation` (US1)                                                                             | No: forma parte del MVP                                  |
  | 3   | `feat(diagnosis): shared diagnosis dialog and section`             | Ventana, sección, atajos y la etiqueta «Comenzar diagnóstico gratuito» en `CLAUDE.md` (US1)                  | No: sin US2 el diagnóstico perdería su salida a WhatsApp |
  | 4   | `feat(diagnosis): whatsapp handoff with copy fallback`             | Mensaje, «Continuar por WhatsApp» con `generate_lead`, «Copiar mensaje» y sus etiquetas en `CLAUDE.md` (US2) | Solo junto con 2 y 3 (**MVP publicable**)                |
  | 5   | `feat(diagnosis): home invitation with mobile suppression`         | Invitación completa, incluido `diagnosis_popup_view` (US3)                                                   | Sí, sobre el MVP                                         |
  | 6   | `feat(analytics): diagnosis funnel events without personal data`   | Resto de eventos del embudo (US4)                                                                            | Sí, sobre el MVP                                         |
  | 7   | `docs: document diagnosis feature`                                 | `docs/ESTRUCTURA.md`, `baseline*.md`, `validation.md`                                                        | Sí                                                       |

- **Retirar solo la invitación sin perder el diagnóstico ni WhatsApp (I2)**:
  1. **Retirada rápida** (recomendada ante un fallo de la invitación): un commit que solo quite `<DiagnosisInvite />` de `src/routes/index.tsx`. El componente queda sin montar, no aparece ninguna invitación y la sección, los atajos, la ventana, el resultado, WhatsApp y la analítica siguen intactos. `markInvite("completed")` en la ventana sigue siendo inocuo.
  2. **Retirada completa**: `git revert` del commit 5. Como `diagnosis_popup_view` vive en ese mismo commit, el commit 6 no toca `DiagnosisInvite.tsx`. Si el revert choca con el commit 6 en `DiagnosisDialog.tsx` (la llamada a `markInvite`), se resuelve conservando los eventos del commit 6.
- **Señales de fallo en producción**:
  - la invitación aparece más de una vez por sesión, fuera de la home, antes de 2 s o después de 3 s;
  - la ventana de escritorio aparece en un teléfono en horizontal, o la tarjeta móvil supera el 25 % o tapa el header o el botón de WhatsApp;
  - el enlace de WhatsApp abre un número distinto, un mensaje incompleto o de más de 2 000 caracteres;
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
