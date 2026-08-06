import { useEffect, useState } from "react";
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

export function Nav() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useScrollSpy(NAV_SECTION_IDS);

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
      className={`sticky top-0 z-40 w-full border-b transition-all duration-200 ${
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
        <nav className="hidden items-center gap-10 text-sm md:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative rounded-sm py-1 transition-colors duration-200 hover:text-brand ${
                  isActive ? "font-medium text-brand" : "text-foreground"
                } ${FOCUS_RING}`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            );
          })}
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
                  isActive ? "font-medium text-brand" : "text-foreground"
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
