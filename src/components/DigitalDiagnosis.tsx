import { Sparkles } from "lucide-react";
import { DIAGNOSIS_INTRO, requestDiagnosis } from "../lib/diagnosis";
import { FOCUS_RING, whatsappHref } from "../lib/site";
import { NewTabHint } from "./NewTabHint";

/* -------------------- Diagnóstico Digital (sección) -------------------- */

/**
 * Presentación de la sección `#diagnostico`, renderizada en el servidor. El
 * cuestionario y el resultado viven en la ventana única `DiagnosisDialog`
 * (FR-013a), que este botón abre igual que los atajos y la invitación.
 *
 * Sin JavaScript la ventana no puede abrirse: el `<noscript>` ofrece WhatsApp.
 */
export function DigitalDiagnosis() {
  return (
    <section id="diagnostico" className="border-t border-hairline bg-hairline/50">
      <div className="mx-auto max-w-[900px] px-6 py-20 md:px-10 md:py-24">
        <div className="overflow-hidden rounded-2xl border border-hairline bg-background shadow-xl shadow-black/5">
          <div className="bg-linear-to-b from-brand-soft to-background px-6 py-14 text-center md:px-16 md:py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-background px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-brand">
              <Sparkles size={14} aria-hidden="true" />
              Diagnóstico Digital gratuito
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-brand md:text-display">
              Descubre la mejor solución para tu negocio en menos de 2 minutos
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-[1.6] text-foreground/80 md:text-body">
              {DIAGNOSIS_INTRO}
            </p>
            <button
              type="button"
              onClick={() => requestDiagnosis({ source: "seccion" })}
              className={`mt-9 inline-flex h-14 items-center justify-center gap-2 rounded-md bg-cta px-8 font-display text-ui font-semibold text-white transition-colors duration-200 hover:bg-cta-hover active:scale-[0.98] ${FOCUS_RING}`}
            >
              <Sparkles size={18} aria-hidden="true" />
              Comenzar diagnóstico gratuito
            </button>
            <noscript>
              <p className="mx-auto mt-6 max-w-md text-ui text-foreground/80">
                El diagnóstico necesita JavaScript. Mientras tanto, cuéntanos tu caso:{" "}
                <a
                  href={whatsappHref("Hola, quiero hacer el Diagnóstico Digital Gratuito.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand underline"
                >
                  Escribir por WhatsApp
                  <NewTabHint />
                </a>
              </p>
            </noscript>
            <p className="mt-5 text-xs text-muted-foreground">
              Sin registro · 5 preguntas · Resultado al instante
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
