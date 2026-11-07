# Research: Diagnóstico Digital Gratuito como herramienta de captación

**Fecha**: 2026-11-07 · **Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

Cada apartado sigue el formato Decisión / Motivo / Alternativas. Las decisiones se basan en el código actual de la rama `feat/diagnostico-captacion` (base `main` = `feca905`).

## R1. Punto de partida: qué existe hoy

- `src/components/DigitalDiagnosis.tsx` (1 029 líneas): sección `#diagnostico` con tres fases (`intro`, `wizard`, `result`) incrustadas en la página. Contiene el modelo de preguntas (objetivo, funcionalidades, plazo, presupuesto), el motor `pickSolution`/`buildDiagnosis`, la puntuación de madurez, rangos de precio y tiempo (`COMPLEXITY_DATA`), la calculadora `CostEstimator`, y componentes de interfaz reutilizables: `SingleSelect` (radiogroup WAI-ARIA con tabulación itinerante y flechas, corregido en la Fase 1 de accesibilidad) y `MultiSelect`.
- `src/lib/diagnosis.ts`: tipos de negocio (`BUSINESS_OPTIONS`, nueve opciones con icono), evento de ventana `diagnosis:start` y `requestDiagnosis(business)`, que hoy abre el wizard y desplaza la página a `#diagnostico`.
- `src/components/DiagnosisShortcuts.tsx`: atajos "¿Cuál es tu caso?" que llaman a `requestDiagnosis`.
- `src/lib/site.ts`: `WHATSAPP_NUMBER`, `whatsappHref(text)` (usa `encodeURIComponent`) y `trackEvent(name, params)` (GA4 vía `gtag`, no-op sin `gtag`).
- `src/lib/services-data.ts`: catálogo publicado (14 servicios, 3 categorías). Seis servicios tienen `slug`, `longDescription` y `benefits`; el resto solo `title` y `body`. No existe un identificador estable por servicio.
- `src/components/Pricing.tsx`: los planes (`PLANS`) viven dentro del componente, no en `src/lib/`.
- Patrones de superposición existentes: el menú móvil de `Nav.tsx` bloquea el desplazamiento con `body.style.overflow = "hidden"`, cierra con Escape y devuelve el foco; se oculta con `inert`. No hay ningún `<dialog>` en el proyecto.
- `FloatingWhatsApp`: botón fijo de 56 × 56 px en `bottom-5 right-5` (20 px), `md:bottom-8 md:right-8`, `z-50`.
- Movimiento reducido: regla global en `src/styles.css` que lleva las animaciones a una duración mínima; varios componentes consultan `matchMedia("(prefers-reduced-motion: reduce)")`.
- Analítica actual del diagnóstico: el botón de WhatsApp del resultado envía `generate_lead` con `{ method: "whatsapp", source: "diagnostico" }`; los atajos envían `diagnosis_shortcut`.
- Sin ejecutor de pruebas en el repositorio (verificación P5 de la constitución, pendiente). Las validaciones previas se hicieron con scripts de Playwright y Node fuera del repositorio (`C:\tmp\pwenv`).

## R2. Ventana del diagnóstico e invitación de escritorio

**Decisión**: usar el elemento nativo `<dialog>` abierto con `showModal()` para la invitación de escritorio y para la ventana del diagnóstico.

**Motivo**: `showModal()` coloca el contenido en la capa superior (sin conflictos de `z-index`), vuelve inerte el resto del documento (cumple FR-007 y FR-028 sin una trampa de foco manual), gestiona Escape mediante el evento `cancel` y no altera el flujo del documento (FR-006, SC-005). No añade dependencias. Soporte: todos los navegadores actuales. La restauración del foco al cerrar se hace explícitamente guardando el elemento activo al abrir, porque el comportamiento automático no es uniforme entre navegadores.

**Alternativas**: un componente propio con `role="dialog"` y trampa de foco manual (más código, más riesgo de errores de accesibilidad); una librería como Radix Dialog (dependencia nueva de riesgo medio, innecesaria).

