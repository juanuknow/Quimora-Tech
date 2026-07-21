import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { DigitalDiagnosis } from "../components/DigitalDiagnosis";
import { Showcase3D } from "../components/Showcase3D";
import { useInView } from "../lib/hooks";
import {
  FOCUS_RING,
  LIGHT_RING,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  FORMSPREE_ENDPOINT,
  whatsappHref,
  trackEvent,
} from "../lib/site";
import {
  Smartphone,
  Zap,
  BarChart3,
  MessageCircle,
  Code2,
  Rocket,
  TrendingUp,
  Plus,
  Minus,
  Menu,
  X,
  Mail,
  Phone,
  ArrowUp,
  TrendingDown,
  Clock,
  UserX,
  SearchX,
  Search,
  Check,
  AlertCircle,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ property: "og:url", content: "https://quimoratech.com/" }],
    links: [{ rel: "canonical", href: "https://quimoratech.com/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-brand focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-primary-foreground"
      >
        Saltar al contenido principal
      </a>
      <TopBar />
      <Nav />
      <main id="main">
        <Hero />
        <DigitalDiagnosis />
        <Problem />
        <Benefits />
        <Showcase3D />
        <Stats />
        <Timeline />
        <Pricing />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

/**
 * Applies an interactive 3D tilt that follows the cursor across the element.
 * Sets an inline perspective transform on mousemove and springs back on leave.
 * Honors prefers-reduced-motion and only runs on devices with a fine pointer.
 */
function useTilt<T extends HTMLElement>(max = 9) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(
          2,
        )}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [max]);

  return ref;
}

/** Logo oficial de WhatsApp (glifo sólido, hereda el color del texto). */
function WhatsAppIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.944c0 2.105.549 4.16 1.595 5.971L0 24l6.305-1.654a11.9 11.9 0 0 0 5.734 1.46h.005c6.585 0 11.946-5.36 11.949-11.945a11.9 11.9 0 0 0-3.473-8.413" />
    </svg>
  );
}

/* -------------------- Floating WhatsApp -------------------- */
function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-5 right-5 z-50 md:bottom-8 md:right-8">
      <span className="absolute inset-0 animate-ping rounded-full bg-brand/40" />
      <a
        href={whatsappHref("Hola, quiero más información sobre sus servicios")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        onClick={() => trackEvent("contact", { method: "whatsapp", location: "floating" })}
        className={`relative grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-lg transition-transform duration-200 hover:scale-110 ${FOCUS_RING}`}
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}

/* -------------------- Top Bar -------------------- */
function TopBar() {
  return (
    <div className="w-full border-b border-hairline bg-brand-soft">
      <p className="mx-auto max-w-[1200px] px-6 py-2 text-center text-xs font-medium tracking-wide text-brand md:text-[13px]">
        <span>
          Precios accesibles y negociables · Entrega rápida · Soluciones tecnológicas · Tratamiento
          de datos privados
        </span>
      </p>
    </div>
  );
}

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

