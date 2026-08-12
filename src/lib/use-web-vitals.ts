import { useEffect, useState } from "react";
import { onLCP, onCLS, onINP, type Metric } from "web-vitals";

export type VitalRating = Metric["rating"];

export interface VitalReading {
  value: number;
  rating: VitalRating;
}

export interface WebVitals {
  lcp: VitalReading | null;
  cls: VitalReading | null;
  inp: VitalReading | null;
}

/**
 * Mide las Core Web Vitals reales de esta visita — no una demo ni un
 * benchmark de laboratorio, lo que el navegador de quien lee esto acaba de
 * medir. `web-vitals` (paquete oficial del equipo de Chrome) maneja los
 * casos borde: ventanas de sesión para CLS, restauración desde bfcache,
 * reemplazo del candidato LCP hasta que se confirma, etc. — reimplementarlo
 * a mano con `PerformanceObserver` es fácil de dejar sutilmente mal.
 *
 * Los valores llegan de forma asíncrona y pueden actualizarse (LCP se
 * confirma con la primera interacción; CLS acumula hasta que la pestaña se
 * oculta), así que el consumidor debe tratarlos como "lo mejor que sabemos
 * hasta ahora", no como un resultado final e inmutable.
 */
export function useWebVitals(): WebVitals {
  const [vitals, setVitals] = useState<WebVitals>({ lcp: null, cls: null, inp: null });

  useEffect(() => {
    const update = (key: keyof WebVitals) => (metric: Metric) => {
      setVitals((prev) => ({ ...prev, [key]: { value: metric.value, rating: metric.rating } }));
    };

    // reportAllChanges: sin esto, cada métrica solo se reporta una vez que
    // se da por "cerrada" (típicamente al ocultar la pestaña) — la insignia
    // se quedaría en "midiendo…" durante toda la visita. Con esto se ve el
    // valor provisional apenas existe y se actualiza en vivo si mejora.
    const opts = { reportAllChanges: true };
    onLCP(update("lcp"), opts);
    onCLS(update("cls"), opts);
    onINP(update("inp"), opts);
  }, []);

  return vitals;
}
