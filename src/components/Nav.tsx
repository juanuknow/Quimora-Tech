import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { FOCUS_RING } from "../lib/site";

/* -------------------- Nav -------------------- */
const NAV_LINKS = [
  { href: "#top", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#precios", label: "Precios" },
  { href: "#showcase", label: "Casos de Éxito" },
  { href: "#contacto", label: "Contacto" },
] as const;
const NAV_SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

/** True once the page has scrolled past `threshold`; drives the header's "lifted" look. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

/** Tracks which section id is currently in view, for nav "active link" highlighting. */
function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

type IndicatorBox = { left: number; width: number };

/**
 * Mide dónde está el enlace activo dentro de la barra para que un único
 * subrayado pueda viajar hasta él.
 *
 * Se mide en el DOM en lugar de calcularlo: las etiquetas tienen anchos
 * distintos y dependen de la fuente ya cargada. Un `ResizeObserver` sobre la
 * barra recupera la posición cuando cambia el ancho de la ventana o cuando
 * Space Grotesk termina de cargar y el texto se reajusta.
 */
function useActiveIndicator(active: string) {
  const navRef = useRef<HTMLElement | null>(null);
  const [box, setBox] = useState<IndicatorBox | null>(null);
  // La primera medición se coloca sin transición. Si no, al entrar por un
  // enlace profundo (…/#precios) el subrayado saldría del origen y recorrería
  // media barra en la carga, contando un movimiento que nunca ocurrió.
  const [travels, setTravels] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const el = nav.querySelector<HTMLElement>(`[data-nav-section="${active}"]`);
      setBox(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };

    measure();
    const frame = requestAnimationFrame(() => setTravels(true));
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [active]);

  return { navRef, box, travels };
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useScrollSpy(NAV_SECTION_IDS);
  const { navRef, box, travels } = useActiveIndicator(active);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      // Propiedades nombradas, no `transition-all`: con `all` entraba en la
      // transición cualquier propiedad que cambiara, incluida la geometría.
      className={`sticky top-0 z-40 w-full border-b transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled
          ? "border-hairline bg-background/85 shadow-sm backdrop-blur-md"
          : "border-transparent bg-background"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 md:px-10">
        <a href="#top" className={`flex items-center gap-2.5 rounded-md ${FOCUS_RING}`}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-white p-1 shadow-sm">
            <img src="/images/logo-mark.png" alt="" className="h-full w-full object-contain" />
          </span>
          <span className="font-display text-body font-semibold tracking-tight">Quimora Tech</span>
        </a>
        <nav ref={navRef} className="relative hidden items-center gap-10 text-sm md:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                data-nav-section={l.href.slice(1)}
                aria-current={isActive ? "location" : undefined}
                // El peso de la fuente ya no cambia con el estado activo: al
                // pasar a `font-medium` el texto se ensanchaba y empujaba a los
                // enlaces siguientes, así que la barra se movía sola al hacer
                // scroll. El color y el subrayado ya distinguen el estado.
                className={`rounded-sm py-1 transition-colors duration-200 hover:text-brand ${
                  isActive ? "text-brand" : "text-foreground"
                } ${FOCUS_RING}`}
              >
                {l.label}
              </a>
            );
          })}
          {/*
            Un solo subrayado que viaja entre enlaces, en vez de uno por enlace
            fundiéndose de forma independiente: así se lee como el mismo objeto
            desplazándose y el recorrido cuenta hacia dónde va la lectura.

            Es una transición y no un keyframe a propósito — al hacer scroll
            rápido la sección activa cambia varias veces por segundo, y una
            transición retoma desde donde está en vez de reiniciarse.
          */}
          <span
            aria-hidden="true"
            style={box ? { transform: `translateX(${box.left}px)`, width: box.width } : undefined}
            className={`pointer-events-none absolute -bottom-1 left-0 h-0.5 rounded-full bg-brand ${
              travels ? "transition-[transform,width,opacity] duration-250 ease-in-out-strong" : ""
            } ${box ? "opacity-100" : "opacity-0"}`}
          />
        </nav>
        <div className="hidden items-center md:flex">
          <a
            href="#contacto"
            className={`inline-flex h-11 items-center justify-center rounded-md bg-cta px-6 font-display text-sm font-semibold text-white transition duration-200 hover:bg-cta-hover active:scale-[0.98] ${FOCUS_RING}`}
          >
            Cotizar
          </a>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`grid h-11 w-11 place-items-center rounded-md text-foreground md:hidden active:scale-[0.98] ${FOCUS_RING}`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav
        inert={!open}
        aria-hidden={!open}
        className={`grid overflow-hidden border-hairline bg-background transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <div className="mx-auto min-h-0 flex w-full max-w-[1200px] flex-col px-6 py-4">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "location" : undefined}
                className={`rounded-sm py-3 text-ui transition-colors ${
                  isActive ? "text-brand" : "text-foreground"
                } hover:text-brand ${FOCUS_RING}`}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className={`mt-2 inline-flex h-12 items-center justify-center rounded-md bg-cta px-6 font-display text-sm font-semibold text-white transition duration-200 hover:bg-cta-hover active:scale-[0.98] ${FOCUS_RING}`}
          >
            Cotizar
          </a>
        </div>
      </nav>
    </header>
  );
}
