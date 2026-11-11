import { ArrowUpRight } from "lucide-react";
import { requestDiagnosis } from "../lib/diagnosis";
import { FOCUS_RING, whatsappHref } from "../lib/site";
import { NewTabHint } from "./NewTabHint";

export function Guidance() {
  return (
    <section aria-labelledby="guidance-title" className="border-t border-hairline bg-brand-soft">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-caption font-semibold text-muted-foreground">
          ¿No sabes por dónde empezar?
        </p>
        <h2
          id="guidance-title"
          className="mt-4 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display"
        >
          Te orientamos según tu situación
        </h2>
        <div className="mt-8 grid divide-y divide-hairline border-y border-hairline md:grid-cols-2 md:divide-x md:divide-y-0">
          <article
            id="diagnostico"
            aria-labelledby="guidance-diagnosis-title"
            className="scroll-mt-28 py-7 md:pr-10"
          >
            <h3
              id="guidance-diagnosis-title"
              className="font-display text-subhead font-semibold text-brand"
            >
              Todavía no tengo web
            </h3>
            <p className="mt-4 text-ui font-semibold text-brand">Diagnóstico gratuito.</p>
            <p className="mt-2 max-w-lg text-ui leading-relaxed text-foreground">
              Responde unas preguntas y recibe una recomendación personalizada en menos de 2
              minutos.
            </p>
            <button
              type="button"
              onClick={() => requestDiagnosis({ source: "seccion" })}
              className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-cta px-6 text-ui font-semibold text-white transition-colors hover:bg-cta-hover ${FOCUS_RING}`}
            >
              Comenzar diagnóstico
            </button>
            <noscript>
              <p className="mt-4 text-ui leading-relaxed text-foreground">
                El diagnóstico necesita JavaScript. Mientras tanto, cuéntanos tu caso:{" "}
                <a
                  href={whatsappHref("Hola, quiero hacer el Diagnóstico Digital Gratuito.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-semibold underline ${FOCUS_RING}`}
                >
                  Escribir por WhatsApp
                  <NewTabHint />
                </a>
              </p>
            </noscript>
          </article>
          <article
            id="auditoria"
            aria-labelledby="guidance-audit-title"
            className="scroll-mt-28 py-7 md:pl-10"
          >
            <h3
              id="guidance-audit-title"
              className="font-display text-subhead font-semibold text-brand"
            >
              Ya tengo una web
            </h3>
            <p className="mt-4 text-ui font-semibold text-brand">Revisión de tu web actual.</p>
            <p className="mt-2 max-w-lg text-ui leading-relaxed text-foreground">
              Te decimos qué mejorar primero en velocidad, SEO y conversión.
            </p>
            <a
              href="#contacto"
              className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-cta px-6 text-ui font-semibold text-white transition-colors hover:bg-cta-hover ${FOCUS_RING}`}
            >
              Consultar disponibilidad
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <p className="mt-3 text-caption leading-relaxed text-muted-foreground">
              Para sitios existentes. Confirmamos el alcance, el plazo y el precio antes de empezar.
            </p>
            <details className="mt-5 border-t border-hairline">
              <summary
                className={`min-h-11 cursor-pointer py-3 font-display text-ui font-semibold text-brand underline underline-offset-4 ${FOCUS_RING}`}
              >
                Lo que recibes
              </summary>
              <div className="pb-3 text-ui leading-relaxed text-foreground">
                <p>Un diagnóstico personalizado de un dominio y hasta tres páginas públicas.</p>
                <ul className="mt-4 space-y-4">
                  <li>
                    <p className="font-semibold text-brand">Video de 15 a 20 minutos</p>
                    <p>Te mostramos los hallazgos directamente sobre tu sitio.</p>
                  </li>
                  <li>
                    <p className="font-semibold text-brand">PDF con acciones priorizadas</p>
                    <p>Hasta cinco mejoras concretas, con evidencia y siguiente paso.</p>
                  </li>
                </ul>
                <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
                  Entrega propuesta: cinco días hábiles desde el pago y la recepción de la
                  información completa. No incluye implementación ni pruebas de seguridad.
                </p>
              </div>
            </details>
          </article>
        </div>
      </div>
    </section>
  );
}