function Nav() {
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
            <img
              src="/images/logo-mark.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight">
            Quimora Tech
          </span>
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
            className={`inline-flex h-11 items-center justify-center rounded-md bg-cta px-6 font-display text-sm font-semibold text-white transition-colors duration-200 hover:bg-cta-hover ${FOCUS_RING}`}
          >
            Contactar
          </a>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`grid h-10 w-10 place-items-center rounded-md text-foreground md:hidden ${FOCUS_RING}`}
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
                className={`rounded-sm py-3 text-[15px] transition-colors ${
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
            className={`mt-2 inline-flex h-12 items-center justify-center rounded-md bg-cta px-6 font-display text-sm font-semibold text-white transition-colors duration-200 hover:bg-cta-hover ${FOCUS_RING}`}
          >
            Contactar
          </a>
        </div>
      </nav>
    </header>
  );
}

/* -------------------- Hero -------------------- */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-20 md:grid-cols-[1.15fr_1fr] md:px-10 md:py-28">
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-brand sm:text-5xl md:text-[56px]">
            Páginas Web que Convierten
            <br className="hidden md:block" /> tus Visitantes en Clientes Reales
          </h1>
          <p className="mt-6 max-w-xl text-base leading-[1.6] text-foreground md:text-[17px]">
            Desarrollamos sitios web ultra-rápidos, optimizados para móviles y diseñados para hacer
            crecer tu negocio en internet sin dolores de cabeza técnicos.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contacto"
              className={`inline-flex h-14 items-center justify-center rounded-md bg-cta px-8 font-display text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:bg-cta-hover hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] ${FOCUS_RING}`}
            >
              Quiero Mi Web que Convierte
            </a>
            <a
              href="#nosotros"
              className={`inline-flex h-14 items-center justify-center rounded-md border-2 border-brand bg-transparent px-8 font-display text-[15px] font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft ${FOCUS_RING}`}
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
    <div
      className="animate-float-3d pointer-events-none hidden drop-shadow-2xl md:block"
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 320" className="h-auto w-full" fill="none">
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
        <polyline
          points="70,180 130,150 190,160 240,110 300,90 330,70"
          stroke="#18181b"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data points */}
        <circle cx="240" cy="110" r="4" fill="#18181b" />
        <circle cx="330" cy="70" r="5" fill="#71717a" />
        {/* Small bars */}
        <rect x="70" y="205" width="12" height="20" rx="2" fill="#f4f4f5" />
        <rect x="90" y="195" width="12" height="30" rx="2" fill="#f4f4f5" />
        <rect x="110" y="185" width="12" height="40" rx="2" fill="#18181b" opacity="0.25" />
      </svg>
    </div>
  );
}

/* -------------------- Problem -------------------- */
const PAINS = [
  {
    icon: SearchX,
    title: "Nadie te encuentra en Google",
    body: "Sin optimización, tu negocio es invisible. Tus clientes potenciales están comprándole a tu competencia.",
  },
  {
    icon: Clock,
    title: "Una web lenta espanta clientes",
    body: "El 53% de los usuarios abandona un sitio que tarda más de 3 segundos en cargar. Cada segundo cuenta.",
  },
  {
    icon: UserX,
    title: "Visitas que no se convierten",
    body: "Recibes tráfico pero nadie te contacta ni compra. Una web sin estrategia es solo una tarjeta de presentación cara.",
  },
  {
    icon: TrendingDown,
    title: "Tu competencia te adelanta",
    body: "Mientras esperas, otros captan a tus clientes con sitios modernos, rápidos y pensados para vender.",
  },
] as const;

function Problem() {
  return (
    <section className="border-t border-hairline bg-hairline/60">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <AlertCircle size={14} />
            El problema
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-[40px]">
            Cada día sin una web que venda, pierdes dinero
          </h2>
          <p className="mt-4 text-base text-foreground/80 md:text-[17px]">
            La mayoría de negocios tienen una web que no trabaja para ellos. Estos son los errores
            que te están costando clientes ahora mismo.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PAINS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col rounded-xl border border-hairline bg-background p-6"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-soft text-brand">
                <Icon size={22} strokeWidth={1.9} />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-[1.6] text-foreground/70">{body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-2xl text-center font-display text-lg font-medium text-foreground md:text-xl">
          La buena noticia: todo esto tiene solución.{" "}
          <span className="text-brand">Y es más simple de lo que crees.</span>
        </p>
      </div>
    </section>
  );
}

/* -------------------- Benefits -------------------- */
const BENEFITS = [
  {
    icon: Smartphone,
    iconColor: "brand",
    title: "Diseño Mobile-First que Convierte",
    body: "Más del 62% del tráfico web viene de móviles. Tu página se ve perfecta en celulares y guía sin distracciones hacia la compra o el contacto.",
    metric: "62% de usuarios",
  },
  {
    icon: Zap,
    iconColor: "accent",
    title: "Velocidad de Carga Ultra-Rápida",
    body: "Los usuarios abandonan páginas que tardan más de 3 segundos. Entregamos sitios optimizados que retienen clientes y mejoran tu posicionamiento en Google.",
    metric: "-3s en carga",
  },
  {
    icon: Search,
    iconColor: "brand",
    title: "SEO que te Posiciona en Google",
    body: "Optimizamos estructura, velocidad y contenido desde el día uno para que tus clientes te encuentren primero, sin depender solo de publicidad paga.",
    metric: "+visibilidad orgánica",
  },
  {
    icon: BarChart3,
    iconColor: "accent",
    title: "Gestión Sencilla y Analítica Integrada",
    body: "Olvídate de la complejidad técnica. Conectamos tu web con Google Analytics para que veas resultados reales y te enfoques en tu negocio.",
    metric: "100% Medible",
  },
] as const;

function Benefits() {
  return (
    <section id="servicios" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Award size={14} />
            Por qué Quimora Tech
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-[40px]">
            Cada decisión está hecha para hacerte crecer
          </h2>
          <p className="mt-4 text-base text-foreground/80 md:text-[17px]">
            No vendemos plantillas genéricas. Diseñamos y desarrollamos cada sitio pensando en un
            solo objetivo: convertir visitantes en clientes reales.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.title} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit }: { benefit: (typeof BENEFITS)[number] }) {
  const { icon: Icon, iconColor, title, body, metric } = benefit;
  const tiltRef = useTilt<HTMLDivElement>(7);

  return (
    <article
      ref={tiltRef}
      className="tilt-card flex flex-col rounded-xl border border-hairline bg-background p-8 hover:border-brand/40 hover:shadow-xl"
    >
      <div
        className={`tilt-layer grid h-12 w-12 place-items-center rounded-lg ${
          iconColor === "accent"
            ? "bg-accent-strong-soft text-accent-strong"
            : "bg-brand-soft text-brand"
        }`}
      >
        <Icon size={24} strokeWidth={1.9} />
      </div>
      <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-foreground md:text-[22px]">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-[1.6] text-foreground/80">{body}</p>
      <span className="mt-6 text-sm font-medium text-muted-foreground">{metric}</span>
    </article>
  );
}

/* -------------------- Stats -------------------- */
// Compromisos y estándares del servicio (verificables), no métricas de
// trayectoria. Se muestran como la vara con la que trabajamos cada proyecto.
const STATS = [
  { value: 3, prefix: "< ", suffix: "s", label: "Velocidad de carga que buscamos" },
  { value: 100, prefix: "", suffix: "%", label: "Diseño responsive, mobile-first" },
  { value: 24, prefix: "", suffix: "h", label: "Respuesta a tu mensaje" },
  { value: 95, prefix: "", suffix: "+", label: "Meta en Google Lighthouse" },
] as const;

/** Counts from 0 to `end` over `duration` ms once `active` becomes true. */
function useCountUp(end: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      // easeOutCubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, active, duration]);

  return value;
}

function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="bg-brand text-white">
      <div
        ref={ref}
        className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-10 px-6 py-16 md:grid-cols-4 md:px-10 md:py-20"
      >
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={inView} />
        ))}
      </div>
    </section>
  );
}

function StatItem({ stat, active }: { stat: (typeof STATS)[number]; active: boolean }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-display text-4xl font-bold tracking-tight tabular-nums md:text-5xl">
        {stat.prefix}
        {count}
        {stat.suffix}
      </span>
      <span className="mt-2 max-w-[160px] text-sm text-white/60">{stat.label}</span>
    </div>
  );
}

/* -------------------- Timeline (signature) -------------------- */
const STEPS = [
  {
    week: "SEMANA 1",
    icon: MessageCircle,
    accent: false,
    title: "Diagnóstico",
    body: "Escuchamos tus metas, analizamos tu competencia y definimos la estrategia.",
  },
  {
    week: "SEMANA 2–3",
    icon: Code2,
    accent: false,
    title: "Desarrollo",
    body: "Diseñamos y desarrollamos tu web con las últimas tecnologías, optimizada desde el inicio.",
  },
  {
    week: "SEMANA 4",
    icon: Rocket,
    accent: true,
    title: "Lanzamiento",
    body: "Tu web sale a producción. Tus clientes ya la ven, comienzan a contactarte.",
  },
  {
    week: "DESPUÉS",
    icon: TrendingUp,
    accent: false,
    title: "Crecimiento Continuo",
    body: "Medimos, optimizamos y escalamos. Cada semana, mejor.",
  },
] as const;

function Timeline() {
  return (
    <section id="nosotros" className="border-t border-hairline bg-hairline/60">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent-strong">
            Tu web lista en 4 semanas. No 4 meses.
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-[40px]">
            Crecer es Simple
          </h2>
        </div>

        {/* Desktop timeline */}
        <div className="relative mt-20 hidden md:block">
          {/* Track */}
          <div className="absolute left-[8%] right-[8%] top-8 h-[2px] bg-white" />
          <div className="absolute left-[8%] right-[8%] top-8 h-[2px] bg-brand" />
          <div className="relative grid grid-cols-4 gap-6">
            {STEPS.map(({ week, icon: Icon, accent, title, body }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div
                  className={`relative z-10 grid h-16 w-16 place-items-center rounded-full border-2 ${
                    accent
                      ? "border-accent-strong bg-white text-accent-strong"
                      : "border-brand bg-white text-brand"
                  }`}
                >
                  <Icon size={26} strokeWidth={1.9} />
                </div>
                <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {week}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-2 max-w-[240px] text-sm leading-[1.6] text-foreground/75">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile timeline */}
        <ol className="relative mt-14 space-y-8 md:hidden">
          <div className="absolute left-[27px] top-2 bottom-2 w-[2px] bg-brand/30" />
          {STEPS.map(({ week, icon: Icon, accent, title, body }) => (
            <li key={title} className="relative flex gap-5">
              <div
                className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 bg-white ${
                  accent ? "border-accent-strong text-accent-strong" : "border-brand text-brand"
                }`}
              >
                <Icon size={22} strokeWidth={1.9} />
              </div>
              <div className="min-w-0 pt-1">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                  {week}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-[15px] leading-[1.6] text-foreground/75">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------- Pricing -------------------- */
