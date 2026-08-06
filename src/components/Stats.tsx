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

/** Counts from 0 to `end` over `duration` ms once `active` becomes true. */
function useCountUp(end: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      // easeOutCubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, active, duration]);

  return value;
}

export function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="bg-brand text-white">
      <div
        ref={ref}
        className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-10 px-6 py-16 md:grid-cols-4 md:px-10 md:py-20"
      >
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={inView} />
        ))}
      </div>
    </section>
  );
}

function StatItem({ stat, active }: { stat: (typeof STATS)[number]; active: boolean }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-display text-4xl font-bold tracking-tight tabular-nums md:text-5xl">
        {stat.prefix}
        {count}
        {stat.suffix}
      </span>
      <span className="mt-2 max-w-[160px] text-sm text-white/60">{stat.label}</span>
    </div>
  );
}
