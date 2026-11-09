# Data Model: Diagnóstico Digital Gratuito

**Fecha**: 2026-11-07 · **Spec**: [spec.md](./spec.md) · **Research**: [research.md](./research.md)

No hay persistencia en servidor ni base de datos. Todos los datos viven en el navegador durante la visita, salvo el estado de la invitación (R6) y las respuestas del último diagnóstico terminado (para el botón flotante), que viven en `sessionStorage` y desaparecen al cerrar la pestaña.

## Respuestas (`DiagnosisAnswers`)

| Campo       | Tipo                  | Valores                                      | Origen             |
| ----------- | --------------------- | -------------------------------------------- | ------------------ |
| `business`  | `BusinessId \| null`  | Las nueve opciones de `src/lib/diagnosis.ts` | Pregunta 1 o atajo |
| `situation` | `SituationId \| null` | `S1`…`S5`                                    | Pregunta 2         |
| `need`      | `NeedId \| null`      | `N1`…`N7`                                    | Pregunta 3         |
| `goal`      | `GoalId \| null`      | `O1`…`O5`                                    | Pregunta 4         |
| `priority`  | `PriorityId \| null`  | `P1`…`P4`                                    | Pregunta 5         |

**Validación**: no se puede avanzar desde una pregunta con su campo en `null` (FR-010). Solo se puede calcular la recomendación con los cinco campos completos; el tipo `CompleteAnswers` lo garantiza en compilación.

**Ciclo de vida**: se crean vacías al abrir la ventana (o con `business` precargado desde un atajo); se descartan al cerrar la ventana, recargar o salir. Nunca se guardan ni se envían a la analítica.

## Opción de respuesta

Hay dos niveles, para que el motor siga siendo puro (I4):

| Tipo                | Dónde                                | Campos                                 | Regla                                                                                                                                                                 |
| ------------------- | ------------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AnswerOption<T>`   | `src/lib/diagnosis-engine.ts`        | `id: T`, `label: string`               | Código estable (`S1`, `N4`…) y texto visible sin jerga técnica (FR-009). La etiqueta es también la que va en el mensaje de WhatsApp                                   |
| `UiAnswerOption<T>` | `src/components/DiagnosisDialog.tsx` | `AnswerOption<T>` + `icon: LucideIcon` | El icono se añade solo en la interfaz, con la iconografía existente (lucide-react). La pregunta 1 usa `BUSINESS_OPTIONS` de `src/lib/diagnosis.ts`, que ya trae icono |

Las opciones de las preguntas 2 a 5 son las de la tabla "Opciones de respuesta" de la spec (FR-012).

## Identificador de servicio (`ServiceId`)

Unión de literales con los 14 servicios del catálogo. Se añade como campo obligatorio `id` a cada elemento de `services` en `src/lib/services-data.ts` (R8). Los nueve que usa el diagnóstico:

| `ServiceId`           | Servicio publicado                     | Contenido disponible                  |
| --------------------- | -------------------------------------- | ------------------------------------- |
| `landing-pages`       | Landing pages                          | `body`, `longDescription`, `benefits` |
| `sitios-corporativos` | Sitios web corporativos                | `body`, `longDescription`, `benefits` |
| `tiendas-online`      | Tiendas online (eCommerce)             | `body`, `longDescription`, `benefits` |
| `reservas-citas`      | Reservas y citas                       | Solo `body`                           |
| `inventario`          | Sistemas de inventario                 | `body`, `longDescription`, `benefits` |
| `ventas-caja`         | Control de ventas, caja y cotizaciones | `body`, `longDescription`, `benefits` |
| `automatizacion`      | Automatización de procesos             | `body`, `longDescription`, `benefits` |
| `integraciones-api`   | Integraciones con APIs                 | Solo `body`                           |

Los otros seis servicios reciben su `id`, pero el motor no los recomienda.

## Complemento (`Complement`)

| Campo            | Tipo                                   | Regla                                                                      |
| ---------------- | -------------------------------------- | -------------------------------------------------------------------------- |
| `rule`           | `"R-K1" \| "R-K2" \| "R-K3" \| "R-K4"` | Regla que lo activó                                                        |
| `kind`           | `"service" \| "plan-component"`        | Servicio del catálogo o componente de plan                                 |
| `serviceId`      | `ServiceId`                            | Solo si `kind = "service"`                                                 |
| `planComponents` | `readonly string[]`                    | Solo si `kind = "plan-component"`: textos leídos de `pricing-data.ts` (R9) |
| `reason`         | `string`                               | Motivo visible, redactado a partir de las respuestas (FR-015a)             |

**Validación**: como máximo dos por recomendación; distintos de la principal y entre sí (FR-015b, R-C4).

## Recomendación (`Recommendation`)

| Campo              | Tipo                          | Origen                                                                                                                   |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `primaryRule`      | `"R-P1"`…`"R-P8"`             | Regla R-P aplicada                                                                                                       |
| `primary`          | `ServiceId`                   | Tabla R-P (FR-015)                                                                                                       |
| `complements`      | `readonly Complement[]` (0–2) | Tabla R-K                                                                                                                |
| `situationSummary` | `string`                      | Plantilla por situación (S1–S5), con el nombre del negocio según R-C5                                                    |
| `needLabel`        | `string`                      | Etiqueta de la necesidad                                                                                                 |
| `howItWorks`       | `string`                      | `longDescription` o, si no existe, `body` del servicio principal (FR-016a)                                               |
| `benefits`         | `readonly string[]`           | `benefits` del servicio principal; vacío si no publica (FR-016a, FR-016b)                                                |
| `explanation`      | `string`                      | Por qué se recomienda: necesidad + ajuste aplicado (R-P1, R-C2, R-C3); se muestra en pantalla                            |
| `shortExplanation` | `string`                      | Una sola frase de como máximo 200 caracteres, derivada de las mismas reglas; es la que va en el mensaje de WhatsApp (U4) |
| `nextStepRule`     | `"R-N1"`…`"R-N4"`             | Según la prioridad                                                                                                       |
| `nextStep`         | `string`                      | Texto de R-N; siempre indica que la inversión se define con el asesor (FR-018a)                                          |
| `deliveryTime`     | `null`                        | Siempre `null` mientras no haya una correspondencia servicio–plazo aprobada (FR-018b)                                    |

**Invariantes** (verificadas en las 6 300 combinaciones):

1. `recommend` es una función pura: misma entrada, misma salida (FR-014).
2. `primary` pertenece a los ocho servicios de la tabla R-P.
3. Ningún campo contiene precios, rangos ni presupuestos (FR-018).
4. `deliveryTime` es `null` (FR-018b).

## Mensaje de WhatsApp (`WhatsAppMessage`)

| Campo     | Tipo      | Regla                                                                                                                                                   |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`    | `string`  | Los elementos de FR-022 en orden (13, o 12 si el servicio no publica beneficios), separados por saltos de línea; como máximo 2 000 caracteres (FR-022b) |
| `href`    | `string`  | `whatsappHref(text)`, con el número principal ya configurado (FR-021)                                                                                   |
| `reduced` | `boolean` | `true` si se aplicó la reducción de FR-022b (beneficios limitados a los tres primeros)                                                                  |

