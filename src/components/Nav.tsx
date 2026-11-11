import { useEffect, useRef, useState, type RefObject } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { FOCUS_RING } from "../lib/site";
import { servicesWithPage } from "../lib/services-data";

/* -------------------- Nav -------------------- */
// Hrefs con prefijo "/": el navbar ahora también se monta en /servicios/[slug],
// no solo en la home. "/#id" navega a la home y salta a la sección tanto si ya
// estás ahí (el navegador solo mueve el scroll, sin recargar) como si vienes
// de otra ruta.
//
// El orden DEBE seguir el de las secciones en la página (src/routes/index.tsx):
// el subrayado activo viaja de izquierda a derecha a medida que se baja, y un
// enlace fuera de orden lo hacía saltar hacia adelante y volver atrás.
const NAV_LINKS = [
  { id: "top", href: "/#top", label: "Inicio" },
  { id: "showcase", href: "/#showcase", label: "Proyectos" },
  // Apunta a "#soluciones" (la sección con el catálogo real) y no a
  // "#servicios" (la sección "Por qué Quimora Tech"): el dropdown que cuelga
  // de este ítem lista justamente esos servicios, así que el clic debe
  // aterrizar donde vive el contenido que el submenú promete.
  { id: "soluciones", href: "/#soluciones", label: "Servicios" },
  { id: "nosotros", href: "/#nosotros", label: "Cómo trabajamos" },
  { id: "precios", href: "/#precios", label: "Precios" },
  { id: "contacto", href: "/#contacto", label: "Contacto" },
] as const;
const NAV_SECTION_IDS: readonly string[] = NAV_LINKS.map((l) => l.id);
/** Referencia estable para "sin scroll-spy" (fuera de la home): un `[]` literal
 *  sería un array nuevo en cada render y reejecutaría el efecto cada vez. */
const NO_SECTION_IDS: readonly string[] = [];

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

/**
 * Fracción del área visible bajo el header donde está la "línea de lectura": una
 * sección pasa a ser la actual cuando su borde superior cruza el primer cuarto.
 */
const READING_LINE_RATIO = 0.25;

/**
 * Sección actual para el resaltado del navbar, calculada por POSICIÓN.
 *
 * La activa es la sección enlazada cuyo borde superior ya cruzó la línea de
 * lectura y está más abajo que las demás que la cruzaron. Esto:
 * - funciona igual al bajar, al subir y tras un salto por ancla (todo eso
 *   dispara `scroll`);
 * - en las secciones sin enlace propio, como Por qué Quimora, Orientación y FAQ,
 *   mantiene la última sección enlazada que quedó por encima, en vez de
 *   quedarse con la que estuviera marcada antes (el fallo del enfoque anterior
 *   con IntersectionObserver, que solo reaccionaba a entradas en una franja).
 *
 * Costo: un cálculo por frame como máximo (`requestAnimationFrame`), con el
 * listener de scroll pasivo, y React solo se entera si la sección cambia.
 *
 * `ResizeObserver` observa únicamente `<main>`: su alto cambia cada vez que
 * cambia el de cualquier sección (imágenes que cargan, FAQ que se despliega,
 * pasos del diagnóstico), que es justo lo que mueve las secciones sin que haya
 * scroll. `resize` cubre los cambios de viewport y orientación.
 */