## R3. Tarjeta de invitación en móvil

**Decisión**: un `<aside>` con nombre accesible («Invitación al diagnóstico gratuito»), en posición fija en el borde inferior, con el contenido reducido de FR-003a: título «Descubre qué necesita tu negocio», texto «Gratis · Unos 2 minutos», «Comenzar diagnóstico gratuito», «Ahora no» y un botón de cierre de 44 × 44 px. Se coloca por encima del botón flotante de WhatsApp (borde inferior a 20 + 56 + 12 = 88 px más `env(safe-area-inset-bottom, 0px)`) y con márgenes laterales que suman `env(safe-area-inset-left/right, 0px)`. No usa `showModal`, no bloquea el desplazamiento y no mueve el foco; se anuncia una vez con una región `role="status"`. Escape la cierra si el foco está dentro.

**Disposición prevista**: fila superior con título y botón de cierre; texto secundario; fila inferior con «Comenzar diagnóstico gratuito» (ancho flexible) y «Ahora no». Estimación con la tipografía actual (sin medir aún en navegador): unos 140 px de alto a 375 px de ancho.

**Motivo**: FR-007a y FR-007b exigen que no bloquee, no capture el foco y no tape la navegación (arriba) ni el botón de WhatsApp (abajo a la derecha). Las variables de área segura valen 0 con el `viewport` actual (sin `viewport-fit=cover`), pero usarlas hace que la tarjeta siga siendo correcta si algún día se cambia el viewport, sin tocar ahora la configuración global.

**Alternativas**: tarjeta a la izquierda del botón (a 320 px quedarían unos 216 px de ancho, insuficientes para los dos botones de 44 px); banner superior (taparía el header).

## R4. Invitación móvil: contenido reducido y supresión (D1, resuelto)

**Decisión del responsable (2026-11-07)**: contenido reducido en móvil (FR-003a), el párrafo de apoyo sobre la primera pregunta (FR-003b), límite del 25 % sin excepciones y supresión de la invitación automática cuando la tarjeta no pueda cumplir todas las condiciones (FR-007b, FR-007c). Se descarta la excepción de 160 px propuesta en la primera versión del plan.

**Comprobación antes de mostrarla** (en el cliente, en el momento de mostrarla):

1. Se monta la tarjeta con `visibility: hidden` en su posición fija (no ocupa espacio en el flujo, así que no desplaza nada) y se mide con `getBoundingClientRect()`.
2. Se toma como altura visible `visualViewport.height` (o `innerHeight` si no existe).
3. Se comprueban las cinco condiciones de FR-007b:
   - alto de la tarjeta ≤ 25 % de la altura visible;
   - alto de cada control ≥ 44 px y ancho ≥ 44 px;
   - la tarjeta no se sale del área visible menos las áreas seguras;
   - no se cruza con el rectángulo del header (borde inferior del `<header>`) ni con el del botón flotante de WhatsApp;
   - (por construcción) no bloquea el desplazamiento ni toma el foco.
4. Si todas se cumplen, se hace visible, se escribe `shown` y se envía `diagnosis_popup_view` con `format: "card"`. Si alguna falla, se desmonta sin escribir estado ni enviar eventos (FR-007c).
5. Mientras está visible, un `resize` de `visualViewport` (giro, teclado, ventana) repite la comprobación; si falla, se oculta sin escribir `dismissed`. El estado `shown` ya escrito impide que reaparezca.

**Resultado esperado, a confirmar con medición real**: se muestra en la mayoría de teléfonos en vertical (por ejemplo, 375 × 667 o mayores) y se suprime en teléfonos en horizontal y en pantallas muy bajas (por ejemplo, 320 × 568, donde el 25 % es 142 px). Los umbrales reales salen de la matriz de pruebas de [quickstart.md](./quickstart.md), no de esta estimación.