const PLANS = [
  {
    name: "Presencia",
    price: "Desde $650.000",
    period: "pago único · sin mensualidades",
    description:
      "Ideal para negocios que necesitan estar en línea con una web profesional de una sola página.",
    features: [
      "Landing page a medida",
      "Mobile-first",
      "Formulario de contacto",
      "Entrega en 2-3 semanas",
    ],
    featured: false,
  },
  {
    name: "Crecimiento",
    price: "Desde $950.000",
    period: "pago único · sin mensualidades",
    description:
      "Para negocios que quieren convertir visitantes en clientes con analítica y varias secciones.",
    features: [
      "Sitio multi-sección",
      "Google Analytics + Search Console",
      "Panel de edición simple",
      "Entrega en 2-4 semanas",
    ],
    featured: true,
  },
  {
    name: "A Medida",
    price: "Cotización personalizada",
    period: "según alcance",
    description:
      "Para tiendas en línea, sistemas de reservas o integraciones específicas de tu negocio.",
    features: [
      "Funcionalidad a medida",
      "Integraciones y pagos",
      "Mantenimiento incluido",
      "Acompañamiento continuo",
    ],
    featured: false,
  },
] as const;

// Compromisos reales presentes en cualquier proyecto (sin métricas inventadas).
const PLAN_INCLUDES = [
  "Diseño mobile-first, responsive",
  "Optimización de velocidad de carga",
  "Buenas prácticas de SEO desde el inicio",
  "Conexión con WhatsApp",
  "Entrega de accesos y archivos del proyecto",
  "Acompañamiento durante el lanzamiento",
] as const;

