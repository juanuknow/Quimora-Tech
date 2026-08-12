import { useEffect, useRef, useState } from "react";

type TiltOptions = {
  /** Rotación máxima en grados, en cada eje, desde el centro. */
  max?: number;
  /** Distancia del observador: menor = deformación más marcada. */
  perspective?: number;
  /**
   * Publica `--glare-x` / `--glare-y` con la posición del cursor dentro del
   * elemento, para un reflejo que lo siga (ver `.device-glare`).
   */
  glare?: boolean;
};

/**
 * Inclinación 3D que sigue al cursor sobre el elemento.
 *
 * Escribe el `transform` directamente por ref, sin pasar por el estado de
 * React: a 60 fps un re-render por frame sería inviable. Vuelve al reposo al
 * salir el cursor —el frenado lo define la transición CSS del elemento, no el
 * hook—.
 *
 * No hace nada si el usuario pide movimiento reducido o si el puntero no es
 * fino: en táctil no hay hover que seguir, y el efecto quedaría congelado en la
 * última posición tocada.
 */
export function useTilt<T extends HTMLElement>({
  max = 6,
  perspective = 1000,
  glare = false,
}: TiltOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    let raf = 0;
    const reset = () => {
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`;
      if (glare) {
        el.style.setProperty("--glare-x", "50%");
        el.style.setProperty("--glare-y", "0%");
      }
    };
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const ry = (px - 0.5) * 2 * max;
        const rx = -(py - 0.5) * 2 * max;
        el.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        if (glare) {
          el.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
          el.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
        }
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      reset();
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [max, perspective, glare]);

  return ref;
}

/**
 * Fires once when the element scrolls into view; used to trigger reveal
 * animations and count-ups. Disconnects after the first intersection.
 *
 * Reports `true` inmediatamente —sin observar— cuando el usuario pide movimiento
 * reducido o cuando el navegador no soporta IntersectionObserver. Así el
 * contenido nunca queda atrapado en su estado oculto: los consumidores pueden
 * partir de `opacity-0` sin arriesgar una página en blanco.
 */
export function useInView<T extends Element>(threshold = 0.2, rootMargin = "0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