**Cómo se comprueba**: Playwright en una matriz de pantallas (vertical y horizontal, de 320 × 568 a 430 × 932), registrando para cada una si la tarjeta se mostró y, en ese caso, las cinco condiciones medidas; además, revisión manual en al menos un iPhone con indicador de inicio y un Android reales (áreas seguras y barra del navegador), porque Playwright no simula las áreas seguras.

**Alternativas descartadas**: excepción de 160 px (incumple el 25 %, rechazada por el responsable); reducir el tamaño de los controles (incumple los 44 px); recortar el texto con puntos suspensivos (texto incompleto).

## R5. Cuándo y cómo aparece la invitación

**Decisión**:

- Se monta solo en la ruta `/` (`src/routes/index.tsx`), nunca en rutas secundarias (FR-001).
- Objetivo de aparición: 2 500 ms desde el inicio de la navegación (`performance.now()`), calculado al montar el componente en el cliente. Si la hidratación termina después de 2 500 ms, la invitación aparece 300 ms después de montar (nunca de inmediato). Así queda dentro de 2–3 s en dispositivos normales (SC-001).
- Antes de mostrarla se comprueba que el visitante no esté interactuando (FR-005): el elemento activo no es un campo de formulario (`input`, `textarea`, `select`, `[contenteditable]`), no está dentro de `#contacto` ni de la ventana del diagnóstico, el diagnóstico no está abierto y el menú móvil no está abierto (`[aria-controls="mobile-menu"][aria-expanded="true"]`). Si alguna se cumple, no se muestra en esa visita.
- No se lee `sessionStorage` durante el render (evita diferencias de hidratación); solo en efectos del cliente.

**Motivo**: es determinista y medible. Leer atributos del DOM evita acoplar el componente al estado interno de `Nav`.

**Alternativas**: un retardo aleatorio entre 2 y 3 s (no reproducible en pruebas); escuchar eventos de `Nav` (acoplamiento nuevo).

## R6. Estado de la invitación en la sesión

**Decisión**: clave `sessionStorage` `qt:diagnosis-invite` con los valores `shown`, `dismissed` y `completed`. Se escribe `shown` en el momento de mostrarla (FR-002: como máximo una vez por sesión, aunque se recargue sin cerrarla), `dismissed` al cerrarla y `completed` al llegar al resultado por cualquier vía. Cualquier valor presente impide mostrarla. Todo acceso va en `try/catch`; si el almacenamiento falla, se usa una variable en memoria y la invitación aparece como máximo una vez por carga de página, sin errores (caso límite de la spec).

**Alternativas**: `localStorage` (persistiría entre sesiones, contra FR-002); cookies (viajarían al servidor sin necesidad).

## R7. Motor de recomendación

**Decisión**: un módulo nuevo y puro `src/lib/diagnosis-engine.ts`, sin React ni iconos, que exporta las opciones de las preguntas 2 a 5 (códigos S1–S5, N1–N7, O1–O5, P1–P4), la función `recommend(answers)` (reglas R-P, R-K, R-C y R-N de la spec) y la función `buildWhatsAppMessage(answers, recommendation)`. Los textos de "qué es", "cómo trabajaría" y "beneficios" no se escriben en el motor: se leen del catálogo (`services-data.ts`) por identificador (FR-016a, FR-016b).

**Motivo**: un módulo puro se puede verificar de forma exhaustiva (6 300 combinaciones) con Node sin ejecutor de pruebas, y separa las reglas de la presentación. Es el mismo enfoque usado para verificar `security-headers.ts`.

**Alternativas**: dejar la lógica dentro del componente, como ahora (no verificable sin renderizar).

## R8. Identificadores estables del catálogo

**Decisión**: añadir un campo `id` obligatorio y tipado (unión de literales) a cada servicio de `services-data.ts`. El motor y la tabla "Respaldo de cada recomendación" referencian servicios por `id`. No cambia ningún texto visible.

**Motivo**: hoy solo seis servicios tienen `slug`, y buscar por título rompería en silencio si cambia una redacción. Un `id` tipado hace que TypeScript detecte referencias rotas.

