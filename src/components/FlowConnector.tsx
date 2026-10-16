import { useInView } from "../lib/hooks";

/**
 * Línea vertical que se dibuja de arriba abajo al entrar en pantalla, para unir
 * dos secciones que cuentan una sola historia (del problema a su solución).
 *
 * Anima `scale`, no `height`: no dispara layout. Con movimiento reducido
 * `useInView` responde `true` de inmediato y la transición queda sin duración,
 * así que aparece ya dibujada.
 */
export function FlowConnector({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);

  return (
    <div ref={ref} aria-hidden="true" className={`flex justify-center ${className}`}>
      <span
        className={`block h-14 w-0.5 origin-top rounded-full bg-brand transition-[scale] duration-[600ms] ease-out-strong ${
          inView ? "scale-y-100" : "scale-y-0"
        }`}
      />
    </div>
  );
}
