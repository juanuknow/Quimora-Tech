import { useEffect, useRef, useState } from "react";
import { FOCUS_RING } from "../lib/site";

/** Duración del cierre del panel; coincide con `duration-300` de su transición. */
const COLLAPSE_MS = 300;

/* -------------------- FAQ -------------------- */
const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en estar lista mi web?",
    a: "Típicamente entre 2 y 4 semanas dependiendo de la complejidad. El plazo exacto se confirma en la cotización.",
  },
  {
    q: "¿Puedo editar la web después?",
    a: "Sí, te entrenamos y proporcionamos un panel de administración simple. No necesitas conocimientos técnicos.",
  },
  {
    q: "¿Incluye posicionamiento en Google (SEO)?",
    a: "Sí, todas nuestras webs están optimizadas desde el inicio con mejores prácticas SEO. Conexión con Google Analytics y Google Search Console incluida.",
  },
  {
    q: "¿Qué pasa si necesito cambios después?",
    a: "Tenemos planes de mantenimiento flexible. Respondemos en menos de 24 horas y acordamos contigo el plazo según el cambio.",
  },
  {
    q: "¿De quién es la web cuando terminamos?",
    a: "Tuya, al 100%. Te entregamos los accesos y los archivos del proyecto. No quedas amarrado a nosotros: puedes seguir con quien quieras.",
  },
  {
    q: "¿Por qué no son la opción más barata?",
    a: "Porque no vendemos plantillas genéricas. Cada sitio se diseña a medida, optimizado para cargar rápido y para vender. Una web barata que no convierte termina saliendo más cara.",
  },
  {
    q: "¿Trabajan con negocios fuera de Cali?",
    a: "Sí. Trabajamos con toda Colombia de forma remota: reuniones por videollamada y coordinación por WhatsApp. La distancia no es problema.",
  },
];

/**
 * "+" que se vuelve "−" girando su barra vertical 90°.
 *
 * Sustituye al intercambio de los íconos Plus y Minus de lucide: cambiar un
 * nodo por otro no admite transición, así que el indicador saltaba de golpe
 * mientras el panel se abría con calma.
 */
function PlusMinusIcon({ open }: { open: boolean }) {
  const bar =
    "absolute left-1/2 top-1/2 h-[1.5px] w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current";

  return (
    <span aria-hidden="true" className="relative block h-4 w-4">
      <span className={bar} />
      <span
        className={`${bar} transition-[rotate] duration-300 ease-out ${
          open ? "rotate-0" : "rotate-90"
        }`}
      />
    </span>
  );
}

/** Mismo texto que se ve en pantalla — el JSON-LD nunca puede decir algo distinto del acordeón. */
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/**
 * Acordeón de preguntas frecuentes.
 *
 * - Cada pregunta es un encabezado (`h3`) con el botón dentro: con lector de
 *   pantalla se salta de pregunta en pregunta por encabezados.
 * - Se pueden abrir varias a la vez, para comparar respuestas sin que el
 *   contenido se desplace al cerrar otra.
 * - Las respuestas cerradas llevan `hidden="until-found"`: la búsqueda del
 *   navegador (Ctrl+F) las encuentra y, al hacerlo, `beforematch` las abre.
 *   Se aplica al terminar el cierre para no cortar la animación. Donde no hay
 *   soporte (Safari) se comporta como `hidden` normal.
 */
export function FAQ() {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const openRef = useRef(open);
  openRef.current = open;

  const setItem = (i: number, isOpen: boolean) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(i);
      else next.delete(i);
      return next;
    });

  const toggle = (i: number) => {
    const opening = !open.has(i);
    // Se retira antes de abrir para que la transición de altura vea el contenido.
    if (opening) panelRefs.current[i]?.removeAttribute("hidden");
    setItem(i, opening);
  };

  // Ctrl+F revela el panel por su cuenta: se refleja en el estado (aria-expanded).
  useEffect(() => {
    const cleanups = panelRefs.current.map((panel, i) => {
      if (!panel) return () => {};
      const onMatch = () => setItem(i, true);
      panel.addEventListener("beforematch", onMatch);
      return () => panel.removeEventListener("beforematch", onMatch);
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // React 19 serializa `hidden` como booleano y descarta "until-found", así que
  // se aplica en el DOM. Con movimiento reducido no hay transición que esperar.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = panelRefs.current.map((panel, i) => {
      if (!panel || open.has(i) || panel.hasAttribute("hidden")) return undefined;
      return window.setTimeout(
        () => {
          if (!openRef.current.has(i)) panel.setAttribute("hidden", "until-found");
        },
        reduce ? 0 : COLLAPSE_MS,
      );
    });
    return () => timers.forEach((t) => t !== undefined && window.clearTimeout(t));
  }, [open]);

  return (
    <section id="faq" className="border-t border-hairline bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <div className="mx-auto max-w-[820px] px-6 py-24 md:py-28">
        <h2 className="text-center font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display">
          Preguntas Frecuentes
        </h2>
        <div className="mt-12 divide-y divide-hairline border-y border-hairline">
          {FAQS.map((f, i) => {
            const isOpen = open.has(i);
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className={`flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-brand ${FOCUS_RING}`}
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base font-semibold text-foreground md:text-body">
                      {f.q}
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                        isOpen ? "border-brand bg-brand text-white" : "border-hairline text-brand"
                      }`}
                    >
                      <PlusMinusIcon open={isOpen} />
                    </span>
                  </button>
                </h3>
                {/* Sin `inert`: excluiría la respuesta de la búsqueda del navegador.
                    Cerrada no se ve (fila de 0 px) ni tiene nada enfocable. */}
                <div
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div
                    className={`min-h-0 transition-opacity duration-300 ease-out ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="pb-6 pr-12 text-ui leading-[1.6] text-foreground/75">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