**Alternativas**: buscar por título (frágil); usar `slug` (no existe en ocho servicios).

## R9. Complemento "Catálogo con enlace a WhatsApp" (R-K2)

**Decisión**: extraer los planes de `Pricing.tsx` a `src/lib/pricing-data.ts` (fuente única, como `services-data.ts`) y que `Pricing.tsx` los importe sin cambiar nada visible. El diagnóstico toma de ahí los textos de los componentes "Catálogo de productos o servicios" y "Enlace directo a WhatsApp" del plan Emprendedor. Los precios del plan no se leen ni se muestran (FR-018).

**Motivo**: evita duplicar textos comerciales (DRY y fuente única de `CLAUDE.md`) y hace rastreable el respaldo de R-K2 (FR-016b).

**Alternativas**: copiar el texto en el motor (duplicación que se desincroniza).

## R10. Bloqueo del desplazamiento

**Decisión**: la invitación de escritorio y la ventana del diagnóstico en escritorio no bloquean el desplazamiento del `body`; el contenido de la ventana usa `overscroll-behavior: contain`. En móvil (menos de 768 px), la ventana del diagnóstico a pantalla completa bloquea el desplazamiento con el mismo patrón que el menú móvil (guardar y restaurar `body.style.overflow`). La tarjeta móvil nunca lo bloquea.

**Motivo**: en escritorio, ocultar la barra de desplazamiento del `body` desplaza el contenido unos 15 px (cambio de diseño, contra FR-006), y evitarlo exigiría tocar estilos globales (`scrollbar-gutter`). `showModal()` ya vuelve inerte el fondo. En móvil las barras son superpuestas y no hay desplazamiento lateral.

**Alternativas**: bloqueo en todas las pantallas con compensación de la barra (más código y riesgo de saltos); `scrollbar-gutter: stable` global (cambio de estilos globales).

## R11. Integración con la sección, los atajos y la invitación

**Decisión**: una única `DiagnosisDialog` montada una vez en la home escucha el evento de ventana existente `diagnosis:start`. Su detalle pasa de `BusinessId` a `{ source: "invitacion" | "seccion" | "atajo"; business?: BusinessId }`. `requestDiagnosis` deja de desplazar la página y solo abre la ventana. La sección `#diagnostico` conserva su presentación renderizada en el servidor y su botón, ahora "Comenzar diagnóstico gratuito" (misma etiqueta que la invitación, una por destino según el sistema de CTAs).

**Motivo**: reutiliza el mecanismo ya probado entre ramas distintas del árbol de React, sin contexto global nuevo, y cumple FR-013a.

**Alternativas**: un contexto de React en la raíz (más cambios en `index.tsx` y acoplamiento); dos experiencias distintas (contra FR-013a).

## R12. Copiar el mensaje

**Decisión**: `navigator.clipboard.writeText` dentro de `try/catch`. Si falla (permiso denegado, contexto no seguro, API ausente), se muestra el mensaje completo en un `<textarea readOnly>` ya seleccionado, con instrucciones. El resultado se anuncia en una región `role="status"`.

**Alternativas**: `document.execCommand("copy")` (obsoleto).

## R13. Enlace y longitud del mensaje de WhatsApp

**Decisión**: reutilizar `whatsappHref(text)` (número `WHATSAPP_NUMBER`, `encodeURIComponent`, saltos de línea como `%0A`). El mensaje más largo posible (dos complementos y la explicación más extensa) se mide en la verificación exhaustiva; objetivo: URL codificada por debajo de 2 000 caracteres. Si se supera, se acorta la explicación del mensaje (no la de la pantalla).

**Motivo**: las tildes ocupan 6 caracteres codificados; un mensaje de unos 800 caracteres puede acercarse a ese límite, a partir del cual algunos clientes truncan.

## R14. Analítica

**Decisión**:

