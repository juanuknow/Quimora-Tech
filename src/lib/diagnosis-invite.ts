/**
 * Estado de la invitación al diagnóstico en la sesión del navegador
 * (`contracts/open-diagnosis.md`, FR-002).
 *
 * - `shown`: ya se mostró en esta sesión.
 * - `dismissed`: el visitante la rechazó ("Ahora no", cierre o Escape).
 * - `completed`: el visitante llegó al resultado del diagnóstico por cualquier vía.
 *
 * Cualquier valor impide volver a mostrarla. Se usa `sessionStorage` (termina
 * al cerrar la pestaña) y, si no está disponible (navegación privada estricta,
 * almacenamiento bloqueado), un respaldo en memoria: como máximo una invitación
 * por carga de página, sin errores. Solo se lee en efectos del cliente, nunca
 * durante el render, para no provocar diferencias de hidratación.
 */

export type InviteState = "shown" | "dismissed" | "completed";

const KEY = "qt:diagnosis-invite";
const STATES: readonly InviteState[] = ["shown", "dismissed", "completed"];

let memory: InviteState | null = null;

export function readInviteState(): InviteState | null {
  try {
    const value = window.sessionStorage.getItem(KEY);
    if (value && (STATES as readonly string[]).includes(value)) return value as InviteState;
  } catch {
    // Almacenamiento no disponible: se usa el respaldo en memoria.
  }
  return memory;
}

export function markInvite(state: InviteState): void {
  memory = state;
  try {
    window.sessionStorage.setItem(KEY, state);
  } catch {
    // Almacenamiento no disponible: queda solo en memoria (una invitación por carga).
  }
}

export function canShowInvite(): boolean {
  return readInviteState() === null;
}
