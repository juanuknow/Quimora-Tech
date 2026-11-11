import { HeroDemo } from "./hero-demo/HeroDemo";
import { FOCUS_RING } from "../lib/site";

/* -------------------- Hero -------------------- */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-20 lg:grid-cols-[1.15fr_1fr] md:px-10 md:py-28">
        <div className="relative z-10 min-w-0">
          <h1 className="animate-rise-in font-display text-4xl font-bold leading-[1.1] tracking-tight text-brand sm:text-5xl md:text-display-xl">
            Páginas Web que Convierten
            <br className="hidden md:block" /> tus Visitantes en Clientes Reales
          </h1>
          <p className="animate-rise-in mt-6 max-w-xl text-base leading-[1.6] text-foreground [--delay:120ms] md:text-body">
            Diseñamos y desarrollamos páginas web en Cali, rápidas y optimizadas para celulares,
            para hacer crecer tu negocio en internet sin dolores de cabeza técnicos.
          </p>
          <div className="animate-rise-in mt-10 flex flex-col gap-3 [--delay:240ms] sm:flex-row">
            <a
              href="#contacto"
              className={`inline-flex h-14 items-center justify-center rounded-md bg-cta px-8 font-display text-ui font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:scale-[1.03] hover:bg-cta-hover hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)] active:scale-100 ${FOCUS_RING}`}
            >
              Solicitar mi cotización gratis
            </a>
            <a
              href="#showcase"
              className={`inline-flex h-14 items-center justify-center rounded-md border-2 border-brand bg-transparent px-8 font-display text-ui font-semibold text-brand transition-all duration-200 hover:scale-[1.03] hover:bg-brand-soft hover:shadow-[0_8px_22px_rgba(0,0,0,0.12)] active:scale-100 ${FOCUS_RING}`}
            >
              Ver Proyectos
            </a>
          </div>
        </div>
        <HeroDemo />
      </div>
    </section>
  );
}
