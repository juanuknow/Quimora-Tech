import { useEffect, useState } from "react";
import { useInView } from "../lib/hooks";

/* -------------------- Stats -------------------- */
// Compromisos y estándares del servicio (verificables), no métricas de
// trayectoria. Se muestran como la vara con la que trabajamos cada proyecto.
const STATS = [
  { value: 3, prefix: "< ", suffix: "s", label: "Velocidad de carga que buscamos" },
  { value: 100, prefix: "", suffix: "%", label: "Diseño responsive, mobile-first" },
  { value: 24, prefix: "", suffix: "h", label: "Respuesta a tu mensaje" },
  { value: 95, prefix: "", suffix: "+", label: "Meta en Google Lighthouse" },
] as const;

/** Conserva el valor SSR; solo prepara el conteo si quedó fuera de pantalla. */
function useCountUp(end: number, active: boolean, shouldAnimate: boolean, duration = 1400) {
  const [value, setValue] = useState(end);

  useEffect(() => {
    if (!shouldAnimate) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      setValue(end);
      return;
    }
    setValue(0);
    if (!active) return;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (reducedMotion.matches) {
        setValue(end);
        return;
      }
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      // easeOutCubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, active, shouldAnimate, duration]);

  return value;
}

export function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // Solo armamos el conteo debajo del viewport: reiniciarlo allí no se ve.
    // Si ya está visible al hidratar, conserva el valor final y evita el salto a 0.
    if (
      el &&
      typeof IntersectionObserver !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      el.getBoundingClientRect().top >= window.innerHeight
    ) {
      setShouldAnimate(true);
    }
  }, [ref]);

  return (
    <section aria-labelledby="stats-title" className="bg-brand text-white">
      {/* La franja no lleva título visible (las cifras se explican solas), pero
          el h2 le da nombre a la región para los lectores de pantalla. */}
      <h2 id="stats-title" className="sr-only">
        Estándares con los que trabajamos cada proyecto
      </h2>
      <div
        ref={ref}
        className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-10 px-6 py-16 md:grid-cols-4 md:px-10 md:py-20"
      >
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={inView} shouldAnimate={shouldAnimate} />
        ))}
      </div>
    </section>
  );
}

function StatItem({
  stat,
  active,
  shouldAnimate,
}: {
  stat: (typeof STATS)[number];
  active: boolean;
  shouldAnimate: boolean;
}) {
  const count = useCountUp(stat.value, active, shouldAnimate);
  return (
    <div className="flex flex-col items-center text-center">
      <span
        aria-hidden="true"
        className="font-display text-4xl font-bold tracking-tight tabular-nums md:text-5xl"
      >
        {stat.prefix}
        {count}
        {stat.suffix}
      </span>
      {/* La copia accesible es estática para no anunciar los números intermedios. */}
      <span className="sr-only">
        {stat.prefix}
        {stat.value}
        {stat.suffix}
      </span>
      <span className="mt-2 max-w-[160px] text-sm text-white/60">{stat.label}</span>
    </div>
  );
}
