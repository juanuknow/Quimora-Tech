import { Sparkles, ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { SolutionsCatalog } from "./SolutionsCatalog";
import { SolutionsVisual } from "./SolutionsVisual";
import { LIGHT_RING, whatsappHref, trackEvent } from "../lib/site";

/* ============================ Data ============================ */

/** Compromisos del proceso, no métricas de trayectoria. */
const CAPABILITIES = [
  "Del diseño al despliegue",
  "Código propio, sin plantillas",
  "Tecnología moderna y escalable",
] as const;

/** Rejilla técnica de fondo, atenuada hacia los bordes con una máscara radial. */
const GRID_LINE = "rgba(255,255,255,0.05)";
const GRID_MASK = "radial-gradient(ellipse at center, black 35%, transparent 75%)";
const GRID_STYLE: CSSProperties = {
  backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
  backgroundSize: "64px 64px",
  maskImage: GRID_MASK,
  WebkitMaskImage: GRID_MASK,
};

/* ============================ Section ============================ */

/**
 * Bloque "somos tu aliado tecnológico": amplía el alcance de la marca más allá
 * de la página web.
 *
 * Es la única sección oscura en mitad del recorrido, y esa inversión de
 * contraste es intencional: dentro de una paleta monocromática es la forma de
 * hacerla destacar sin introducir color, que rompería el sistema.
 */
export function SoftwareSolutions() {
  return (
    <section id="soluciones" className="relative overflow-hidden bg-brand-dark">
      {/* Fondo: rejilla técnica difuminada hacia los bordes + halos radiales.
          La rejilla va en `style` porque combina imagen, tamaño y máscara: en
          utilidades sería una cadena arbitraria ilegible. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={GRID_STYLE} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.10),transparent_45%),radial-gradient(circle_at_88%_78%,rgba(255,255,255,0.07),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32">
        {/* Encabezado: texto a la izquierda, mockup a la derecha (como el hero). */}
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-white/70">
              <Sparkles size={14} />
              Aliado tecnológico
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-display-lg">
              Desarrollamos soluciones de software a la medida
            </h2>
            <p className="mt-5 max-w-xl text-base leading-[1.7] text-white/70 md:text-body">
              Quimora Tech no se queda en la página web. Diseñamos, desarrollamos y ponemos en
              producción el software que tu negocio necesita: desde una landing que capta clientes
              hasta sistemas internos que ordenan toda tu operación.
            </p>
            <p className="mt-4 max-w-xl text-base leading-[1.7] text-white/70 md:text-body">
              Un solo equipo de principio a fin, con la misma exigencia de velocidad, seguridad y
              medición en cada proyecto.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {CAPABILITIES.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-caption text-white/75"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <SolutionsVisual />
        </div>

        {/* Catálogo de soluciones */}
        <SolutionsCatalog />

        {/* Cierre + CTA */}
        <div className="mt-16 rounded-2xl border border-white/15 bg-white/[0.04] p-8 text-center md:p-12">
          <h3 className="mx-auto max-w-2xl font-display text-2xl font-semibold leading-[1.25] text-white md:text-display-sm">
            Cuéntanos tu idea y desarrollamos la solución tecnológica que tu negocio necesita
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-ui leading-[1.7] text-white/65 md:text-base">
            No importa si ya tienes claro qué quieres o apenas es una idea suelta: lo aterrizamos
            contigo y te decimos qué se puede construir, en cuánto tiempo y con qué inversión.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappHref(
                "Hola, quiero desarrollar una solución de software a la medida para mi negocio",
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("contact", { method: "whatsapp", location: "soluciones" })}
              className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-md bg-white px-8 font-display text-ui font-semibold text-brand transition duration-200 hover:bg-white/90 sm:w-auto active:scale-[0.98] ${LIGHT_RING}`}
            >
              Escribir por WhatsApp
              <ArrowRight size={18} />
            </a>
            <a
              href="#contacto"
              className={`inline-flex h-14 w-full items-center justify-center rounded-md border-2 border-white/40 bg-transparent px-8 font-display text-ui font-semibold text-white transition duration-200 hover:bg-white/10 sm:w-auto active:scale-[0.98] ${LIGHT_RING}`}
            >
              Solicitar cotización
            </a>
          </div>
          <p className="mt-7 text-xs text-white/50">
            Asesoría inicial sin costo · Te respondemos en menos de 24 horas
          </p>
        </div>
      </div>
    </section>
  );
}
