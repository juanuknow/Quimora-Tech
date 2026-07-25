import type { ReactNode } from "react";
import { useInView } from "../lib/hooks";

/** Desfase entre tarjetas hermanas de una misma grilla. */
const STAGGER_MS = 90;

type RevealProps = {
  /** Posición dentro de la grilla; escalona la entrada. */
  index?: number;
  /** Clases del contenedor. Es el hijo directo de la grilla, no la tarjeta. */
  className?: string;
  children: ReactNode;
};

/**
 * Revela su contenido (fundido + subida) al entrar en el viewport.
 *
 * Cada instancia observa su propio elemento, lo que da el comportamiento
 * correcto en ambos ejes: en escritorio las tarjetas de una fila entran a la
 * vez y el `index` produce la cascada; apiladas en móvil, cada una aparece
 * cuando le toca.
 *
 * Con movimiento reducido `useInView` responde `true` de inmediato, así que el
 * contenido se muestra sin recorrido ni espera.
 */
export function Reveal({ index = 0, className = "", children }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      // El retardo solo aplica al entrar: al volver al estado oculto no debe
      // arrastrar la cascada.
      style={{ transitionDelay: inView ? `${index * STAGGER_MS}ms` : "0ms" }}
      // `translate`, no `transform`: Tailwind v4 compila `translate-y-*` a la
      // propiedad independiente, y nombrar `transform` dejaría el recorrido sin
      // transicionar (solo fundido, con salto de posición).
      // La lista explícita evita el `transition-all` anterior, con el que los
      // cambios de sombra y borde del hover heredaban estos 700 ms.
      className={`transition-[opacity,translate] duration-700 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
