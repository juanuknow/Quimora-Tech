import { LIGHT_RING, CONTACT_PHONE, CONTACT_PHONE_DISPLAY, whatsappHref } from "../lib/site";

/* -------------------- Final CTA -------------------- */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-dark">
      {/* Lightweight CSS backdrop (replaces the old 2 MB looping video). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.10),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.06),transparent_50%)]"
      />
      <div className="relative mx-auto max-w-[820px] px-6 py-24 text-center md:py-28">
        <h2 className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-display-lg">
          No Dejes que tu Competencia te Pase Adelante
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/80 md:text-lg">
          Cada día que esperas es dinero que pierdes. Hablemos hoy.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappHref("Hola, quiero una consulta gratis sobre mi página web")}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-14 w-full items-center justify-center rounded-md bg-white px-8 font-display text-ui font-semibold text-brand transition duration-200 hover:bg-white/90 sm:w-auto active:scale-[0.98] ${LIGHT_RING}`}
          >
            Escribir por WhatsApp
          </a>
          <a
            href="#showcase"
            className={`inline-flex h-14 w-full items-center justify-center rounded-md border-2 border-white/50 bg-transparent px-8 font-display text-ui font-semibold text-white transition duration-200 hover:bg-white/10 sm:w-auto active:scale-[0.98] ${LIGHT_RING}`}
          >
            Ver Casos de Éxito
          </a>
        </div>
        <p className="mt-8 text-ui text-white/80">
          O llámanos:{" "}
          <a
            href={`tel:${CONTACT_PHONE}`}
            className={`rounded-sm font-display font-semibold text-white hover:text-white/80 ${LIGHT_RING}`}
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
        </p>
        <p className="mt-3 text-xs text-white/60">
          Sin compromiso · Respuesta en menos de 24 horas
        </p>
      </div>
    </section>
  );
}