| Evento                        | Cuándo                                          | Parámetros                                  |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------- |
| `diagnosis_popup_view`        | Al mostrarse la invitación (una vez por sesión) | `format`: `dialog` o `card`                 |
| `diagnosis_start`             | Al abrirse la ventana del diagnóstico           | `source`: `invitacion`, `seccion` o `atajo` |
| `diagnosis_question_answered` | Al avanzar desde una pregunta respondida        | `step`: 1–5                                 |
| `diagnosis_complete`          | Al confirmar la quinta respuesta                | `solution_id`                               |
| `diagnosis_result_view`       | Al mostrarse el resultado                       | `solution_id`                               |
| `diagnosis_whatsapp_click`    | Al pulsar "Continuar por WhatsApp"              | `solution_id`                               |

Se envían desde manejadores de eventos, salvo `popup_view` y `result_view`, que se envían en un efecto protegido con una referencia por apertura para no duplicarse al volver a renderizar. `diagnosis_popup_view` solo se envía si la invitación llega a mostrarse (no cuando se suprime, R4). `diagnosis_shortcut` (con el tipo de negocio) se sustituye por `diagnosis_start` con `source: "atajo"`, sin el tipo de negocio, que sería una respuesta individual.

**`generate_lead` (D2, aprobado)**: hoy se emite en dos lugares. `Contact.tsx` la envía después de que Formspree confirma el envío (`method: "contact_form"`: lead recibido). `DigitalDiagnosis.tsx` la envía al hacer clic en WhatsApp (`method: "whatsapp"`, `source: "diagnostico"`: solo intención, porque el sitio no puede saber si el mensaje se envió). Se conserva tal cual en el clic de "Continuar por WhatsApp", junto con `diagnosis_whatsapp_click`, en el mismo manejador: un clic produce exactamente uno de cada (FR-025a). No se añade ningún evento ni texto que afirme que el mensaje se envió. Los informes de leads recibidos deben filtrar `method: "contact_form"`. Pendiente de verificar por el responsable en GA4: si `generate_lead` está marcado como evento clave, los clics de WhatsApp ya cuentan hoy como conversiones.

**Motivo**: cumple FR-025 a FR-027 y SC-007 sin enviar respuestas ni complementos.

## R15. Verificación sin ejecutor de pruebas

**Decisión**: mientras P5 siga pendiente, no se añade ningún ejecutor de pruebas al repositorio. La verificación se hace con:

1. Un script de Node fuera del repositorio que importa `diagnosis-engine.ts` (Node 24 elimina los tipos al importar) y recorre las 6 300 combinaciones (SC-003, SC-004, SC-011, longitud de URL).
2. Scripts de Playwright fuera del repositorio con la analítica bloqueada y `gtag` sustituido por un registrador (SC-001, SC-005 a SC-007, SC-010).
3. Las suites existentes: `nav-verify`, `nav-diag`, 50 pruebas de interacción, axe en 13 rutas × 2 viewports e inventario de contenido (SC-009).

**Alternativas**: añadir Vitest (requiere la decisión P5 de la constitución; fuera de alcance).

## R16. Rendimiento

**Decisión**: sin carga diferida. La ventana y la invitación se importan de forma estática; el código nuevo sustituye al retirado (`CostEstimator`, madurez, `MultiSelect`, rangos), así que el tamaño neto del bundle de la home debería quedar parecido. Se mide antes y después (informativo, Principio VI). La invitación no se renderiza en el servidor y no participa en el LCP.

**Alternativas**: `React.lazy` para la ventana (ahorro pequeño a cambio de una espera al pulsar).

## R17. Integración de la rama en `main` (D4, diferida)

**Hallazgo**: `feat/diagnostico-captacion` parte de `chore/spec-kit-integration`, que lleva 3 commits de Spec Kit que no están en `main`. Integrar esta rama en `main` publicaría también Spec Kit, la constitución y `specs/` en el repositorio público, y desplegaría con Workers Builds.

**Decisión del responsable (2026-11-07)**: diferida. Las alternativas, sus consecuencias y el procedimiento previo a cualquier integración están en el plan técnico ("Integración en `main` (D4)"). No se integra nada sin una autorización independiente.
