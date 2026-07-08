import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Smartphone,
  Zap,
  BarChart3,
  MessageCircle,
  PenTool,
  Rocket,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Star,
  ShieldCheck,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <SocialProof />
      <Benefits />
      <Process />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1120px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-primary-foreground font-semibold">
            Q
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Quimora Tech</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#top" className="transition-colors hover:text-brand">Inicio</a>
          <a href="#beneficios" className="transition-colors hover:text-brand">Servicios</a>
          <a href="#proceso" className="transition-colors hover:text-brand">Nosotros</a>
        </nav>
        <a
          href="#cta-final"
          className="text-sm text-muted-foreground transition-colors hover:text-brand"
        >
          Contacto
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-6 pt-16 pb-24 md:grid-cols-[1.3fr_1fr] md:px-10 md:pt-24 md:pb-32">
        <div className="relative z-10">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-brand md:text-[56px]">
            Páginas Web que Convierten tus Visitantes en Clientes Reales
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Desarrollamos sitios web ultra-rápidos, optimizados para móviles y diseñados a medida
            para hacer crecer tu negocio en internet sin dolores de cabeza técnicos.
          </p>
          <div className="mt-10">
            <a
              href="#cta-final"
              className="inline-flex h-14 items-center justify-center rounded-md bg-brand px-8 text-[15px] font-semibold text-primary-foreground shadow-[0_4px_14px_-2px_color-mix(in_oklab,var(--brand)_45%,transparent)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_10px_24px_-4px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
            >
              Quiero Mi Web que Convierte
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
    <div className="pointer-events-none relative hidden opacity-70 md:block" aria-hidden="true">
      <svg viewBox="0 0 320 400" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <circle cx="220" cy="120" r="90" stroke="var(--brand)" strokeOpacity="0.35" />
        <circle cx="220" cy="120" r="140" stroke="var(--brand)" strokeOpacity="0.18" />
        <rect x="40" y="180" width="200" height="130" rx="12" fill="url(#g1)" stroke="var(--brand)" strokeOpacity="0.4" />
        <line x1="60" y1="215" x2="180" y2="215" stroke="var(--brand)" strokeOpacity="0.5" strokeWidth="3" />
        <line x1="60" y1="235" x2="140" y2="235" stroke="var(--brand)" strokeOpacity="0.35" strokeWidth="3" />
        <rect x="60" y="260" width="80" height="28" rx="6" fill="var(--brand)" fillOpacity="0.6" />
        <path d="M20 360 L120 300 L180 340 L300 260" stroke="var(--brand)" strokeWidth="2" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}

const LOGOS = ["Nova", "Fluent", "Kairos", "Meridian", "Halo", "Arco"];

