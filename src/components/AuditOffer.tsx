import { ArrowUpRight, Check, FileText, Play } from "lucide-react";
import { FOCUS_RING } from "../lib/site";

const reviewAreas = [
  "Velocidad de carga",
  "Visibilidad técnica en Google",
  "Experiencia en celular",
  "Problemas técnicos visibles",
];

export function AuditOffer() {
  return (
    <section
      id="auditoria"
      aria-labelledby="auditoria-title"
      className="border-t border-hairline bg-brand-dark text-white"
    >
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-[1.06fr_0.94fr] lg:gap-20">
        <div>
          <h2
            id="auditoria-title"
            className="max-w-xl font-display text-3xl font-semibold leading-[1.12] tracking-tight md:text-display"
          >
            Tu web ya está publicada. Ahora descubre qué mejorar primero.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-[1.7] text-white/80 md:text-body">
            Revisamos las páginas que más importan para tu negocio y te entregamos un plan claro,
            con evidencia y prioridades. Sin reuniones ni reportes interminables.
          </p>
          <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {reviewAreas.map((area) => (
              <li key={area} className="flex items-center gap-3 text-sm text-white/90">
                <Check size={17} aria-hidden="true" className="shrink-0" />
                {area}
              </li>
            ))}
          </ul>
          <a
            href="#contacto"
            className={`mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 font-display text-sm font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft ${FOCUS_RING}`}
          >
            Consultar disponibilidad
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <p className="mt-4 max-w-lg text-xs leading-[1.6] text-white/70">
            Para sitios existentes. Confirmamos el alcance, el plazo y el precio antes de empezar.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.24)] md:p-8">
          <p className="font-display text-xl font-semibold text-brand">Lo que recibes</p>
          <p className="mt-2 text-sm leading-[1.6] text-foreground/75">
            Un diagnóstico personalizado de un dominio y hasta tres páginas públicas.
          </p>
          <div className="mt-7 space-y-5 border-t border-hairline pt-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Play size={19} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-brand">
                  Video de 15 a 20 minutos
                </h3>
                <p className="mt-1 text-sm leading-[1.55] text-foreground/75">
                  Te mostramos los hallazgos directamente sobre tu sitio.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <FileText size={19} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-brand">
                  PDF con acciones priorizadas
                </h3>
                <p className="mt-1 text-sm leading-[1.55] text-foreground/75">
                  Hasta cinco mejoras concretas, con evidencia y siguiente paso.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-7 border-t border-hairline pt-5 text-sm leading-[1.6] text-foreground/75">
            Entrega propuesta: cinco días hábiles desde el pago y la recepción de la información
            completa. No incluye implementación ni pruebas de seguridad.
          </div>
        </div>
      </div>
    </section>
  );
}
