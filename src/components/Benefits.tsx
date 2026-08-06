import { Smartphone, Zap, Search, BarChart3, Award } from "lucide-react";
import { Reveal } from "./Reveal";
import { useTilt } from "../lib/hooks";

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

export function Benefits() {
  return (
    <section id="servicios" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Award size={14} />
            Por qué Quimora Tech
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display">
            Cada decisión está hecha para hacerte crecer
          </h2>
          <p className="mt-4 text-base text-foreground/80 md:text-body">
            No vendemos plantillas genéricas. Diseñamos y desarrollamos cada sitio pensando en un
            solo objetivo: convertir visitantes en clientes reales.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, i) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, index }: { benefit: (typeof BENEFITS)[number]; index: number }) {
  const { icon: Icon, iconColor, title, body, metric } = benefit;
  const tiltRef = useTilt<HTMLDivElement>({ max: 3.5 });

  return (
    <Reveal index={index} className="h-full">
      <article
        ref={tiltRef}
        className="tilt-card flex h-full flex-col rounded-xl border border-hairline bg-background p-8 hover:border-brand/40 hover:shadow-xl"
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
        <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-foreground md:text-subhead">
          {title}
        </h3>
        <p className="mt-3 text-ui leading-[1.6] text-foreground/80">{body}</p>
        <span className="mt-6 text-sm font-medium text-muted-foreground">{metric}</span>
      </article>
    </Reveal>
  );
}