function useScrollSpy(ids: readonly string[], headerRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (ids.length === 0) return;

    let frame = 0;
    let current: string | undefined;

    const compute = () => {
      frame = 0;
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      const line = headerBottom + (window.innerHeight - headerBottom) * READING_LINE_RATIO;

      let next = ids[0];
      let nextTop = Number.NEGATIVE_INFINITY;
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line && top > nextTop) {
          next = id;
          nextTop = top;
        }
      }

      if (next !== current) {
        current = next;
        setActive(next);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const main = document.querySelector("main");
    const resizeObserver = main ? new ResizeObserver(schedule) : null;
    if (main) resizeObserver?.observe(main);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resizeObserver?.disconnect();
    };
  }, [ids, headerRef]);

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

    // getBoundingClientRect en vez de offsetLeft/offsetWidth: "Servicios" vive
    // dentro de un wrapper con `position: relative` propio (necesario para
    // anclar el dropdown), lo que lo convierte en su `offsetParent` y rompe el
    // cálculo de `offsetLeft` para ese enlace en particular. Restando rects
    // el resultado es correcto sin importar cuántos contenedores posicionados
    // haya de por medio.
    const measure = () => {
      const el = nav.querySelector<HTMLElement>(`[data-nav-section="${active}"]`);
      if (!el) {
        setBox(null);
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setBox({ left: elRect.left - navRect.left, width: elRect.width });
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
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const scrolled = useScrolled();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";
  // El scroll-spy solo tiene sentido en la home: en /servicios/[slug] esos ids
  // no existen en el documento. Fuera de la home, "Servicios" se marca activo
  // por ruta en vez de por scroll.
  const scrollSpyActive = useScrollSpy(onHome ? NAV_SECTION_IDS : NO_SECTION_IDS, headerRef);
  const active = onHome ? scrollSpyActive : pathname.startsWith("/servicios/") ? "soluciones" : "";
  const { navRef, box, travels } = useActiveIndicator(active);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        // El panel se oculta con `inert`: sin esto el foco se pierde al cerrar.
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    // Desde `md` el panel queda oculto por CSS (`md:hidden`), pero el estado
    // seguiría abierto y el body bloqueado: al girar el móvil a horizontal o
    // ensanchar la ventana, la página se quedaba sin scroll. Se cierra el menú.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    desktop.addEventListener("change", onBreakpoint);
    // Alto disponible para el panel: desde el borde inferior REAL del header
    // hasta el final del viewport. No es constante —la barra superior ocupa
    // una o dos líneas según el ancho, y solo se ve antes de hacer scroll—, así
    // que se mide. Con el body bloqueado el header no se mueve mientras el menú
    // está abierto; solo hace falta volver a medir si cambia el viewport.
    const fitPanel = () => {
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      mobileMenuRef.current?.style.setProperty(
        "--menu-max-h",
        `${Math.max(0, window.innerHeight - headerBottom)}px`,
      );
    };
    fitPanel();
    window.addEventListener("resize", fitPanel);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
      window.removeEventListener("resize", fitPanel);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
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
        <nav
          ref={navRef}
          aria-label="Principal"
          className="relative hidden items-center gap-6 text-sm md:flex lg:gap-10"
        >
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
          ref={menuButtonRef}
          onClick={() => setOpen((v) => !v)}
          className={`grid h-11 w-11 place-items-center rounded-md text-foreground md:hidden active:scale-[0.98] ${FOCUS_RING}`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav
        ref={mobileMenuRef}
        id="mobile-menu"
        aria-label="Principal"
        inert={!open}
        aria-hidden={!open}
        // Panel FUERA del flujo (`absolute`, anclado bajo el header sticky): al
        // estar dentro del flujo, abrirlo empujaba la página hacia abajo, el
        // navegador calculaba el destino del ancla con el menú abierto y, al
        // plegarse, todo subía ~336 px y el usuario aterrizaba a mitad de la
        // sección. Encima del contenido, abrir o cerrar no mueve el documento.
        className={`absolute inset-x-0 top-full grid overflow-hidden border-hairline bg-background transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr] border-y" : "grid-rows-[0fr]"
        }`}
      >
        {/* El ítem de la grilla no lleva padding: con padding, la fila `0fr` no
            colapsa del todo y el panel "cerrado" medía 32 px — una franja blanca
            que antes engordaba el header en móvil (113 px en vez de 80) y que,
            ya fuera del flujo, tapaba el inicio de cada sección. */}
        <div className="min-h-0">
          {/* Tope de alto con scroll interno: con el body bloqueado y el
              acordeón de servicios abierto, en pantallas bajas (móvil en
              horizontal) los últimos enlaces quedarían fuera del viewport.
              `--menu-max-h` se mide al abrir (ver el efecto de `open`). */}
          <div className="mx-auto flex max-h-[calc(var(--menu-max-h,100dvh)-2px)] w-full max-w-[1200px] flex-col overflow-y-auto overscroll-contain px-6 py-4">
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
  // WCAG 1.4.13: el contenido que aparece por hover/foco debe poder descartarse
  // sin mover el puntero ni el foco. Esc lo oculta; se rearma al salir del
  // elemento (puntero o foco), de modo que volver a entrar lo abre otra vez.
  const [dismissed, setDismissed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  // Listener en `document` y no `onKeyDown` del contenedor: con el menú abierto
  // solo por hover el foco sigue en <body>, y ahí el evento nunca llegaría al
  // contenedor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const focusInside = wrapper.contains(document.activeElement);
      if (!focusInside && !wrapper.matches(":hover")) return;
      setDismissed(true);
      // Si el foco estaba dentro del submenú (ahora oculto), vuelve al enlace.
      if (focusInside) triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="group relative"
      data-dismissed={dismissed}
      onMouseLeave={() => setDismissed(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setDismissed(false);
      }}
    >
      <a
        ref={triggerRef}
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
      <div className="invisible absolute left-1/2 top-full z-50 w-72 group-data-[dismissed=true]:invisible! group-data-[dismissed=true]:opacity-0! -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-[opacity,visibility,translate] duration-200 ease-out-strong group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
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
