import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { FOCUS_RING } from "../lib/site";
import { servicesWithPage } from "../lib/services-data";

/* -------------------- Nav -------------------- */
// Hrefs con prefijo "/": el navbar ahora también se monta en /servicios/[slug],
// no solo en la home. "/#id" navega a la home y salta a la sección tanto si ya
// estás ahí (el navegador solo mueve el scroll, sin recargar) como si vienes
// de otra ruta.
const NAV_LINKS = [
  { id: "top", href: "/#top", label: "Inicio" },
  // Apunta a "#soluciones" (la sección con el catálogo real) y no a
  // "#servicios" (la sección "Por qué Quimora Tech"): el dropdown que cuelga
  // de este ítem lista justamente esos servicios, así que el clic debe
  // aterrizar donde vive el contenido que el submenú promete.
  { id: "soluciones", href: "/#soluciones", label: "Servicios" },
  { id: "nosotros", href: "/#nosotros", label: "Nosotros" },
  { id: "precios", href: "/#precios", label: "Precios" },
  { id: "showcase", href: "/#showcase", label: "Casos de Éxito" },
  { id: "contacto", href: "/#contacto", label: "Contacto" },
] as const;
const NAV_SECTION_IDS = NAV_LINKS.map((l) => l.id);

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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";
  // El scroll-spy solo tiene sentido en la home: en /servicios/[slug] esos ids
  // no existen en el documento. Fuera de la home, "Servicios" se marca activo
  // por ruta en vez de por scroll.
  const scrollSpyActive = useScrollSpy(onHome ? NAV_SECTION_IDS : []);
  const active = onHome ? scrollSpyActive : pathname.startsWith("/servicios/") ? "soluciones" : "";
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
        <a href="/#top" className={`flex items-center gap-2.5 rounded-md ${FOCUS_RING}`}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-white p-1 shadow-sm">
            <img src="/images/logo-mark.png" alt="" className="h-full w-full object-contain" />
          </span>
          <span className="font-display text-body font-semibold tracking-tight">Quimora Tech</span>
        </a>
        <nav ref={navRef} className="relative hidden items-center gap-10 text-sm md:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.id;
            if (l.id === "soluciones") {
              return (
                <ServicesNavItem key={l.id} href={l.href} label={l.label} isActive={isActive} />
              );
            }
            return (
              <a
                key={l.id}
                href={l.href}
                data-nav-section={l.id}
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
            href="/#contacto"
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
            const isActive = active === l.id;
            if (l.id === "soluciones") {
              return (
                <MobileServicesItem
                  key={l.id}
                  href={l.href}
                  label={l.label}
                  isActive={isActive}
                  onNavigate={() => setOpen(false)}
                />
              );
            }
            return (
              <a
                key={l.id}
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
            href="/#contacto"
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

/* -------------------- Dropdown "Servicios" (desktop) -------------------- */

/**
 * Se abre por hover (mouse) y por foco (teclado) vía `group-focus-within`,
 * sin estado de React: es lo más simple que cubre ambos casos sin listeners
 * de blur/click-outside propios. El enlace principal sigue navegando a
 * "#soluciones" — el dropdown es una vía rápida adicional, no la única.
 */
function ServicesNavItem({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <div className="group relative">
      <a
        href={href}
        data-nav-section="soluciones"
        aria-current={isActive ? "location" : undefined}
        className={`inline-flex items-center gap-1 rounded-sm py-1 transition-colors duration-200 hover:text-brand ${
          isActive ? "text-brand" : "text-foreground"
        } ${FOCUS_RING}`}
      >
        {label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className="transition-transform duration-200 ease-out-strong group-hover:rotate-180 group-focus-within:rotate-180"
        />
      </a>
      <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-200 ease-out-strong group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-lg border border-hairline bg-background p-2 shadow-xl">
          {servicesWithPage.map((service) => {
            const Icon = service.icon;
            return (
              <a
                key={service.slug}
                href={`/servicios/${service.slug}`}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-brand-soft hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
                  <Icon size={16} strokeWidth={1.8} />
                </span>
                {service.title}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Dropdown "Servicios" (móvil) -------------------- */

/** Acordeón: mismo mecanismo `grid-rows` que el propio menú móvil, a menor escala. */
function MobileServicesItem({
  href,
  label,
  isActive,
  onNavigate,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-hairline/60 last:border-b-0">
      <div className="flex items-center">
        <a
          href={href}
          onClick={onNavigate}
          aria-current={isActive ? "location" : undefined}
          className={`flex-1 rounded-sm py-3 text-ui transition-colors ${
            isActive ? "text-brand" : "text-foreground"
          } hover:text-brand ${FOCUS_RING}`}
        >
          {label}
        </a>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? "Ocultar servicios" : "Mostrar servicios"}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-md text-foreground active:scale-[0.98] ${FOCUS_RING}`}
        >
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ease-out-strong ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-1 pb-3 pl-4">
            {servicesWithPage.map((service) => {
              const Icon = service.icon;
              return (
                <a
                  key={service.slug}
                  href={`/servicios/${service.slug}`}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-md py-2.5 text-sm text-foreground/85 transition-colors hover:text-brand ${FOCUS_RING}`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
                    <Icon size={14} strokeWidth={1.8} />
                  </span>
                  {service.title}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
