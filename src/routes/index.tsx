import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Smartphone,
  Zap,
  BarChart3,
  MessageCircle,
  Code2,
  Rocket,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Star,
  Menu,
  X,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Nav />
      <Hero />
      <Benefits />
      <Timeline />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* -------------------- Nav -------------------- */
function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#top", label: "Inicio" },
    { href: "#servicios", label: "Servicios" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#contacto", label: "Contacto" },
  ];
  return (
    <header className="w-full border-b border-hairline bg-background">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand font-display text-lg font-bold text-primary-foreground">
            Q
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight">
            Quimora Tech
          </span>
        </a>
        <nav className="hidden items-center gap-10 text-sm text-foreground md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors duration-200 hover:text-brand"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md text-foreground md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-hairline bg-background md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[15px] text-foreground transition-colors hover:text-brand"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      )}
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
            Desarrollamos sitios web ultra-rápidos, optimizados para móviles y
            diseñados para hacer crecer tu negocio en internet sin dolores de
            cabeza técnicos.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contacto"
              className="inline-flex h-14 items-center justify-center rounded-md bg-accent-orange px-8 font-display text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-accent-orange-dark"
            >
              Quiero Mi Web que Convierte
            </a>
            <a
              href="#proceso"
              className="inline-flex h-14 items-center justify-center rounded-md border-2 border-brand bg-transparent px-8 font-display text-[15px] font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft"
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
    <div className="pointer-events-none hidden md:block" aria-hidden="true">
      <svg viewBox="0 0 400 320" className="h-auto w-full" fill="none">
        {/* Laptop frame */}
        <rect
          x="40"
          y="40"
          width="320"
          height="200"
          rx="10"
          stroke="#4366F5"
          strokeWidth="2"
          fill="#ffffff"
        />
        <rect x="40" y="240" width="320" height="10" rx="3" fill="#F5F5F5" />
        {/* Screen content — ascending line chart */}
        <line x1="60" y1="200" x2="340" y2="200" stroke="#F5F5F5" strokeWidth="1" />
        <line x1="60" y1="60" x2="60" y2="200" stroke="#F5F5F5" strokeWidth="1" />
        <polyline
          points="70,180 130,150 190,160 240,110 300,90 330,70"
          stroke="#4366F5"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data points */}
        <circle cx="240" cy="110" r="4" fill="#4366F5" />
        <circle cx="330" cy="70" r="5" fill="#FF6B35" />
        {/* Small bars */}
        <rect x="70" y="205" width="12" height="20" rx="2" fill="#EEF1FF" />
        <rect x="90" y="195" width="12" height="30" rx="2" fill="#EEF1FF" />
        <rect x="110" y="185" width="12" height="40" rx="2" fill="#4366F5" opacity="0.35" />
      </svg>
    </div>
  );
}

/* -------------------- Benefits -------------------- */
const BENEFITS = [
  {
    icon: Smartphone,
    iconColor: "brand",
    title: "Diseño Mobile-First que Convierte",
    body:
      "Más del 62% del tráfico web viene de móviles. Tu página se ve perfecta en celulares y guía sin distracciones hacia la compra o el contacto.",
    metric: "62% de usuarios",
  },
  {
    icon: Zap,
    iconColor: "orange",
    title: "Velocidad de Carga Ultra-Rápida",
    body:
      "Los usuarios abandonan páginas que tardan más de 3 segundos. Entregamos sitios optimizados que retienen clientes y mejoran tu posicionamiento en Google.",
    metric: "-3s en carga",
  },
  {
    icon: BarChart3,
    iconColor: "brand",
    title: "Gestión Sencilla y Analítica Integrada",
    body:
      "Olvídate de la complejidad técnica. Conectamos tu web con Google Analytics para que veas resultados reales y te enfoques en tu negocio.",
    metric: "100% Medible",
  },
] as const;

