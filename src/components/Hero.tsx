import { FOCUS_RING } from "../lib/site";

/* -------------------- Hero -------------------- */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-20 md:grid-cols-[1.15fr_1fr] md:px-10 md:py-28">
        <div className="relative z-10">
          <h1 className="animate-rise-in font-display text-4xl font-bold leading-[1.1] tracking-tight text-brand sm:text-5xl md:text-display-xl">
            Páginas Web que Convierten
            <br className="hidden md:block" /> tus Visitantes en Clientes Reales
          </h1>
          <p className="animate-rise-in mt-6 max-w-xl text-base leading-[1.6] text-foreground [--delay:120ms] md:text-body">
            Desarrollamos sitios web ultra-rápidos, optimizados para móviles y diseñados para hacer
            crecer tu negocio en internet sin dolores de cabeza técnicos.
          </p>
          <div className="animate-rise-in mt-10 flex flex-col gap-3 [--delay:240ms] sm:flex-row">
            <a
              href="#contacto"
              className={`inline-flex h-14 items-center justify-center rounded-md bg-cta px-8 font-display text-ui font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:scale-[1.03] hover:bg-cta-hover hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)] active:scale-100 ${FOCUS_RING}`}
            >
              Solicitar mi cotización gratis
            </a>
            <a
              href="#nosotros"
              className={`inline-flex h-14 items-center justify-center rounded-md border-2 border-brand bg-transparent px-8 font-display text-ui font-semibold text-brand transition-all duration-200 hover:scale-[1.03] hover:bg-brand-soft hover:shadow-[0_8px_22px_rgba(0,0,0,0.12)] active:scale-100 ${FOCUS_RING}`}
            >
              Ver Cómo Funciona
            </a>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    // Dos capas: la externa hace la entrada escalonada, la interna mantiene el
    // flotado continuo. Separarlas evita que dos animaciones compitan por
    // `transform` en el mismo elemento.
    <div className="animate-rise-in pointer-events-none hidden [--delay:360ms] md:block">
      <svg
        viewBox="0 0 400 320"
        className="animate-float-3d h-auto w-full drop-shadow-2xl"
        fill="none"
        aria-hidden="true"
      >
        {/* Laptop frame */}
        <rect
          x="40"
          y="40"
          width="320"
          height="200"
          rx="10"
          stroke="#18181b"
          strokeWidth="2"
          fill="#ffffff"
        />
        <rect x="40" y="240" width="320" height="10" rx="3" fill="#e4e4e7" />
        {/* Screen content — ascending line chart */}
        <line x1="60" y1="200" x2="340" y2="200" stroke="#e4e4e7" strokeWidth="1" />
        <line x1="60" y1="60" x2="60" y2="200" stroke="#e4e4e7" strokeWidth="1" />
        {/* --len (300) supera la longitud real del trazo (~298 px) para que
            termine de dibujarse justo al final de la animación. */}
        <polyline
          points="70,180 130,150 190,160 240,110 300,90 330,70"
          stroke="#18181b"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-stroke [--len:300]"
        />
        {/* Data points — los retardos siguen el avance real del trazo, que va
            adelantado respecto al tiempo por el easing de salida cúbico. */}
        <circle
          cx="240"
          cy="110"
          r="4"
          fill="#18181b"
          className="animate-fade-in [--delay:0.95s]"
        />
        <circle cx="330" cy="70" r="5" fill="#71717a" className="animate-fade-in [--delay:1.6s]" />
        {/* Small bars — agrupadas: una sola animación, y así el `opacity` de la
            última barra no lo pisa el keyframe de fade. */}
        <g className="animate-fade-in [--delay:0.7s]">
          <rect x="70" y="205" width="12" height="20" rx="2" fill="#f4f4f5" />
          <rect x="90" y="195" width="12" height="30" rx="2" fill="#f4f4f5" />
          <rect x="110" y="185" width="12" height="40" rx="2" fill="#18181b" opacity="0.25" />
        </g>
      </svg>
    </div>
  );
}