function SocialProof() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-[1120px] px-6 py-14 md:px-10">
        <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
          Empresas que ya crecen con Quimora Tech
        </p>
        <div className="mt-8 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 md:flex md:flex-wrap md:justify-between md:gap-10">
          {LOGOS.map((name) => (
            <span
              key={name}
              className="cursor-pointer text-xl font-semibold tracking-tight text-muted-foreground/60 opacity-70 transition-all duration-200 hover:scale-105 hover:text-brand hover:opacity-100"
            >
              {name}
            </span>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground/70">+50 Negocios Crecieron</p>
      </div>
    </section>
  );
}

const BENEFITS = [
  {
    icon: Smartphone,
    title: "Diseño Mobile-First que Convierte",
    body:
      "Más del 62% del tráfico web viene de móviles. Tu página se ve perfecta en celulares y guía sin distracciones hacia la compra o el contacto.",
    metric: "62% de usuarios",
  },
  {
    icon: Zap,
    title: "Velocidad de Carga Ultra-Rápida",
    body:
      "Los usuarios abandonan páginas que tardan más de 3 segundos. Entregamos sitios optimizados que retienen clientes y mejoran tu posicionamiento en Google.",
    metric: "-3s en carga",
  },
  {
    icon: BarChart3,
    title: "Gestión Sencilla y Analítica Integrada",
    body:
      "Olvídate de la complejidad técnica. Conectamos tu web con herramientas como Google Analytics para que veas resultados reales y te enfoques en tu negocio.",
    metric: "100% Medible",
  },
];

function Benefits() {
  return (
    <section id="beneficios" className="border-t border-hairline">
      <div className="mx-auto max-w-[1120px] px-6 py-20 md:px-10 md:py-28">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-brand md:text-[40px]">
            ¿Por Qué Elegir Quimora Tech?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Cada elemento está diseñado para hacerte crecer.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, body, metric }) => (
            <article
              key={title}
              className="group flex flex-col rounded-xl border border-hairline bg-card p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.14)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-soft text-brand">
                <Icon size={28} strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-snug">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-6 inline-flex w-fit items-center rounded-md bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
                {metric}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: MessageCircle, title: "Consulta Inicial", body: "Escuchamos tus metas" },
  { icon: PenTool, title: "Diseño Personalizado", body: "Diseñamos tu web a medida" },
  { icon: Rocket, title: "Lanzamiento Rápido", body: "Tu web lista en semanas" },
  { icon: TrendingUp, title: "Crecimiento Continuo", body: "Medimos y optimizamos juntos" },
];

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = 1 - (rect.bottom - vh * 0.4) / (rect.height + vh * 0.4);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="proceso" ref={ref} className="border-t border-hairline bg-brand-soft/40">
      <div className="mx-auto max-w-[1120px] px-6 py-20 md:px-10 md:py-28">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand md:text-[40px]">
          Crecer es Simple
        </h2>

        <div className="relative mt-16 hidden md:block">
          <div className="absolute left-[8%] right-[8%] top-6 h-px bg-hairline" />
          <div className="grid grid-cols-4 gap-6">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-hairline bg-background text-brand shadow-sm">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-brand">
                  Paso {i + 1}
                </p>
                <h3 className="mt-2 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
          <div className="mx-[8%] mt-10 h-1 overflow-hidden rounded-full bg-hairline">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <ol className="mt-12 space-y-6 md:hidden">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-background text-brand shadow-sm ring-1 ring-hairline">
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                  Paso {i + 1}
                </p>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-xs text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    name: "Juan Carlos Pérez",
    role: "CEO, Tienda XYZ",
    location: "Cali, Colombia",
    metric: "+250% en ventas online",
    quote:
      "Desde que lanzamos con Quimora Tech, nuestras ventas explotaron. No fue un gasto, fue una inversión.",
  },
  {
    name: "María Fernanda López",
    role: "Fundadora, Estudio Halo",
    location: "Medellín, Colombia",
    metric: "+180% de leads mensuales",
    quote:
      "El sitio es rápido, elegante y trae clientes reales cada semana. El proceso fue clarísimo.",
  },
  {
    name: "Andrés Villegas",
    role: "Gerente, Nova Consultores",
    location: "Bogotá, Colombia",
    metric: "3× conversión de formularios",
    quote:
      "Duplicamos las reuniones agendadas en el primer mes. La analítica integrada nos cambió la vida.",
  },
  {
    name: "Laura Restrepo",
    role: "Directora, Meridian Salud",
    location: "Barranquilla, Colombia",
    metric: "+320% tráfico orgánico",
    quote:
      "Nos dieron algo mucho más que una página: una máquina de crecimiento continuo.",
  },
];

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIdx((i) => (i + 1) % TESTIMONIALS.length);
  const t = TESTIMONIALS[idx];

  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-[1120px] px-6 py-20 md:px-10 md:py-28">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand md:text-[40px]">
          Lo Que Dicen Nuestros Clientes
        </h2>

        <div className="mt-12 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 md:gap-6">
          <button
            onClick={prev}
            aria-label="Anterior"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-hairline text-brand transition-all hover:scale-110 hover:border-brand hover:text-brand-dark"
          >
            <ChevronLeft size={20} />
          </button>

          <article className="min-w-0 rounded-2xl border border-hairline bg-card p-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)] md:p-10">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-soft text-xl font-semibold text-brand ring-2 ring-brand/30">
                {t.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{t.name}</p>
                <p className="truncate text-sm text-muted-foreground">{t.role}</p>
                <p className="truncate text-xs text-muted-foreground/70">{t.location}</p>
              </div>
            </div>
            <p className="mt-6 text-xl font-semibold text-brand md:text-2xl">{t.metric}</p>
            <div className="mt-3 flex gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-5 text-[15px] italic leading-relaxed text-muted-foreground">
              “{t.quote}”
            </p>
          </article>

          <button
            onClick={next}
            aria-label="Siguiente"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-hairline text-brand transition-all hover:scale-110 hover:border-brand hover:text-brand-dark"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Ver testimonio ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-6 bg-brand" : "w-2 bg-hairline hover:bg-brand/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en estar lista mi web?",
    a: "Típicamente entre 4 y 8 semanas dependiendo de la complejidad. La mayoría de negocios ven avances significativos en las primeras 4 semanas.",
  },
  {
    q: "¿Puedo editar la web después?",
    a: "Sí. Entregamos un panel sencillo para que actualices textos, imágenes y secciones sin necesidad de conocimientos técnicos.",
  },
  {
    q: "¿Incluye posicionamiento en Google (SEO)?",
    a: "Cada sitio se entrega con SEO técnico configurado: velocidad, meta tags, estructura semántica y sitemap. También ofrecemos planes de SEO continuo.",
  },
  {
    q: "¿Qué pasa si necesito cambios?",
    a: "Incluimos rondas de ajustes durante el desarrollo y planes de soporte mensual para evolucionar tu web a medida que crece tu negocio.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-[720px] px-6 py-20 md:py-28">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand md:text-[40px]">
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
                  <span className="text-[15px] font-semibold md:text-base">{f.q}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="pb-6 pr-12 text-sm leading-relaxed text-muted-foreground">
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

function FinalCTA() {
  return (
    <section id="cta-final" className="border-t-2 border-brand/20 bg-brand-soft/60">
      <div className="mx-auto max-w-[820px] px-6 py-24 text-center md:py-32">
        <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-brand md:text-5xl">
          No Dejes que tu Competencia te Pase Adelante
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          Cada día que esperas es dinero que pierdes. Hablemos hoy.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="inline-flex h-14 w-full items-center justify-center rounded-md bg-brand px-8 text-[15px] font-semibold text-primary-foreground shadow-[0_6px_20px_-4px_color-mix(in_oklab,var(--brand)_55%,transparent)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark sm:w-auto"
          >
            Solicitar Consulta Gratis
          </a>
          <a
            href="#"
            className="inline-flex h-14 w-full items-center justify-center rounded-md border-2 border-brand bg-transparent px-8 text-[15px] font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft sm:w-auto"
          >
            Ver Portafolio de Proyectos
          </a>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          O llámanos: <span className="font-semibold text-foreground">+57 312 456 7890</span>
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground/80">
          <ShieldCheck size={14} className="text-brand" />
          Sin compromiso · Respuesta en menos de 24 horas
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline bg-[color:var(--brand-soft)]/30">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-6 py-12 md:grid-cols-3 md:px-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-primary-foreground font-semibold">
              Q
            </span>
            <span className="text-sm font-semibold">Quimora Tech</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            © 2026 Quimora Tech. Todos los derechos reservados.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm text-muted-foreground md:items-center">
          <a href="#top" className="transition-colors hover:text-brand">Inicio</a>
          <a href="#beneficios" className="transition-colors hover:text-brand">Servicios</a>
          <a href="#proceso" className="transition-colors hover:text-brand">Nosotros</a>
          <a href="#cta-final" className="transition-colors hover:text-brand">Contacto</a>
          <a href="#" className="transition-colors hover:text-brand">Política de Privacidad</a>
        </nav>
        <div className="flex gap-4 md:justify-end">
          {[Linkedin, Instagram, Facebook].map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label="Red social"
              className="grid h-10 w-10 place-items-center rounded-full text-brand transition-all hover:scale-110 hover:bg-brand-soft hover:text-brand-dark"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
