import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element scrolls into view; used to trigger reveal
 * animations and count-ups. Disconnects after the first intersection.
 *
 * Reports `true` inmediatamente —sin observar— cuando el usuario pide movimiento
 * reducido o cuando el navegador no soporta IntersectionObserver. Así el
 * contenido nunca queda atrapado en su estado oculto: los consumidores pueden
 * partir de `opacity-0` sin arriesgar una página en blanco.
 */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
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
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
