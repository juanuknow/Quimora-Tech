import { useState } from "react";
import { FOCUS_RING } from "../lib/site";

/* -------------------- FAQ -------------------- */
const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en estar lista mi web?",
    a: "Típicamente entre 2 y 4 semanas dependiendo de la complejidad. La mayoría de negocios ven avances significativos en las primeras 4 semanas.",
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
    a: "Tenemos planes de mantenimiento flexible. Un email, una llamada, y resolvemos en máximo 24 horas.",
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

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
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
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-brand ${FOCUS_RING}`}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
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
                <div
                  id={panelId}
                  inert={!isOpen}
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
