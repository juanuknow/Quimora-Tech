# Baseline: eventos de GA4 antes de la funcionalidad 001

**Fecha**: 2026-11-07 · Inventario de T004: todas las llamadas a `trackEvent(` y `gtag(` en `src/`.

`trackEvent(name, params)` (`src/lib/site.ts`) llama a `window.gtag("event", …)` si existe; no hace nada en el servidor ni sin `gtag`. GA4 se carga en `src/routes/__root.tsx` con `gtag('config', GA_MEASUREMENT_ID)`.

| Evento               | Archivo                                    | Cuándo se envía                                                     | Parámetros                                          | Significado                                                         |
| -------------------- | ------------------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| `generate_lead`      | `src/components/Contact.tsx:78`            | Después de que Formspree responde correctamente                     | `method: "contact_form"`                            | **Lead recibido** (envío confirmado)                                |
| `generate_lead`      | `src/components/DigitalDiagnosis.tsx:934`  | Al hacer clic en el botón de WhatsApp del resultado del diagnóstico | `method: "whatsapp"`, `source: "diagnostico"`       | **Intención** de contactar: el sitio no sabe si el mensaje se envió |
| `diagnosis_shortcut` | `src/components/DiagnosisShortcuts.tsx:33` | Al pulsar un atajo "¿Cuál es tu caso?"                              | `business` (tipo de negocio elegido)                | Elección de caso; incluye una respuesta del visitante               |
| `contact`            | `src/components/FloatingWhatsApp.tsx:21`   | Clic en el botón flotante de WhatsApp                               | `method: "whatsapp"`, `location: "floating"`        | Intención de contactar                                              |
| `contact`            | `src/components/ServiceDetail.tsx:110`     | Clic en WhatsApp de `/servicios/*`                                  | `method: "whatsapp"`, `location: "servicio-<slug>"` | Intención de contactar                                              |
| `contact`            | `src/components/SoftwareSolutions.tsx:103` | Clic en WhatsApp de la sección de soluciones                        | `method: "whatsapp"`, `location: "soluciones"`      | Intención de contactar                                              |
| `contact`            | `src/components/VerticalDetail.tsx:113`    | Clic en WhatsApp de `/para/*`                                       | `method: "whatsapp"`, `location: "vertical-<slug>"` | Intención de contactar                                              |

**Observaciones**

- `generate_lead` mezcla hoy dos significados (lead recibido e intención), distinguibles solo por `method`.
- El resto de clics de WhatsApp del sitio usan `contact`, no `generate_lead`: la semántica del diagnóstico es distinta a la del resto del sitio (preexistente; se conserva por la decisión D2).
- `diagnosis_shortcut` envía el tipo de negocio, que la spec considera una respuesta individual (FR-026); la funcionalidad lo retira (T036).

## Analítica final

**Fecha**: 2026-11-07 · Estado tras la funcionalidad 001, verificado con `analytics-e2e.cjs` (21/21) contra el build local, con GA4 bloqueado: los eventos se leen de `window.dataLayer` y no se envían.

| Evento                        | Archivo                                                                                                                   | Cuándo                                                                  | Parámetros                                     | Significado                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `diagnosis_popup_view`        | `src/components/DiagnosisInvite.tsx`                                                                                      | Al mostrarse la invitación (nunca si se suprime o queda fuera de plazo) | `format`: `dialog` \| `card`                   | Alcance de la invitación                        |
| `diagnosis_start`             | `src/components/DiagnosisDialog.tsx`                                                                                      | Al abrirse la ventana del diagnóstico                                   | `source`: `invitacion` \| `seccion` \| `atajo` | Inicio del embudo                               |
| `diagnosis_question_answered` | `src/components/DiagnosisDialog.tsx`                                                                                      | Al avanzar desde una pregunta respondida                                | `step`: 1–5                                    | Avance; nunca la respuesta                      |
| `diagnosis_complete`          | `src/components/DiagnosisDialog.tsx`                                                                                      | Al confirmar la quinta respuesta                                        | `solution_id`                                  | Diagnóstico terminado                           |
| `diagnosis_result_view`       | `src/components/DiagnosisDialog.tsx`                                                                                      | Al mostrarse el resultado (una vez por resultado)                       | `solution_id`                                  | Resultado visto                                 |
| `diagnosis_whatsapp_click`    | `src/components/DiagnosisDialog.tsx`                                                                                      | Clic en «Continuar por WhatsApp»                                        | `solution_id`                                  | **Intención** de contactar                      |
| `generate_lead`               | `src/components/DiagnosisDialog.tsx`                                                                                      | Mismo clic, mismo manejador                                             | `method: "whatsapp"`, `source: "diagnostico"`  | **Intención** de contactar (se conserva por D2) |
| `generate_lead`               | `src/components/Contact.tsx`                                                                                              | Tras confirmar Formspree                                                | `method: "contact_form"`                       | **Lead recibido** (sin cambios)                 |
| `contact`                     | `FloatingWhatsApp`, `ServiceDetail`, `SoftwareSolutions`, `VerticalDetail`, `Showcase3D`, `Contact`, `FinalCTA`, `Footer` | Clics de WhatsApp y llamadas del resto del sitio                        | `method`, `location`                           | Intención de contactar (sin cambios)            |

**Regla de informes**: los leads recibidos son `generate_lead` con `method = "contact_form"`. `generate_lead` con `method = "whatsapp"` y `diagnosis_whatsapp_click` son clics: el sitio no sabe si el mensaje se envió y ningún evento lo afirma (FR-025a).

**`diagnosis_complete` frente a `diagnosis_result_view` (D1)**: se envían casi a la vez y con el mismo parámetro. El primero sale del manejador que confirma la quinta respuesta; el segundo, del render del resultado. Si el resultado fallara al mostrarse, solo existiría el primero. "Volver a empezar" y completar otra vez produce un nuevo par (es una acción nueva).

**Eventos retirados**: `diagnosis_shortcut` (enviaba el tipo de negocio, una respuesta individual) deja de enviarse con esta funcionalidad; lo sustituye `diagnosis_start` con `source: "atajo"`. La fecha efectiva será la del despliegue que la incluya.

**Pendiente antes de producción (Responsable)**: auditoría en solo lectura de los eventos clave de GA4 (`validation.md` §3, FR-025b).