function Pricing() {
  return (
    <section id="precios" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-[40px]">
            Una inversión que se paga sola
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-foreground/80 md:text-[17px]">
            No es un gasto: una web bien hecha recupera su valor con los primeros clientes que te
            trae. Sin costos ocultos y con precios claros desde el inicio.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        {/* Included in every plan */}
        <div className="mt-8 rounded-2xl border border-hairline bg-brand-soft/40 p-6 md:p-8">
          <p className="text-center font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Incluido en todos los planes
          </p>
          <ul className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLAN_INCLUDES.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                <Check size={16} className="shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Recurring maintenance cross-sell */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-5 rounded-2xl border border-hairline bg-hairline/40 p-6 text-center sm:flex-row sm:text-left md:p-8">
          <div>
            <h3 className="font-display text-lg font-semibold text-brand">
              ¿Ya tienes tu web funcionando?
            </h3>
            <p className="mt-1.5 text-sm leading-[1.6] text-foreground/75">
              Con nuestros planes de mantenimiento mensual la mantenemos rápida, segura y creciendo:
              actualizaciones, respaldos y mejoras continuas.
            </p>
          </div>
          <a
            href="#contacto"
            className={`inline-flex h-12 shrink-0 items-center justify-center rounded-md border-2 border-brand px-6 font-display text-sm font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft ${FOCUS_RING}`}
          >
            Ver mantenimiento
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-foreground/70">
          Precios de referencia en pesos colombianos (COP), como pago único. El valor final depende
          del alcance de cada proyecto y se confirma en la cotización.
        </p>
      </div>
    </section>
  );
}

