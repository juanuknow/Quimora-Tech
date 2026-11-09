# Contrato: eventos de analítica (GA4)

Todos se envían con `trackEvent(name, params)` de `src/lib/site.ts`, el mismo mecanismo y la misma configuración que el resto del sitio (FR-027). No se añaden orígenes externos.

| Evento                                   | Se envía                                                                                 | Parámetros permitidos                                                |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `diagnosis_popup_view`                   | Una vez, al mostrarse la invitación                                                      | `format`: `"dialog"` \| `"card"`                                     |
| `diagnosis_start`                        | Al abrirse la ventana del diagnóstico para responderlo (no al volver a ver un resultado) | `source`: `"invitacion"` \| `"seccion"` \| `"atajo"` \| `"flotante"` |
| `diagnosis_question_answered`            | Al avanzar desde una pregunta respondida                                                 | `step`: `1`–`5`                                                      |
| `diagnosis_complete`                     | Al confirmar la quinta respuesta                                                         | `solution_id`: `ServiceId` de la principal                           |
| `diagnosis_result_view`                  | Al mostrarse el resultado                                                                | `solution_id`                                                        |
| `diagnosis_whatsapp_click`               | Al pulsar "Continuar por WhatsApp"                                                       | `solution_id`                                                        |
| `generate_lead` (existente, se conserva) | Al pulsar "Continuar por WhatsApp"                                                       | `method: "whatsapp"`, `source: "diagnostico"`                        |

## Prohibido en cualquier evento (FR-026)

- Datos personales.
- El tipo de negocio, la situación, la necesidad, el objetivo o la prioridad, ni sus códigos ni sus textos.
- Los complementos.
- El texto del mensaje de WhatsApp.

## Unicidad (FR-025)

- Los eventos de acción se envían desde manejadores de eventos, nunca durante el render.
- `diagnosis_popup_view` y `diagnosis_result_view` se envían en un efecto protegido con una referencia por apertura: volver a renderizar no los repite.
- Volver atrás y responder de nuevo una pregunta sí envía otro `diagnosis_question_answered`, porque es una acción nueva del visitante.
- `diagnosis_complete` y `diagnosis_result_view` se envían casi a la vez y con el mismo parámetro, pero miden cosas distintas (D1): el primero sale del manejador que confirma la quinta respuesta; el segundo, del render del resultado. Si el resultado fallara al mostrarse, solo existiría el primero.

## Significado de los eventos de WhatsApp (D2, FR-025a)

- Un clic en "Continuar por WhatsApp" envía exactamente un `diagnosis_whatsapp_click` y un `generate_lead`, desde el mismo manejador.
- Ambos registran la **intención** de contactar (el clic). El sitio no puede saber si el mensaje se envió ni si el lead llegó; ningún evento ni texto lo afirma.
- `generate_lead` con `method: "contact_form"` (formulario de contacto, tras confirmarse el envío) sí es un lead recibido. Los informes de leads recibidos deben filtrar por `method`.
- `diagnosis_popup_view` solo se envía si la invitación llega a mostrarse; si la tarjeta móvil se suprime (FR-007c), no se envía.

## `generate_lead` como evento clave en GA4 (FR-025b, A1)

Antes de publicar, el responsable audita GA4 en modo solo lectura. Si `generate_lead` está marcado como evento clave, los clics de WhatsApp contarían como conversiones, porque GA4 marca eventos clave por nombre y no por parámetro. La publicación queda bloqueada hasta que el responsable elija por escrito una de estas alternativas (ninguna se aplica sin su autorización expresa):

| Alternativa                                           | Qué implica                                                                                                                                                       | Consecuencias                                                                                                                                      |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Evento clave derivado en GA4                       | Crear en GA4 un evento a partir de `generate_lead` con `method = "contact_form"` (por ejemplo, `lead_confirmed`), marcarlo como clave y desmarcar `generate_lead` | Las conversiones reflejan solo contactos confirmados; requiere cambiar la configuración de GA4; los datos históricos de `generate_lead` no cambian |
| B. Mantener `generate_lead` como clave y documentarlo | No se toca GA4; los informes de conversiones confirmadas filtran por `method`                                                                                     | Las conversiones de GA4 (y de cualquier herramienta conectada, como Google Ads) incluyen clics de WhatsApp; el responsable lo acepta por escrito   |
| C. Desmarcar `generate_lead` como clave sin sustituto | Cambio en GA4                                                                                                                                                     | Se pierde la conversión hasta definir otra; no recomendada                                                                                         |

Si la auditoría muestra que `generate_lead` **no** es evento clave, se documenta y la publicación puede seguir.

## Cambios respecto al estado actual

- `diagnosis_shortcut` (con el tipo de negocio) se retira; lo sustituye `diagnosis_start` con `source: "atajo"`, sin el tipo de negocio.
- `generate_lead` del botón de WhatsApp se conserva sin cambios y se emite desde el mismo manejador que el nuevo botón (tarea del botón, US2), para que el diagnóstico nunca pierda esa medición entre commits.

## Verificación

En las pruebas automatizadas se bloquean las peticiones a GA4 y Cloudflare Web Analytics y se sustituye `window.gtag` por un registrador que guarda cada llamada. Se comprueba la secuencia exacta de SC-007 y que ningún parámetro salga de esta tabla.
