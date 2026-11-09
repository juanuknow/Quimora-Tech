import { BUSINESS_OPTIONS } from "./diagnosis";
import {
  GOAL_OPTIONS,
  MAX_SELECTIONS,
  NEED_OPTIONS,
  PRIORITY_OPTIONS,
  SITUATION_OPTIONS,
  type CompleteAnswers,
} from "./diagnosis-engine";

/**
 * Último diagnóstico terminado en esta visita, para poder volver a verlo.
 *
 * Usa `sessionStorage` porque ir a otra página del sitio recarga el documento y
 * el resultado debe seguir disponible al volver. Las respuestas no salen del
 * navegador y desaparecen al cerrar la pestaña. Si el almacenamiento no está
 * disponible, quedan en memoria durante la carga de página, sin errores.
 *
 * Solo se accede desde el cliente: en el servidor el botón usa su estado inicial.
 */

const KEY = "qt:diagnosis-last-answers";

let memory: CompleteAnswers | null = null;
const listeners = new Set<() => void>();

function includesId(options: readonly { id: string }[], value: unknown): boolean {
  return options.some((option) => option.id === value);
}

function isSelection(options: readonly { id: string }[], value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length >= 1 &&
    value.length <= MAX_SELECTIONS &&
    new Set(value).size === value.length &&
    value.every((item) => includesId(options, item))
  );
}

/** Un valor manipulado o de una versión anterior no debe llegar al motor de recomendación. */
function isCompleteAnswers(value: unknown): value is CompleteAnswers {
  if (typeof value !== "object" || value === null) return false;
  const answers = value as Record<string, unknown>;
  return (
    includesId(BUSINESS_OPTIONS, answers.business) &&
    includesId(SITUATION_OPTIONS, answers.situation) &&
    isSelection(NEED_OPTIONS, answers.needs) &&
    isSelection(GOAL_OPTIONS, answers.goals) &&
    includesId(PRIORITY_OPTIONS, answers.priority)
  );
}

export function saveLastAnswers(answers: CompleteAnswers): void {
  memory = answers;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    // Almacenamiento no disponible: quedan solo en memoria.
  }
  listeners.forEach((listener) => listener());
}

export function getLastAnswers(): CompleteAnswers | null {
  try {
    const stored = window.sessionStorage.getItem(KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (isCompleteAnswers(parsed)) return parsed;
    }
  } catch {
    // Almacenamiento no disponible o valor ilegible: se usa el respaldo en memoria.
  }
  return memory;
}

export function subscribeLastAnswers(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