function PricingCard({ plan, index }: { plan: (typeof PLANS)[number]; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const tiltRef = useTilt<HTMLDivElement>(6);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${index * 120}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <article
        ref={tiltRef}
        className={`tilt-card flex h-full flex-col rounded-xl border p-8 hover:shadow-xl ${
          plan.featured
            ? "border-brand bg-brand-soft hover:shadow-brand/20"
            : "border-hairline bg-background"
        }`}
      >
        {plan.featured && (
          <span className="tilt-layer mb-4 inline-flex w-fit animate-pulse items-center rounded-full bg-brand px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            Más elegido
          </span>
        )}
        <h3 className="font-display text-xl font-semibold text-foreground">{plan.name}</h3>
        <p className="mt-4 font-display text-2xl font-bold text-brand">{plan.price}</p>
        <p className="text-sm text-foreground/70">{plan.period}</p>
        <p className="mt-4 text-[15px] leading-[1.6] text-foreground/80">{plan.description}</p>
        <ul className="mt-6 flex flex-1 flex-col gap-2.5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {f}
            </li>
          ))}
        </ul>
        <a
          href="#contacto"
          className={`mt-8 inline-flex h-12 items-center justify-center rounded-md font-display text-sm font-semibold transition-colors duration-200 ${FOCUS_RING} ${
            plan.featured
              ? "bg-cta text-white hover:bg-cta-hover"
              : "border-2 border-brand text-brand hover:bg-brand-soft"
          }`}
        >
          Solicitar Cotización
        </a>
      </article>
    </div>
  );
}