**Invariantes**: `text` es el mismo que copia "Copiar mensaje" (FR-024) y no contiene precios, plazos ni datos personales (FR-022a). Medición previa con los textos reales del catálogo (2026-11-07): el peor caso con todos los beneficios ocupa 1 353 caracteres de texto y 1 948 codificados; con la reducción, el enlace más largo baja a unos 1 781 caracteres codificados. La verificación exhaustiva lo confirma con la implementación real.

## Estado de la invitación (`InviteState`)

```text
(sin valor) ──a los 2,5 s──▶ ¿≥ 768 × 640 px? ──sí──▶ ventana ─────────────────┐
                                    │                                          │
                                    └──no──▶ medir tarjeta (FR-007b)            │
                                                       │            │          ▼
                                                    cumple      no cumple    shown ──"Ahora no" / cierre / Escape──▶ dismissed
                                                       │            │          │
                                                       └──▶ shown   └──▶ (sin cambios: suprimida en esta carga)
                                                                               │
                                   tarjeta visible deja de cumplir (giro/resize) ──▶ se oculta; sigue en shown

(cualquier estado) ──resultado alcanzado por cualquier vía──▶ completed
```

- Cualquier valor presente en `qt:diagnosis-invite` impide mostrar la invitación en la sesión (FR-002).
- Suprimida (FR-007c): no se escribe nada ni se envía `diagnosis_popup_view`; en otra carga de página se vuelve a intentar con la medición de esa pantalla.
- Fuera de plazo (FR-001, U1): si al montar ya han pasado más de 2 700 ms desde el inicio de la navegación, no se muestra en esa carga ni se escribe nada.
- `completed` se escribe al mostrar el resultado, también si se llegó desde la sección o un atajo.
- Si `sessionStorage` falla, el mismo estado vive en memoria durante la carga de página (R6).

## Variante de la invitación (`InviteVariant`)

| Variante | Cuándo                                                                     | Contenido        | Comportamiento                                                     |
| -------- | -------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------ |
| `dialog` | Ancho ≥ 768 px **y** alto ≥ 640 px al mostrarla                            | FR-003 completo  | `<dialog>` con `showModal()`, foco dentro, Escape cierra           |
| `card`   | Cualquier otro caso, si cumple FR-007b (incluidos teléfonos en horizontal) | FR-003a reducido | `<aside>` fijo, sin foco ni bloqueo, medido y suprimible (FR-007c) |

## Estado de la ventana del diagnóstico

```text
cerrada ──diagnosis:start {source, business?}──▶ pregunta N (1–5) ──completar 5──▶ resultado
   ▲                                                  │  ▲   "Atrás"                    │
   └──────────────── cerrar / Escape ─────────────────┴──┴──────────────────────────────┘
```

- Con `business` precargado (atajo), empieza en la pregunta 2 (US1, escenario 8) y no muestra el párrafo de apoyo.
- Sin atajo, la pregunta 1 muestra encima el párrafo de apoyo de FR-003, en la misma pantalla (FR-003b).
- Desde la pregunta 1, "Atrás" no existe; desde el resultado se puede "Volver a empezar".
- Al cerrar, el foco vuelve al elemento que abrió la ventana (FR-028).
- El elemento `<dialog>` lleva `id="diagnosis-dialog"`; la invitación comprueba `document.getElementById("diagnosis-dialog")?.open` para no aparecer con el diagnóstico abierto (FR-005, U3).
