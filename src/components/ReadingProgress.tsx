/**
 * Barra fina fija arriba que indica cuánto de la página se ha recorrido.
 *
 * La landing son 13 secciones (~20 000 px en móvil, donde además el menú está
 * plegado), así que el visitante no tiene otra señal de cuánto falta. El avance
 * lo resuelve CSS con `animation-timeline` (ver `.reading-progress`): sin JS,
 * sin listeners de scroll y sin re-renders.
 */
export function ReadingProgress() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]">
      <div className="reading-progress h-full bg-brand" />
    </div>
  );
}