/* -------------------- FAQ -------------------- */
const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en estar lista mi web?",
    a: "Típicamente entre 2 y 4 semanas dependiendo de la complejidad. La mayoría de negocios ven avances significativos en las primeras 4 semanas.",
  },
  {
    q: "¿Puedo editar la web después?",
    a: "Sí, te entrenamos y proporcionamos un panel de administración simple. No necesitas conocimientos técnicos.",
  },
  {
    q: "¿Incluye posicionamiento en Google (SEO)?",
    a: "Sí, todas nuestras webs están optimizadas desde el inicio con mejores prácticas SEO. Conexión con Google Analytics y Google Search Console incluida.",
  },
  {
    q: "¿Qué pasa si necesito cambios después?",
    a: "Tenemos planes de mantenimiento flexible. Un email, una llamada, y resolvemos en máximo 24 horas.",
  },
  {
    q: "¿De quién es la web cuando terminamos?",
    a: "Tuya, al 100%. Te entregamos los accesos y los archivos del proyecto. No quedas amarrado a nosotros: puedes seguir con quien quieras.",
  },
  {
    q: "¿Por qué no son la opción más barata?",
    a: "Porque no vendemos plantillas genéricas. Cada sitio se diseña a medida, optimizado para cargar rápido y para vender. Una web barata que no convierte termina saliendo más cara.",
  },
  {
    q: "¿Trabajan con negocios fuera de Cali?",
    a: "Sí. Trabajamos con toda Colombia de forma remota: reuniones por videollamada y coordinación por WhatsApp. La distancia no es problema.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[820px] px-6 py-24 md:py-28">
        <h2 className="text-center font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-[40px]">
          Preguntas Frecuentes
        </h2>
        <div className="mt-12 divide-y divide-hairline border-y border-hairline">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-brand ${FOCUS_RING}`}
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-[16px] font-semibold text-foreground md:text-[17px]">
                    {f.q}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${
                      isOpen ? "border-brand bg-brand text-white" : "border-hairline text-brand"
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="pb-6 pr-12 text-[15px] leading-[1.6] text-foreground/75">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Contact -------------------- */
type ContactErrors = { name?: string; email?: string; message?: string };

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const update =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): ContactErrors => {
    const next: ContactErrors = {};
    if (!form.name.trim()) next.name = "Cuéntanos tu nombre.";
    if (!form.email.trim()) next.email = "Necesitamos un correo para responderte.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Ese correo no parece válido.";
    if (!form.message.trim()) next.message = "Cuéntanos brevemente qué necesitas.";
    setErrors(next);
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(false);
    const next = validate();
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else if (next.message) messageRef.current?.focus();
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || "—",
          message: form.message,
          _subject: `Nueva consulta de ${form.name} · Quimora Tech`,
        }),
      });
      if (!res.ok) throw new Error(`Formspree respondió ${res.status}`);
      setSent(true);
      trackEvent("generate_lead", { method: "contact_form" });
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldBase = `w-full rounded-md border bg-background px-4 py-3 text-[15px] text-foreground transition-colors placeholder:text-muted-foreground/70 ${FOCUS_RING}`;

  return (
    <section id="contacto" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Left: pitch + direct options */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-hairline/60 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Hablemos
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-[40px]">
              Cuéntanos sobre tu proyecto
            </h2>
            <p className="mt-4 max-w-md text-base text-foreground/80 md:text-[17px]">
              Respondemos en menos de 24 horas con una propuesta clara. Sin compromiso y sin
              lenguaje técnico complicado.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <a
                href={whatsappHref("Hola, quiero una consulta gratis")}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <WhatsAppIcon size={18} />
                </span>
                WhatsApp directo
              </a>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Phone size={18} />
                </span>
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Mail size={18} />
                </span>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-hairline bg-hairline/40 p-6 md:p-8">
            {sent ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white">
                  <Check size={28} />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                  ¡Mensaje enviado!
                </h3>
                <p className="mt-2 max-w-sm text-sm text-foreground/70">
                  Gracias por escribirnos. Te responderemos en menos de 24 horas. Si prefieres,
                  escríbenos directo por WhatsApp y te contestamos al instante.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", phone: "", message: "" });
                  }}
                  className={`mt-6 rounded-md font-display text-sm font-semibold text-brand underline-offset-4 hover:underline ${FOCUS_RING}`}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="cf-name"
                    className="font-display text-sm font-medium text-foreground"
                  >
                    Nombre <span className="text-accent-strong">*</span>
                  </label>
                  <input
                    id="cf-name"
                    ref={nameRef}
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "cf-name-err" : undefined}
                    className={`mt-2 ${fieldBase} ${errors.name ? "border-destructive" : "border-input"}`}
                    placeholder="Tu nombre"
                  />
                  {errors.name && (
                    <p id="cf-name-err" className="mt-1.5 text-xs text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cf-email"
                      className="font-display text-sm font-medium text-foreground"
                    >
                      Email <span className="text-accent-strong">*</span>
                    </label>
                    <input
                      id="cf-email"
                      ref={emailRef}
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "cf-email-err" : undefined}
                      className={`mt-2 ${fieldBase} ${errors.email ? "border-destructive" : "border-input"}`}
                      placeholder="tu@correo.com"
                    />
                    {errors.email && (
                      <p id="cf-email-err" className="mt-1.5 text-xs text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="cf-phone"
                      className="font-display text-sm font-medium text-foreground"
                    >
                      Teléfono <span className="text-muted-foreground">(opcional)</span>
                    </label>
                    <input
                      id="cf-phone"
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      className={`mt-2 ${fieldBase} border-input`}
                      placeholder="+57 300 000 0000"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cf-message"
                    className="font-display text-sm font-medium text-foreground"
                  >
                    Mensaje <span className="text-accent-strong">*</span>
                  </label>
                  <textarea
                    id="cf-message"
                    ref={messageRef}
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "cf-message-err" : undefined}
                    className={`mt-2 resize-y ${fieldBase} ${errors.message ? "border-destructive" : "border-input"}`}
                    placeholder="Cuéntanos qué necesitas para tu negocio…"
                  />
                  {errors.message && (
                    <p id="cf-message-err" className="mt-1.5 text-xs text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  >
                    No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className={`inline-flex h-14 items-center justify-center rounded-md bg-cta px-8 font-display text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
                >
                  {submitting ? "Enviando…" : "Enviar consulta"}
                </button>
                <p className="text-center text-xs text-foreground/70">
                  Al enviar aceptas nuestra{" "}
                  <a href="/privacidad" className="underline underline-offset-2 hover:text-brand">
                    Política de Privacidad
                  </a>{" "}
                  y que te contactemos sobre tu consulta. Nunca compartimos tus datos.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Final CTA -------------------- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-brand-dark">
      {/* Lightweight CSS backdrop (replaces the old 2 MB looping video). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.10),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.06),transparent_50%)]"
      />
      <div className="relative mx-auto max-w-[820px] px-6 py-24 text-center md:py-28">
        <h2 className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-[44px]">
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
            className={`inline-flex h-14 w-full items-center justify-center rounded-md bg-white px-8 font-display text-[15px] font-semibold text-brand transition-colors duration-200 hover:bg-white/90 sm:w-auto ${LIGHT_RING}`}
          >
            Solicitar Consulta Gratis
          </a>
          <a
            href="#showcase"
            className={`inline-flex h-14 w-full items-center justify-center rounded-md border-2 border-white/50 bg-transparent px-8 font-display text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-white/10 sm:w-auto ${LIGHT_RING}`}
          >
            Ver Casos de Éxito
          </a>
        </div>
        <p className="mt-8 text-[15px] text-white/80">
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

/* -------------------- Footer -------------------- */
const FOOTER_NAV = [
  {
    title: "Navegación",
    links: [
      { href: "#top", label: "Inicio" },
      { href: "#servicios", label: "Servicios" },
      { href: "#nosotros", label: "Cómo Trabajamos" },
      { href: "#precios", label: "Precios" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "#showcase", label: "Casos de Éxito" },
      { href: "#faq", label: "Preguntas Frecuentes" },
      { href: "#contacto", label: "Contacto" },
    ],
  },
] as const;

function Footer() {
  return (
    <footer className="bg-[#09090b] text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div>
            <a href="#top" className={`inline-flex items-center gap-2.5 rounded-md ${LIGHT_RING}`}>
              <span className="grid h-9 w-9 place-items-center rounded-md bg-white p-1">
                <img
                  src="/images/logo-mark.png"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="font-display text-[17px] font-semibold tracking-tight">
                Quimora Tech
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-[1.7] text-white/55">
              Diseñamos y desarrollamos sitios web que convierten visitantes en clientes reales.
              Rápidos, medibles y hechos para crecer.
            </p>
            <a
              href={whatsappHref("Hola, quiero más información")}
              target="_blank"
              rel="noopener noreferrer"
              className={`tilt-card mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-sm font-semibold text-[#09090b] transition-colors hover:bg-white/90 ${LIGHT_RING}`}
            >
              <WhatsAppIcon size={16} />
              Escríbenos por WhatsApp
            </a>
          </div>

          {/* Nav columns */}
          {FOOTER_NAV.map((col) => (
            <nav key={col.title}>
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-white/40">
                {col.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3.5 text-sm text-white/65">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className={`rounded-sm transition-colors hover:text-white ${LIGHT_RING}`}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact column */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-white/40">
              Contacto
            </h3>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-white/65">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className={`inline-flex items-center gap-3 rounded-sm transition-colors hover:text-white ${LIGHT_RING}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5">
                    <Phone size={15} />
                  </span>
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={`inline-flex items-center gap-3 rounded-sm transition-colors hover:text-white ${LIGHT_RING}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5">
                    <Mail size={15} />
                  </span>
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/45 md:flex-row md:px-10">
          <p>© 2026 Quimora Tech. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a
              href="/privacidad"
              className={`rounded-sm transition-colors hover:text-white ${LIGHT_RING}`}
            >
              Privacidad
            </a>
            <a
              href="/terminos"
              className={`rounded-sm transition-colors hover:text-white ${LIGHT_RING}`}
            >
              Términos
            </a>
            <a
              href="#top"
              aria-label="Volver arriba"
              className={`inline-flex items-center gap-1.5 rounded-sm transition-colors hover:text-white ${LIGHT_RING}`}
            >
              Arriba
              <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
