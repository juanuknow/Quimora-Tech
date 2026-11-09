---
description: "Lista de tareas de la funcionalidad 001: Diagnóstico Digital Gratuito como herramienta de captación"
---

# Tasks: Diagnóstico Digital Gratuito como herramienta de captación

**Input**: Documentos de diseño en `specs/001-diagnostico-captacion/` (spec, plan, research, data-model, contracts, quickstart, validation)

**Prerequisites**: plan.md y spec.md aprobados; decisiones D1–D4 y correcciones de la auditoría `/speckit-analyze` incorporadas (2026-11-07)

**Tests**: Solicitados por el responsable. No hay ejecutor de pruebas en el repositorio (P5 pendiente): las verificaciones son scripts de Node y Playwright **fuera del repositorio**, en `C:\tmp\pwenv\`, que no se versionan (research R15). En toda prueba automatizada se bloquean GA4 y Cloudflare Web Analytics y se sustituye `window.gtag` por un registrador.

**Organization**: Tareas agrupadas por historia de usuario (US1–US4) para implementarlas y verificarlas por separado. Una tarea está terminada cuando su evidencia figura en `specs/001-diagnostico-captacion/validation.md` (o en el archivo que indique la tarea).

**Reglas que aplican a todas las tareas**

- Rama `feat/diagnostico-captacion`; no cambiar de rama sin autorización.
- **Ningún commit, merge, push ni despliegue sin autorización expresa** para cada uno (Principio I). Antes de **cada** propuesta de commit: **V5** (recorridos críticos a mano en `npm run dev`) y **V8** (revisión de secretos en `git diff --cached`), anotados en `validation.md` §1.
- **MVP publicable = Fase 1 + Fase 2 + US1 + US2** (plan, C1). Los commits de US1 y US2 no se integran por separado: el diagnóstico nunca pierde su salida a WhatsApp.
- **Publicación bloqueada** hasta completar la auditoría de GA4 (`validation.md` §3, FR-025b) y la aprobación de textos (`validation.md` §2).
- Sin dependencias nuevas (`package.json` intacto). No modificar `src/components/Nav.tsx`, `src/components/Footer.tsx`, `src/server.ts`, `src/lib/security-headers.ts`, `public/`, `wrangler.jsonc`, `vite.config.ts` ni `src/styles.css`. No tocar Cloudflare ni GA4.
- Solo tokens existentes (paleta zinc, sin azul), escala tipográfica de `CLAUDE.md`, `FOCUS_RING`/`LIGHT_RING`, objetivos táctiles ≥ 44 px, `active:scale-[0.98]`, nunca `transition-all`.
- Sin precios, rangos, presupuestos ni plazos en ninguna pantalla (FR-018, FR-018b). Sin textos que no salgan del catálogo o de un plan publicados, salvo los aprobados en `validation.md` §2 (FR-016b).
- Las etiquetas de CTA nuevas se documentan en `CLAUDE.md` **en la misma tarea y el mismo commit** que las introduce (Principio VIII).
- Tareas marcadas **(Responsable)**: las ejecuta o aprueba el responsable; bloquean la publicación, no la implementación local.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: historia a la que pertenece (US1, US2, US3, US4)

---

## Phase 1: Setup (línea base)

**Purpose**: dejar medido el estado actual para comparar después. Cada tarea [P] escribe en un archivo propio.

- [x] T001 Verificar el punto de partida: rama `feat/diagnostico-captacion`, árbol limpio, `main` = `origin/main` = `feca905` y `.specify/feature.json` apuntando a `specs/001-diagnostico-captacion`. Si algo no coincide, detenerse e informar.
- [x] T002 Compilar la línea base con `npm run build`, copiar `.output` a `…\scratchpad\baseline-001\`, fijar `"compatibility_date": "2026-07-21"` en `server/wrangler.json` de la copia y servirla con `npx wrangler dev --local --port 8801 --ip 127.0.0.1 -c wrangler.json`.
- [x] T003 [P] Registrar la línea base en `specs/001-diagnostico-captacion/baseline.md`, contra el puerto 8801:
  - inventario y capturas de la home con `C:\tmp\pwenv\home-inventory.cjs` (1440, 768, 375 y 320 px);
  - `C:\tmp\pwenv\nav-verify.cjs` (30/30);
  - `C:\tmp\pwenv\fase3-prod-interact.cjs` (50/50);
  - `C:\tmp\pwenv\fase3-prod-axe.cjs` (total 22, solo `region`);
  - `C:\tmp\pwenv\liveperf-height.cjs`;
  - número de avisos de `npm run build`;
  - tamaño en bytes de los JS del cliente que carga `/` (en `.output/public/assets/`).
- [x] T004 [P] Inventario de eventos de GA4 en `specs/001-diagnostico-captacion/baseline-analytics.md`: todas las llamadas a `trackEvent(` y `gtag(` de `src/`, con evento, archivo, momento, parámetros y significado. Debe constar que:
  - `generate_lead` se envía en `src/components/Contact.tsx` tras confirmar Formspree (`method: "contact_form"`: lead recibido) y en `src/components/DigitalDiagnosis.tsx` al hacer clic en WhatsApp (`method: "whatsapp"`, `source: "diagnostico"`: solo intención);
  - `diagnosis_shortcut` lleva el tipo de negocio;
  - `FloatingWhatsApp` usa `contact` para el mismo tipo de clic.
- [x] T005 [P] Registrar en `specs/001-diagnostico-captacion/baseline-network.md` los orígenes de red que solicita `/`, con el registrador de `gtag` y sin enviar eventos reales, como referencia para E27.

**Checkpoint**: línea base documentada; servidor 8801 detenido (solo procesos de ese puerto, filtrando por nombre de ejecutable).

---

## Phase 2: Foundational (datos como fuente única)

**Purpose**: refactorizaciones sin cambio visible (research R8 y R9).

**⚠️ CRITICAL**: ninguna historia empieza hasta terminar esta fase.

- [x] T006 [P] En `src/lib/services-data.ts`, añadir el tipo exportado `ServiceId` y el campo obligatorio `id: ServiceId` a los 14 servicios, sin cambiar ningún texto:
  - `sitios-corporativos`, `landing-pages`, `tiendas-online`;
  - `sistemas-administrativos`, `paneles-gestion`, `inventario`, `ventas-caja`;
  - `plataformas-personalizadas`, `reservas-citas`, `automatizacion`, `integraciones-api`;
  - `portales-clientes`, `inteligencia-artificial`, `aplicaciones-escalables`.

  Exportar `getService(id: ServiceId): Service`.

- [x] T007 [P] Crear `src/lib/pricing-data.ts` con `PLANS` y `PLAN_INCLUDES` movidos literalmente desde `src/components/Pricing.tsx` (mismo contenido y `as const`) y el tipo `Plan = (typeof PLANS)[number]`. `src/components/Pricing.tsx` los importa y no cambia nada más.
- [x] T008 Verificar T006–T007 (`src/lib/services-data.ts`, `src/lib/pricing-data.ts` y `src/components/Pricing.tsx`):
  - `npx tsc --noEmit`, `npm run lint`, `npx prettier --check` de los tres archivos y `npm run build`, todos con código 0;
  - servir el build y comparar con `C:\tmp\pwenv\home-inventory-diff.cjs`: la home y `/servicios/*` idénticas a la línea base;
  - V5 y V8, anotados en `validation.md` §1.

**Checkpoint**: presentar el diff y pedir autorización para el **commit 1** `refactor(data): add stable service ids and extract pricing plans`.

---

## Phase 3: User Story 1 - Obtener una recomendación integral (Priority: P1) — parte del MVP

**Goal**: la sección `#diagnostico` abre una única ventana con cinco preguntas y un resultado integral, determinista, sin precios ni plazos, limitado a lo publicado.

**Independent Test**: desde la sección `#diagnostico`, responder las cinco preguntas y comprobar los bloques de FR-016 en orden, que la principal y cada complemento son publicados y justificados, y que no aparece ningún precio ni plazo (US1, escenarios 1–8). US1 sola **no se publica** (C1): se integra junto con US2.

### Motor (contracts/diagnosis-engine.md)

- [x] T009 [US1] Crear `src/lib/diagnosis-engine.ts`, un módulo puro (sin React, sin iconos, sin DOM), con:
  - los tipos `SituationId` (`"S1"`–`"S5"`), `NeedId` (`"N1"`–`"N7"`), `GoalId` (`"O1"`–`"O5"`), `PriorityId` (`"P1"`–`"P4"`), `AnswerOption<T> = { id: T; label: string }` y `CompleteAnswers`;
  - las constantes `SITUATION_OPTIONS`, `NEED_OPTIONS`, `GOAL_OPTIONS` y `PRIORITY_OPTIONS`, con las etiquetas literales de la tabla "Opciones de respuesta" de `spec.md`.
- [x] T010 [US1] Implementar `recommend(answers: CompleteAnswers): Recommendation` en `src/lib/diagnosis-engine.ts` según `data-model.md` y las tablas de la spec:
  - **R-P1–R-P8**: principal por necesidad. N1 → `sitios-corporativos` si la situación es `S4` o el objetivo es `O5`; si no, `landing-pages`.
  - **R-K1–R-K4** en ese orden, con R-C4 ("como máximo dos", sin repetir la principal ni repetirse) y los motivos literales de la tabla R-K.
  - **R-K2** con `kind: "plan-component"` y los textos "Catálogo de productos o servicios" y "Enlace directo a WhatsApp" leídos del plan Emprendedor de `src/lib/pricing-data.ts`.
  - **Contenido del catálogo**: `howItWorks` = `longDescription ?? body` y `benefits` = `benefits ?? []` del servicio principal, leídos con `getService` (FR-016a).
  - **Resumen y explicaciones**: `situationSummary` según R-C5; S3 y S4 como "una web nueva que reemplaza a la actual", nunca optimizar ni rediseñar; S5 + N2 como "tener una tienda propia" (R-C2). `explanation` y `shortExplanation`: una sola frase de como máximo 200 caracteres, con R-C3 cuando el objetivo no tenga regla.
  - **Próximo paso**: `nextStep` con los textos de R-N1–R-N4, que indican que la inversión se define con el asesor (FR-018a).
  - **Plazo**: `deliveryTime: null` siempre (FR-018b).
- [ ] T011 [US1] **(Responsable)** Copiar a `specs/001-diagnostico-captacion/validation.md` §2 todos los textos redactados en T010 que no son literales del catálogo o de un plan (resúmenes S1–S5 con sus variantes de R-C5, `explanation` y `shortExplanation` por regla, próximos pasos R-N, motivos R-K) y el párrafo de la sección de T017, para que el responsable los apruebe. **Sin aprobación no se propone el commit 2.**
- [x] T012 [P] [US1] Crear `C:\tmp\pwenv\engine-check.mjs` (fuera del repositorio), que importe `src/lib/diagnosis-engine.ts` con Node 24 y recorra las 6 300 combinaciones comprobando las garantías de `contracts/diagnosis-engine.md`:
  - determinismo;
  - principal entre los ocho `ServiceId` de R-P;
  - 0–2 complementos válidos con `rule` y `reason`;
  - ningún texto con `$`, `COP`, "precio" o "presupuesto";
  - `deliveryTime === null`;
  - `shortExplanation` de una frase y ≤ 200 caracteres;
  - "Sin escalado" (FR-015c);
  - distribución de 3 564 / 2 124 / 612 combinaciones con 0 / 1 / 2 complementos.

  Debe terminar con 0 errores.

### Interfaz (contracts/open-diagnosis.md) — T013 → T014 → T015–T018 en secuencia (U7: no compilar ni proponer commit entre medias)

- [x] T013 [US1] En `src/lib/diagnosis.ts`, añadir `DiagnosisStartDetail = { source: "invitacion" | "seccion" | "atajo"; business?: BusinessId }` y cambiar `requestDiagnosis(detail: DiagnosisStartDetail)` para que solo emita `DIAGNOSIS_START_EVENT` con ese detalle, **sin** `scrollIntoView`.
- [x] T014 [US1] Inmediatamente después de T013, en `src/components/DiagnosisShortcuts.tsx`, cambiar la llamada a `requestDiagnosis({ source: "atajo", business: id })`. El `trackEvent("diagnosis_shortcut", …)` se mantiene hasta T036 (US4).
- [x] T015 [US1] Crear `src/components/DiagnosisDialog.tsx` con `<dialog id="diagnosis-dialog">`, abierto con `showModal()` al recibir `DIAGNOSIS_START_EVENT`:
  - **Estado** según "Estado de la ventana del diagnóstico" de `data-model.md`; con `business` precargado empieza en la pregunta 2.
  - **Preguntas y progreso:** una por pantalla con "Pregunta N de 5"; "Atrás" desde la pregunta 2 sin perder respuestas; al intentar avanzar sin respuesta, no avanza y lo explica en texto (FR-010).
  - **Párrafo de apoyo:** sobre la pregunta 1, el texto de FR-003 en la misma pantalla. No aparece si se empieza en la pregunta 2 (FR-003b).
  - **Opciones:** `UiAnswerOption` con iconos de lucide-react para las preguntas 2–5 y `BUSINESS_OPTIONS` para la 1. Mover aquí `SingleSelect` desde `src/components/DigitalDiagnosis.tsx` sin cambiar su patrón WAI-ARIA.
  - **Cierre:** botón con nombre accesible y Escape (evento `cancel`). Guardar el elemento con foco al abrir y devolvérselo al cerrar (FR-028).
  - **Desplazamiento:** en ≥ 768 px no bloquea el `body` y usa `overscroll-behavior: contain` (R10). En < 768 px ocupa la pantalla completa y bloquea el `body` guardando y restaurando `body.style.overflow`.
  - **Movimiento reducido** respetado.
- [x] T016 [US1] En `src/components/DiagnosisDialog.tsx`, construir el resultado con los bloques de FR-016:
  1. "¡Tu diagnóstico está listo!";
  2. resumen;
  3. necesidad;
  4. solución;
  5. complementos con su motivo, solo si hay alguno;
  6. cómo trabajaría;
  7. beneficios, solo si la lista no está vacía;
  8. plazo, que se omite mientras `deliveryTime` sea `null`;
  9. próximo paso.

  Debe incluir el aviso "Es una orientación, no una auditoría técnica" y "Volver a empezar". Los bloques 10 y 11 (botones) llegan en T022 (US2). Sin puntuaciones, porcentajes, precios ni plazos.

- [x] T017 [US1] Rehacer `src/components/DigitalDiagnosis.tsx` como presentación de `#diagnostico` renderizada en el servidor:
  - **Se mantienen:** el distintivo, el `<h2>` y "Sin registro · 5 preguntas · Resultado al instante".
  - **Párrafo:** sustituir el que promete "el tiempo estimado de desarrollo y una aproximación del presupuesto" por el texto de FR-003.
  - **Botón:** «Comenzar diagnóstico gratuito», que llama a `requestDiagnosis({ source: "seccion" })`.
  - **Sin JavaScript:** `<noscript>` con «Escribir por WhatsApp».
  - **Se elimina (FR-020):** `Wizard`, `Result`, `MultiSelect`, `CostEstimator`, `MaturityBar`, `Stars`, `MetricTile`, `SummaryTile`, `computeMaturity`, `pickSolution`, `buildDiagnosis`, `SOLUTIONS`, `COMPLEXITY_DATA`, `BUDGET_OPTIONS`, `BUDGET_RANK`, `FEATURE_OPTIONS`, `FEATURE_LABEL`, `OBJECTIVE_OPTIONS`, `TIMING_OPTIONS`, `GAP_BY_SOLUTION`, `MOBILE_ABANDON_RATE`, `ASSUMED_RECOVERY_CONVERSION` y el oyente de `DIAGNOSIS_START_EVENT`.
  - **En la misma tarea (C2):** añadir a la tabla "Sistema de CTAs" de `CLAUDE.md` la fila «Comenzar diagnóstico gratuito» (abre el diagnóstico desde la sección `#diagnostico` y la invitación).
- [x] T018 [US1] Montar `<DiagnosisDialog />` una sola vez en `src/routes/index.tsx`, después de `<Footer />` y fuera de `<main>`, sin cambiar el orden de las secciones.

### Verificación US1

- [x] T019 [US1] Migrar en `C:\tmp\pwenv\fase3-prod-interact.cjs` las siete pruebas del radiogroup (líneas 139–163). Deben abrir la ventana con «Comenzar diagnóstico gratuito» en lugar de "Descubre qué solución necesita" y conservar las mismas aserciones (un solo tab-stop, flechas, Home y End). El total sigue en 50. Anotar cada cambio en `validation.md` §8.
- [x] T020 [US1] Verificar US1 (`src/lib/diagnosis-engine.ts`, `src/lib/diagnosis.ts`, `src/components/DiagnosisDialog.tsx`, `src/components/DigitalDiagnosis.tsx`, `src/components/DiagnosisShortcuts.tsx` y `src/routes/index.tsx`):
  - **Estáticas:** `npx tsc --noEmit`, `npm run lint`, `npx prettier --check` de los archivos tocados, `npm run build` y `node C:\tmp\pwenv\engine-check.mjs`.
  - **Escenarios:** servir el build y crear `C:\tmp\pwenv\diagnosis-e2e.cjs` con E9–E13, E17 (apertura y cierre de la ventana), E18, E19, E22, E24 y E28, a 1440 y 375 px.
  - **Regresión (G2):** `nav-verify.cjs` 30/30, `fase3-prod-interact.cjs` 50/50 (con T019), `fase3-prod-axe.cjs` en la home, `home-inventory-diff.cjs` (solo cambia `#diagnostico`) y `liveperf-height.cjs`.
  - **V5 y V8** en `validation.md` §1.

**Checkpoint**: con `validation.md` §2 aprobada, presentar el diff y pedir autorización para el **commit 2** `feat(diagnosis): add deterministic recommendation engine` (T009–T012) y el **commit 3** `feat(diagnosis): shared diagnosis dialog and section` (T013–T019). No se integran sin US2.

---

## Phase 4: User Story 2 - Continuar la conversación por WhatsApp (Priority: P2) — completa el MVP

**Goal**: el resultado abre WhatsApp con el mensaje completo (respuestas, solución, beneficios, complementos con motivo, explicación y próximo paso) sin enviarlo, y permite copiarlo. Conserva `generate_lead`.

**Independent Test**: completar un diagnóstico y comprobar que el enlace apunta al número principal con los elementos de FR-022 en orden y como máximo 2 000 caracteres, que un clic envía un único `generate_lead`, y que "Copiar mensaje" copia el mismo texto con y sin permiso del portapapeles (US2, escenarios 1–6).

- [x] T021 [US2] Implementar `buildWhatsAppMessage(answers, rec)` en `src/lib/diagnosis-engine.ts` con la plantilla literal de `contracts/whatsapp-message.md`:
  - los 13 elementos de FR-022 (12 si el servicio no publica beneficios);
  - los beneficios publicados del servicio principal;
  - cada complemento con su motivo, o "ninguno adicional";
  - `shortExplanation` y el próximo paso;
  - R-K2 nombrado "Catálogo de productos o servicios con enlace directo a WhatsApp".

  **Longitud (FR-022b):** el texto ≤ 2 000 caracteres. Si `whatsappHref(texto).length > 2000`, limitar los beneficios a los tres primeros y devolver `reduced: true`. Sin precios, plazos ni datos personales (FR-022a).

- [x] T022 [US2] En `src/components/DiagnosisDialog.tsx`, añadir al resultado:
  - el texto "Un asesor de Quimora Tech podrá revisar contigo esta recomendación y orientarte sobre la solución más adecuada para tu negocio.";
  - el enlace principal «Continuar por WhatsApp», con `href={whatsappHref(mensaje)}`, `target="_blank"`, `rel="noopener noreferrer"` y `NewTabHint`. Su manejador de clic envía **exactamente un** `trackEvent("generate_lead", { method: "whatsapp", source: "diagnostico" })`, conservando la medición actual (C1; su tratamiento en GA4 depende de la auditoría de `validation.md` §3);
  - el botón secundario «Copiar mensaje»: `navigator.clipboard.writeText` en `try/catch`, aviso en `role="status"`, y si falla, `<textarea readOnly>` ya seleccionado con el mismo texto e instrucciones.

  No pide nombre, correo ni teléfono. **En la misma tarea (C2):** añadir a "Sistema de CTAs" de `CLAUDE.md` las filas «Continuar por WhatsApp» (WhatsApp con el contexto del diagnóstico) y «Copiar mensaje» (acción local del resultado).

- [x] T023 [US2] Ampliar `C:\tmp\pwenv\engine-check.mjs` para comprobar en las 6 300 combinaciones:
  - los elementos de FR-022 en orden;
  - que `decodeURIComponent` del enlace devuelve exactamente el texto;
  - texto ≤ 2 000 caracteres y `reduced` aplicado solo cuando el enlace supera los 2 000;
  - sin precios ni datos personales.

  Informar del mensaje y del enlace más largos. Debe terminar con 0 errores.

- [x] T024 [US2] Verificar US2 (`src/lib/diagnosis-engine.ts`, `src/components/DiagnosisDialog.tsx` y `CLAUDE.md`):
  - ampliar `C:\tmp\pwenv\diagnosis-e2e.cjs` con E14 (`href` con `WHATSAPP_NUMBER`, texto decodificado igual al esperado para una combinación fija, ≤ 2 000 caracteres, nada enviado) y E15 (portapapeles concedido y denegado; texto idéntico al del enlace; aviso anunciado);
  - comprobar con el registrador de `gtag` que un clic produce un solo `generate_lead`;
  - repetir la regresión de T020;
  - V5 y V8 en `validation.md` §1.

**Checkpoint (MVP publicable)**: presentar el diff y pedir autorización para el **commit 4** `feat(diagnosis): whatsapp handoff with copy fallback`. Los commits 2, 3 y 4 forman el MVP y solo pueden integrarse juntos, con autorización independiente y tras `validation.md` §2 y §3.

---

## Phase 5: User Story 3 - Invitación al entrar en la página principal (Priority: P3)

**Goal**: invitación a los 2,5 s, una vez por sesión. Ventana con al menos 768 × 640 px; tarjeta reducida en el resto, solo si cumple las cinco condiciones de FR-007b.

**Independent Test**: sesiones nuevas en escritorio, tableta y la matriz móvil: aparece entre 2,0 y 3,0 s solo donde corresponde, con la variante correcta; no reaparece en la sesión; donde se suprime, el diagnóstico sigue disponible (US3, escenarios 1–11). Empieza tras US2 (comparten `DiagnosisDialog.tsx`), salvo T025.

- [x] T025 [P] [US3] Crear `src/lib/diagnosis-invite.ts` según `contracts/open-diagnosis.md`:
  - clave `qt:diagnosis-invite` con los valores `"shown" | "dismissed" | "completed"`;
  - `readInviteState()` y `markInvite(state)`, con todo acceso a `sessionStorage` en `try/catch` y respaldo en memoria;
  - `canShowInvite()`, que devuelve `false` si existe cualquier valor.

  Nunca se lee durante el render.

- [x] T026 [US3] En `src/components/DiagnosisDialog.tsx` (después de T022), llamar a `markInvite("completed")` al mostrarse el resultado, venga de donde venga (FR-002).
- [x] T027 [US3] Crear `src/components/DiagnosisInvite.tsx` con la planificación:
  - **Momento:** efecto solo en el cliente. Si `performance.now() > 2700` al montar, no mostrar en esa carga ni escribir estado (FR-001, U1). Si no, retardo de `Math.max(300, 2500 - performance.now())` ms.
  - **Guardas antes de mostrar:** `canShowInvite()` y FR-005. No se muestra si el elemento activo es `input`, `textarea`, `select` o `[contenteditable]`, si está dentro de `#contacto`, si `document.getElementById("diagnosis-dialog")?.open` es verdadero (U3) o si existe `[aria-controls="mobile-menu"][aria-expanded="true"]`.
  - **Variante:** ventana si `matchMedia("(min-width: 768px) and (min-height: 640px)").matches`; en cualquier otro caso, tarjeta (FR-007, FR-007a, I1).
- [x] T028 [US3] Variante de ventana en `src/components/DiagnosisInvite.tsx`: `<dialog>` con `showModal()` y el contenido literal de FR-003 (título, párrafo, "Unos 2 minutos", «Comenzar diagnóstico gratuito», «Ahora no» y cierre "Cerrar invitación"). Acciones según la tabla "Acciones de la invitación" de `contracts/open-diagnosis.md`:
  - `markInvite("shown")` al mostrarse;
  - «Comenzar…» cierra y llama a `requestDiagnosis({ source: "invitacion" })`;
  - «Ahora no», el cierre y Escape llaman a `markInvite("dismissed")` y el foco vuelve al elemento previo o a `#main`.

  No bloquea el desplazamiento.

- [x] T029 [US3] Variante de tarjeta en `src/components/DiagnosisInvite.tsx`:
  - **Contenedor:** `<aside aria-label="Invitación al diagnóstico gratuito">` fijo, con `bottom: calc(88px + env(safe-area-inset-bottom, 0px))` y márgenes laterales de 16 px más `env(safe-area-inset-left/right, 0px)`.
  - **Contenido literal de FR-003a:** "Descubre qué necesita tu negocio", "Gratis · Unos 2 minutos", «Comenzar diagnóstico gratuito», «Ahora no» y cierre de 44 × 44 px; todos los controles ≥ 44 × 44 px.
  - **Anuncio** una vez en `role="status"`.
  - **Acciones (U2):** «Comenzar…» oculta la tarjeta y llama a `requestDiagnosis({ source: "invitacion" })`. «Ahora no», el cierre y Escape (solo con el foco dentro) llaman a `markInvite("dismissed")` y la ocultan; si el foco estaba dentro, pasa a `#main`.
  - **No modal:** no mueve el foco al aparecer, no bloquea el desplazamiento y no usa `showModal`.
- [x] T030 [US3] Medición y supresión (FR-007c) en `src/components/DiagnosisInvite.tsx`:
  - montar la tarjeta con `visibility: hidden`, medir con `getBoundingClientRect()` y tomar la altura de `visualViewport.height` (o `innerHeight`);
  - exigir las cinco condiciones de FR-007b: "(1) ocupar como máximo el 25 % de la altura visible en ese momento; (2) mantener todos sus controles con un objetivo táctil de al menos 44 × 44 px; (3) quedar dentro de las áreas seguras del dispositivo; (4) no tapar la barra de navegación ni el botón flotante de WhatsApp; (5) no bloquear el desplazamiento ni capturar el foco";
  - si se cumplen, mostrarla y llamar a `markInvite("shown")`; si no, desmontarla sin estado;
  - con `resize` de `visualViewport`, volver a comprobar y ocultarla sin `dismissed` si deja de cumplirse;
  - limpiar los oyentes; sin excepciones al 25 %.
- [x] T031 [US3] En `src/components/DiagnosisInvite.tsx`, enviar `trackEvent("diagnosis_popup_view", { format: "dialog" | "card" })` solo cuando la invitación llega a mostrarse (nunca si se suprime o queda fuera de plazo), protegido por una referencia contra repeticiones. Vive en esta historia para que la invitación se pueda revertir sola (I2).
- [x] T032 [US3] Montar `<DiagnosisInvite />` solo en `src/routes/index.tsx` (no en `__root.tsx`), junto a `<DiagnosisDialog />` y en una línea propia, para poder retirarlo con un commit de una línea (plan, "Retirada rápida").
- [x] T033 [US3] Crear `C:\tmp\pwenv\invite-e2e.cjs` con:
  - **E1–E8, E17, E18, E21 y E33.**
  - **E20**, las 17 pantallas: las 14 móviles en vertical y en horizontal, más 768 × 1024, 1024 × 768 y 1024 × 600. Para cada una, variante esperada y obtenida, mostrada o suprimida, y las cinco condiciones medidas; la condición 3 como "dentro del `visualViewport`". Tabla en `validation.md` §5.
  - **E25:** zoom al 200 % a 1280 px, y tamaño de letra raíz al 130 % y al 200 %.
  - **E26:** Tab, nombre accesible, anuncio y Escape.
  - **Convivencia con el botón de WhatsApp:** por intersección de rectángulos en E2 y E20.

  Con la analítica bloqueada, todos deben pasar. Después, V5 y V8 en `validation.md` §1.

- [ ] T034 [US3] **(Responsable)** Revisión en dispositivos reales (`quickstart.md` §4.1): un iPhone con indicador de inicio y un Android, en vertical y en horizontal, con TalkBack y VoiceOver. Resultados y capturas en `validation.md` §4. Requiere servir el build en la red local o en un entorno autorizado; no publicar ramas sin autorización.

**Checkpoint**: presentar el diff y pedir autorización para el **commit 5** `feat(diagnosis): home invitation with mobile suppression` (T025–T033).

---

## Phase 6: User Story 4 - Medir el embudo sin datos personales (Priority: P4)

**Goal**: el resto de eventos del embudo, sin duplicados ni datos personales, distinguiendo intención de contacto y lead confirmado.

**Independent Test**: recorrido completo con el registrador de `gtag`: secuencia exacta de SC-007, un `diagnosis_whatsapp_click` y un `generate_lead` por clic, y solo los parámetros del contrato (US4, escenarios 1–3).

- [x] T035 [US4] En `src/components/DiagnosisDialog.tsx`, enviar:
  - `diagnosis_start` con `{ source }` al abrirse;
  - `diagnosis_question_answered` con `{ step }` (1–5) en el manejador de avance;
  - `diagnosis_complete` con `{ solution_id }` al confirmar la quinta respuesta;
  - `diagnosis_result_view` con `{ solution_id }` en un efecto protegido por apertura;
  - `diagnosis_whatsapp_click` con `{ solution_id }` en el mismo manejador que el `generate_lead` de T022, una sola vez por clic (FR-025a).

  Ningún otro parámetro; nunca respuestas, códigos de respuesta ni complementos (FR-026).

- [x] T036 [P] [US4] En `src/components/DiagnosisShortcuts.tsx`, quitar `trackEvent("diagnosis_shortcut", { business: id })`, sustituido por `diagnosis_start` con `source: "atajo"`, sin el tipo de negocio.
- [x] T037 [US4] Crear `C:\tmp\pwenv\analytics-e2e.cjs`, que sustituya `window.gtag` con `addInitScript` y bloquee la red de analítica:
  - **E16:** secuencia exacta de SC-007 desde la invitación; parámetros dentro de la lista blanca del contrato; ninguna respuesta, código ni complemento; sin duplicados al forzar un nuevo renderizado.
  - **E23:** un clic produce exactamente un `diagnosis_whatsapp_click` y un `generate_lead`.
  - **E27:** sin orígenes nuevos frente a `baseline-network.md`.

  Después, V5 y V8 en `validation.md` §1.

- [x] T038 [US4] Completar `specs/001-diagnostico-captacion/baseline-analytics.md` (sección "Analítica final") con:
  - la tabla definitiva de eventos;
  - la regla de informes: leads recibidos = `generate_lead` con `method: "contact_form"`; clics de WhatsApp = `method: "whatsapp"` (intención, nunca envío);
  - la diferencia entre `diagnosis_complete` y `diagnosis_result_view` (D1);
  - la fecha en que deja de enviarse `diagnosis_shortcut`.
- [ ] T039 [US4] **(Responsable)** Auditoría E31 de GA4 en **solo lectura**: si `generate_lead` es evento clave y si hay herramientas conectadas que importen esas conversiones. Si lo es, elegir por escrito una alternativa de `contracts/analytics-events.md` (A, B o C). Resultado en `validation.md` §3. **La publicación queda bloqueada hasta completarla** (FR-025b). No se modifica GA4 sin autorización expresa.

**Checkpoint**: presentar el diff y pedir autorización para el **commit 6** `feat(analytics): diagnosis funnel events without personal data` (T035–T036).

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: documentación, verificaciones de la constitución, regresión completa y preparación de la integración.

- [x] T040 [P] Comprobar la coherencia de la tabla "Sistema de CTAs" de `CLAUDE.md` con las etiquetas implementadas (filas añadidas en T017 y T022); no añade filas nuevas (C2).
- [x] T041 [P] En `docs/ESTRUCTURA.md`, actualizar las tablas de componentes y datos: `DiagnosisDialog`, `DiagnosisInvite`, `src/lib/diagnosis-engine.ts`, `src/lib/diagnosis-invite.ts` y `src/lib/pricing-data.ts`; `DigitalDiagnosis` pasa a ser solo la presentación de la sección. Quitar las referencias a elementos retirados.
- [x] T042 Verificaciones V1–V4: `npx tsc --noEmit`, `npm run lint`, `npx prettier --check <archivos modificados>` y `npm run build`, con código 0 y el mismo número de avisos de build que en `baseline.md`.
- [x] T043 Revisión estática E29 de `src/` y del diff `main..HEAD`:
  - ningún color literal (`#…`, `rgb(`) ni clase de color azul (`blue`, `sky`, `indigo`, `cyan`) en los archivos nuevos o modificados;
  - `git diff --stat main..HEAD -- src/components/Nav.tsx src/components/Footer.tsx src/server.ts src/lib/security-headers.ts public wrangler.jsonc vite.config.ts src/styles.css package.json package-lock.json` vacío.
- [x] T044 Regresión (`quickstart.md` §5) contra el build:
  - `nav-verify.cjs` 30/30 y `nav-diag.cjs` con 0 px de desvío;
  - `fase3-prod-interact.cjs` 50/50;
  - `liveperf-height.cjs` estable;
  - `home-inventory-diff.cjs` (solo cambia `#diagnostico`);
  - E34: enlaces `/#diagnostico` desde `/para/*`.
- [x] T045 axe en 13 rutas × 2 viewports (`fase3-prod-axe.cjs`) sin infracciones nuevas frente a `baseline.md` (22, solo `region`), y axe adicional con la invitación abierta (ventana y tarjeta), con una pregunta y con el resultado visibles. Resultado en `validation.md` §6.
- [ ] T046 Revisión manual de accesibilidad (`quickstart.md` §6: 2.1.1, 2.4.3, 2.4.7, 2.4.11, 1.4.3, 1.4.11, 1.4.4, 1.4.10, 2.5.8, 1.3.1, 3.3.2 y movimiento reducido), registrada en `validation.md` §6 como "sin fallos conocidos en los criterios revisados". La prueba con NVDA la hace el responsable **(Responsable)**.
- [ ] T047 **(Responsable)** E30: prueba cronometrada con al menos una persona ajena al proyecto y sin conocimientos técnicos (objetivo: menos de 2 minutos). Resultado en `validation.md` §7, sin datos personales.
- [x] T048 [P] Capturas antes y después (`quickstart.md` §7) a 1440, 768, 375 y 320 px, guardadas en `…\scratchpad\captures-001\`: sección, ventana de invitación, tarjeta móvil o constancia de su supresión, una pregunta y el resultado con 0, 1 y 2 complementos. Esta tarea no escribe en `validation.md`; la lista se consolida en T051.
- [x] T049 [P] Medir el rendimiento informativo (Principio VI): tamaño de los JS de `/` y CLS al abrir y cerrar la invitación (debe ser 0). Guardar los valores en `specs/001-diagnostico-captacion/perf-001.md` y compararlos con `baseline.md`.
- [x] T050 Preparar el informe de integración (D4, alternativa A) en `specs/001-diagnostico-captacion/integration-report.md`:
  - commits exactos (`git log --oneline main..HEAD`) y archivos (`git diff --stat main..HEAD`);
  - qué se despliega y qué queda público;
  - la versión de Cloudflare vigente para revertir;
  - el procedimiento de reversión, incluida la retirada rápida de la invitación;
  - el estado de `validation.md` §2 y §3.

  **No ejecutar ningún merge, push ni despliegue.**

- [x] T051 Consolidar en `specs/001-diagnostico-captacion/validation.md` §9 la lista de capturas de T048 y el resumen de `perf-001.md`. Presentar al responsable el diff completo, los resultados de T040–T049 y el estado de Git, y, tras V5 y V8, pedir autorización para el **commit 7** `docs: document diagnosis feature` (`docs/ESTRUCTURA.md`, `specs/001-diagnostico-captacion/baseline.md`, `baseline-analytics.md`, `baseline-network.md`, `perf-001.md`, `integration-report.md` y `validation.md`).
- [ ] T052 Solo después de un despliegue autorizado: supervisión según el plan de reversión de `specs/001-diagnostico-captacion/plan.md`:
  - V9 (Workers Builds en verde, cabeceras con `curl -I`, carga de `/` y de una ruta de servicio);
  - E1, E2, E14 y E16 contra producción con la analítica bloqueada;
  - E32 en GA4 en tiempo real o DebugView, en solo lectura **(Responsable)**.

  Resultados y versión de Cloudflare en `validation.md` §10.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup; bloquea todas las historias.
- **US1 (Phase 3)**: depende de Foundational. **No se publica sola.**
- **US2 (Phase 4)**: depende de US1. Con US1 forma el **MVP publicable**.
- **US3 (Phase 5)**: depende de US2, porque T026 edita `DiagnosisDialog.tsx` después de T022. T025 puede adelantarse en paralelo a US2.
- **US4 (Phase 6)**: depende de US2 (el manejador de WhatsApp de T022) y de US1. No depende de US3: `diagnosis_popup_view` vive en US3.
- **Polish (Phase 7)**: depende de las historias que se vayan a entregar. T052 depende de un despliegue autorizado.
- **Publicación**: además, `validation.md` §2 (textos) y §3 (GA4) completas.

### Within Each User Story

- Motor antes que interfaz (T009 → T010 → T011 y T012; T021 → T023).
- T013 → T014 → T015–T018 en secuencia, sin commits ni compilaciones intermedias (U7).
- T015 y T016 antes que T017 y T018.
- T022 antes que T026 y que T035 (mismo archivo, `DiagnosisDialog.tsx`).
- T025 antes que T027–T031.
- Verificación (T020, T024, T033, T037) al final de cada historia, antes de proponer su commit.

### Parallel Opportunities (sin archivos compartidos)

| Tarea [P] | Archivo que escribe                                     | En paralelo con             |
| --------- | ------------------------------------------------------- | --------------------------- |
| T003      | `baseline.md`                                           | T004, T005                  |
| T004      | `baseline-analytics.md`                                 | T003, T005                  |
| T005      | `baseline-network.md`                                   | T003, T004                  |
| T006      | `src/lib/services-data.ts`                              | T007                        |
| T007      | `src/lib/pricing-data.ts`, `src/components/Pricing.tsx` | T006                        |
| T012      | `C:\tmp\pwenv\engine-check.mjs`                         | T013–T018 (después de T010) |
| T025      | `src/lib/diagnosis-invite.ts`                           | Tareas de US2               |
| T036      | `src/components/DiagnosisShortcuts.tsx`                 | T035                        |
| T040      | `CLAUDE.md` (solo lectura salvo corrección)             | T041, T048, T049            |
| T041      | `docs/ESTRUCTURA.md`                                    | T040, T048, T049            |
| T048      | `…\scratchpad\captures-001\`                            | T040, T041, T049            |
| T049      | `perf-001.md`                                           | T040, T041, T048            |

---

## Parallel Example: User Story 1

```text
Task: "T012 Crear C:\tmp\pwenv\engine-check.mjs con las 6 300 combinaciones (tras T010)"
Task: "T013 → T014 → T015 en secuencia (requestDiagnosis, atajos y ventana)"
```

## Parallel Example: User Story 3

```text
Task: "T025 Crear src/lib/diagnosis-invite.ts (mientras se termina US2)"
Task: "T024 Verificar US2"
```

---

## Implementation Strategy

### MVP publicable (Fase 1 + Fase 2 + US1 + US2)

1. Línea base y datos (commit 1, que se puede integrar solo).
2. US1: motor, aprobación de textos, ventana y sección (commits 2 y 3, sin integrar).
3. US2: mensaje completo, WhatsApp con `generate_lead` y copiar (commit 4).
4. **Parar y validar** (T020, T024). Los commits 2–4 se integran juntos, con autorización, tras `validation.md` §2 y §3.

### Entrega incremental

1. MVP → diagnóstico honesto con su salida comercial intacta.
2. US3 → invitación, que se puede retirar sola (retirada rápida o revert del commit 5) sin perder el diagnóstico ni WhatsApp.
3. US4 → medición del embudo.
4. Polish → documentación, regresión completa, accesibilidad e informe de integración.

La integración en `main` sigue la alternativa A del plan y requiere autorizaciones independientes.

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes (ver tabla de oportunidades de paralelismo).
- [USn] = trazabilidad con la historia de la spec; la matriz requisito → verificación está en `quickstart.md` §8.
- Los scripts de `C:\tmp\pwenv\` no se versionan; los resultados se registran en `baseline*.md`, `perf-001.md` y `validation.md`.
- Detener los servidores de prueba solo por puerto y nombre de ejecutable (`wrangler`, `node`, `workerd`, `esbuild`); nunca cerrar procesos ajenos a la sesión.
