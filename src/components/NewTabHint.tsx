/**
 * Aviso solo para lectores de pantalla en enlaces que abren otra pestaña
 * (`target="_blank"`): quien navega con tecnología asistiva no ve el cambio de
 * contexto y, sin este texto, no puede anticiparlo (WCAG 3.2.5, G201).
 *
 * Va como hijo del enlace, después de su texto visible, de modo que el nombre
 * accesible siga empezando por lo que se ve en pantalla (WCAG 2.5.3).
 */
export const NEW_TAB_NOTICE = "(se abre en una pestaña nueva)";

export function NewTabHint() {
  return <span className="sr-only"> {NEW_TAB_NOTICE}</span>;
}
