# Contrato: motor de recomendación (`src/lib/diagnosis-engine.ts`)

Módulo puro, sin React, sin iconos y sin acceso al DOM. Es la única fuente de las reglas de la spec ("Reglas de recomendación").

## Exportaciones

```ts
export type SituationId = "S1" | "S2" | "S3" | "S4" | "S5";
export type NeedId = "N1" | "N2" | "N3" | "N4" | "N5" | "N6" | "N7";
export type GoalId = "O1" | "O2" | "O3" | "O4" | "O5";
export type PriorityId = "P1" | "P2" | "P3" | "P4";

export interface CompleteAnswers {
  business: BusinessId;
  situation: SituationId;
  needs: readonly NeedId[]; // de 1 a MAX_SELECTIONS, en orden de elección
  goals: readonly GoalId[]; // de 1 a MAX_SELECTIONS, en orden de elección
  priority: PriorityId;
}

// AnswerOption<T> = { id: T; label: string } — sin iconos (los añade la interfaz)
export const SITUATION_OPTIONS: readonly AnswerOption<SituationId>[];
export const NEED_OPTIONS: readonly AnswerOption<NeedId>[];
export const GOAL_OPTIONS: readonly AnswerOption<GoalId>[];
export const PRIORITY_OPTIONS: readonly AnswerOption<PriorityId>[];

export function recommend(answers: CompleteAnswers): Recommendation;
export function buildWhatsAppMessage(answers: CompleteAnswers, rec: Recommendation): string;
```

Los tipos `AnswerOption`, `Recommendation` (incluido `shortExplanation`) y `Complement` son los de [data-model.md](../data-model.md). El motor no importa iconos: la interfaz los añade (`UiAnswerOption`).

## Reglas

`recommend` aplica, en este orden y sin excepciones, las tablas de la spec:

1. **R-P** (solución de cada necesidad marcada), con el ajuste R-P1/R-P2 para N1, y **R-C6** (cuál es la principal).
2. **R-KN, R-K1 → R-K4** (complementos), recorridas en orden, descartando duplicados y la principal, hasta un máximo de tres (R-C4).
3. **R-C2, R-C3, R-C5** (texto de la explicación y del resumen).
4. **R-N** (próximo paso según la prioridad).

## Garantías verificables

| Garantía                 | Requisito        | Cómo se verifica                                                                                                                                                                                                                              |
| ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Determinismo             | FR-014           | Dos llamadas con las mismas respuestas devuelven objetos con el mismo contenido                                                                                                                                                               |
| Principal del catálogo   | FR-015           | `primary` ∈ los ocho `ServiceId` de R-P                                                                                                                                                                                                       |
| 0–3 complementos válidos | FR-015a, FR-015b | Sin duplicados, distintos de la principal, cada uno con `rule` y `reason`; toda necesidad marcada queda atendida                                                                                                                              |
| Sin precios              | FR-018, FR-022a  | Ningún texto contiene `$`, `COP`, "precio", "presupuesto" ni "desde" seguido de un importe                                                                                                                                                    |
| Sin plazos               | FR-018b          | `deliveryTime === null`                                                                                                                                                                                                                       |
| Contenido rastreable     | FR-016a, FR-016b | `howItWorks` y `benefits` salen literalmente de `services-data.ts`; los textos de R-K2, de `pricing-data.ts`                                                                                                                                  |
| Mensaje completo         | FR-022           | El mensaje contiene, en orden, las cinco etiquetas de respuesta, la principal, sus beneficios publicados (si los hay), cada complemento con su motivo (o "ninguno adicional"), `shortExplanation`, el próximo paso y la solicitud de asesoría |
| Longitud                 | FR-022b          | Texto ≤ 2 000 caracteres en todas las combinaciones; si `whatsappHref(texto).length > 2000`, beneficios limitados a los tres primeros y `reduced = true`; se informa del caso más largo                                                       |
| Sin escalado             | FR-015c          | La principal siempre es la solución de una necesidad marcada; con una sola necesidad, cambiar la situación, el objetivo, la prioridad o el negocio no la cambia, salvo entre R-P1 y R-P2 cuando la necesidad es N1                            |
| Compatibilidad           | FR-014           | Con una necesidad y un objetivo, el resultado y el mensaje coinciden con los de la selección única                                                                                                                                            |

Todas se comprueban recorriendo las 3 962 700 combinaciones (ver [quickstart.md](../quickstart.md)).