function Benefits() {
  return (
    <section id="servicios" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-[40px]">
            ¿Por Qué Elegir Quimora Tech?
          </h2>
          <p className="mt-4 text-base text-foreground md:text-[17px]">
            Cada decisión está hecha para hacerte crecer.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, iconColor, title, body, metric }) => (
            <article
              key={title}
              className="flex flex-col rounded-xl border border-hairline bg-background p-8 transition-colors duration-200 hover:border-brand/40"
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-lg ${
                  iconColor === "orange" ? "bg-[#FFF1EA] text-accent-orange" : "bg-brand-soft text-brand"
                }`}
              >
                <Icon size={24} strokeWidth={1.9} />
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-foreground md:text-[22px]">
                {title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-foreground/80">
                {body}
              </p>
              <span className="mt-6 text-sm font-medium text-muted-foreground">
                {metric}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Timeline (signature) -------------------- */
const STEPS = [
  {
    week: "SEMANA 1–2",
    icon: MessageCircle,
    orange: false,
    title: "Diagnóstico",
    body: "Escuchamos tus metas, analizamos tu competencia y definimos la estrategia.",
  },
  {
    week: "SEMANA 3–6",
    icon: Code2,
    orange: false,
    title: "Desarrollo",
    body: "Diseñamos y desarrollamos tu web con las últimas tecnologías, optimizada desde el inicio.",
  },
  {
    week: "SEMANA 7",
    icon: Rocket,
    orange: true,
    title: "Lanzamiento",
    body: "Tu web sale a producción. Tus clientes ya la ven, comienzan a contactarte.",
  },
  {
    week: "SEMANA 8+",
    icon: TrendingUp,
    orange: false,
    title: "Crecimiento Continuo",
    body: "Medimos, optimizamos y escalamos. Cada semana, mejor.",
  },
] as const;

function Timeline() {
  return (
    <section id="nosotros" className="border-t border-hairline bg-hairline/60">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent-orange">
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
            {STEPS.map(({ week, icon: Icon, orange, title, body }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div
                  className={`relative z-10 grid h-16 w-16 place-items-center rounded-full border-2 ${
                    orange
                      ? "border-accent-orange bg-white text-accent-orange"
                      : "border-brand bg-white text-brand"
                  }`}
                >
                  <Icon size={26} strokeWidth={1.9} />
                </div>
                <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {week}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                  {title}
                </h3>
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
          {STEPS.map(({ week, icon: Icon, orange, title, body }) => (
            <li key={title} className="relative flex gap-5">
              <div
                className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 bg-white ${
                  orange ? "border-accent-orange text-accent-orange" : "border-brand text-brand"
                }`}
              >
                <Icon size={22} strokeWidth={1.9} />
              </div>
              <div className="min-w-0 pt-1">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                  {week}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-[15px] leading-[1.6] text-foreground/75">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------- Testimonials -------------------- */
const TESTIMONIALS = [
  {
    initial: "M",
    role: "Dueña de E-commerce de Moda",
    location: "Cali, Colombia",
    quote:
      "Desde que lanzamos con Quimora Tech, nuestras ventas online crecieron 250%. No fue un gasto, fue una inversión.",
  },
  {
    initial: "J",
    role: "Gerente de Clínica Odontológica",
    location: "Medellín, Colombia",
    quote:
      "La página nueva nos trae citas todas las semanas. El proceso fue clarísimo y en menos de un mes ya estábamos en línea.",
  },
  {
    initial: "A",
    role: "Fundador de Estudio de Arquitectura",
    location: "Bogotá, Colombia",
    quote:
      "Duplicamos las reuniones agendadas en el primer mes. La analítica integrada nos ayudó a tomar mejores decisiones.",
  },
];

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIdx((i) => (i + 1) % TESTIMONIALS.length);
  const t = TESTIMONIALS[idx];

  return (
    <section className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1000px] px-6 py-24 md:px-10 md:py-28">
        <h2 className="text-center font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-[40px]">
          Lo Que Dicen Nuestros Clientes
        </h2>

        <div className="mt-12 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 md:gap-6">
          <button
            onClick={prev}
            aria-label="Anterior testimonio"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-hairline text-brand transition-colors hover:border-brand hover:bg-brand-soft"
          >
            <ChevronLeft size={20} />
          </button>

          <article
            key={idx}
            className="min-w-0 rounded-xl border border-hairline bg-background p-8 transition-opacity duration-300 md:p-10"
          >
            <p className="text-lg italic leading-[1.6] text-foreground md:text-xl">
              “{t.quote}”
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-soft font-display text-xl font-semibold text-brand">
                {t.initial}
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-[15px] font-semibold text-foreground">
                  {t.role}
                </p>
                <p className="truncate text-sm text-foreground/70">{t.location}</p>
                <div className="mt-1 flex gap-0.5 text-accent-orange">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
              </div>
            </div>
          </article>

          <button
            onClick={next}
            aria-label="Siguiente testimonio"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-hairline text-brand transition-colors hover:border-brand hover:bg-brand-soft"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Ir al testimonio ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === idx ? "w-8 bg-brand" : "w-2 bg-hairline hover:bg-brand/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- FAQ -------------------- */
