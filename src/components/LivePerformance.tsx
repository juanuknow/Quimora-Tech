import { Gauge, LayoutTemplate, MousePointerClick, type LucideIcon } from "lucide-react";
import { useWebVitals, type VitalRating, type VitalReading } from "../lib/use-web-vitals";

/* -------------------- LivePerformance -------------------- */
// La sección Stats promete "95+ en Lighthouse" como objetivo del servicio.
// Esto lo convierte en algo verificable en el momento: las Core Web Vitals
// reales de ESTA visita, medidas por el propio navegador de quien lee —
// las mismas tres métricas que Google usa para posicionar en buscadores.
// Ningún número aquí es inventado ni una demo: si no carga rápido, se ve.

const RATING_LABEL: Record<VitalRating, string> = {
  good: "Bueno",
  "needs-improvement": "Mejorable",
  poor: "Lento",
};

const RATING_CLASS: Record<VitalRating, string> = {
  good: "text-success",
  "needs-improvement": "text-white/70",
  poor: "text-destructive",
};

export function LivePerformance() {
  const { lcp, cls, inp } = useWebVitals();

  return (
    <div className="border-t border-white/10">
      <div className="mx-auto max-w-[1200px] px-6 py-10 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white/70">
            Compruébalo tú mismo
          </h3>
          <p className="text-xs text-white/50">
            Core Web Vitals reales de esta visita — medidas por tu navegador ahora mismo.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <VitalTile
            icon={LayoutTemplate}
            label="Carga visual (LCP)"
            reading={lcp}
            format={(v) => `${(v / 1000).toFixed(1)}s`}
            waitingLabel="Midiendo…"
          />
          <VitalTile
            icon={Gauge}
            label="Estabilidad visual (CLS)"
            reading={cls}
            format={(v) => v.toFixed(2)}
            waitingLabel="Midiendo…"
          />
          <VitalTile
            icon={MousePointerClick}
            label="Capacidad de respuesta (INP)"
            reading={inp}
            format={(v) => `${Math.round(v)}ms`}
            waitingLabel="Esperando tu primera interacción"
          />
        </div>
      </div>
    </div>
  );
}

function VitalTile({
  icon: Icon,
  label,
  reading,
  format,
  waitingLabel,
}: {
  icon: LucideIcon;
  label: string;
  reading: VitalReading | null;
  format: (value: number) => string;
  waitingLabel: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2.5 text-white/60">
        <Icon size={16} strokeWidth={1.9} />
        <span className="text-xs">{label}</span>
      </div>
      {reading ? (
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold tabular-nums text-white">
            {format(reading.value)}
          </span>
          <span className={`text-xs font-medium ${RATING_CLASS[reading.rating]}`}>
            {RATING_LABEL[reading.rating]}
          </span>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white/40" aria-hidden="true" />
          <span className="text-sm text-white/50">{waitingLabel}</span>
        </div>
      )}
    </div>
  );
}