const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en estar lista mi web?",
    a: "Típicamente entre 4 y 8 semanas dependiendo de la complejidad. La mayoría de negocios ven avances significativos en las primeras 4 semanas.",
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
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-t border-hairline bg-background">
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
                  className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-brand"
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
                    <p className="pb-6 pr-12 text-[15px] leading-[1.6] text-foreground/75">
                      {f.a}
                    </p>
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

/* -------------------- Final CTA -------------------- */
function FinalCTA() {
  return (
    <section id="contacto" className="border-t border-hairline bg-hairline/60">
      <div className="mx-auto max-w-[820px] px-6 py-24 text-center md:py-28">
        <h2 className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-brand md:text-[44px]">
          No Dejes que tu Competencia te Pase Adelante
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-foreground/80 md:text-lg">
          Cada día que esperas es dinero que pierdes. Hablemos hoy.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#"
            className="inline-flex h-14 w-full items-center justify-center rounded-md bg-accent-orange px-8 font-display text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-accent-orange-dark sm:w-auto"
          >
            Solicitar Consulta Gratis
          </a>
          <a
            href="#"
            className="inline-flex h-14 w-full items-center justify-center rounded-md border-2 border-brand bg-transparent px-8 font-display text-[15px] font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft sm:w-auto"
          >
            Ver Portafolio de Proyectos
          </a>
        </div>
        <p className="mt-8 text-[15px] text-foreground/80">
          O llámanos:{" "}
          <a
            href="tel:+573124567890"
            className="font-display font-semibold text-foreground hover:text-brand"
          >
            +57 312 456 7890
          </a>
        </p>
        <p className="mt-3 text-xs text-foreground/60">
          Sin compromiso · Respuesta en menos de 24 horas
        </p>
      </div>
    </section>
  );
}

/* -------------------- Footer -------------------- */
function Footer() {
  return (
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-12 md:grid-cols-3 md:items-center md:px-10">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-brand font-display text-sm font-bold text-primary-foreground">
            Q
          </span>
          <span className="font-display text-sm font-semibold">Quimora Tech</span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/75 md:justify-center">
          <a href="#top" className="hover:text-brand">Inicio</a>
          <a href="#servicios" className="hover:text-brand">Servicios</a>
          <a href="#nosotros" className="hover:text-brand">Nosotros</a>
          <a href="#contacto" className="hover:text-brand">Contacto</a>
          <a href="#" className="hover:text-brand">Privacidad</a>
        </nav>
        <div className="flex gap-3 md:justify-end">
          {[Linkedin, Instagram, Facebook].map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label="Red social"
              className="grid h-10 w-10 place-items-center rounded-full border border-hairline text-brand transition-colors hover:border-brand hover:bg-brand-soft"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto max-w-[1200px] px-6 py-5 text-center text-xs text-foreground/60 md:px-10">
          © 2024 Quimora Tech. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
