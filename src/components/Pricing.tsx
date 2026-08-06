import { Check, Gift } from "lucide-react";
import { Reveal } from "./Reveal";
import { useTilt } from "../lib/hooks";
import { FOCUS_RING } from "../lib/site";

/* -------------------- Pricing -------------------- */
const PLANS = [
  {
    name: "Emprendedor",
    price: "Desde $450.000",
    period: "pago único",
    promo: "Hosting 3 meses + dominio incluidos",
    description:
      "El punto de partida: tu negocio en línea con su catálogo y un canal directo para recibir pedidos.",
    features: [
      "Desarrollo de tu sitio web",
      "Catálogo de productos o servicios",
      "Información de tu negocio",
      "Enlace directo a WhatsApp",
      "Entrega en 2-3 semanas",
    ],
    featured: false,
  },
  {
    name: "Presencia",
    price: "Desde $650.000",
    period: "pago único",
    promo: "Hosting 3 meses + dominio incluidos",
    description:
      "Ideal para negocios que necesitan una presencia digital profesional para atraer clientes y generar contactos.",
    features: [
      "Landing page a medida",
      "Diseño responsive (Mobile-first)",
      "Formulario de contacto",
      "vinculación con redes sociales",
      "Optimización básica de SEO",
      "Conexión con Google Analytics",
      "Catalogo de productos o servicios",
      "Galería de imágenes o portafolio",
      "Integración con Google Maps",
    ],
    featured: false,
  },
  {
    name: "Crecimiento",
    price: "Desde $950.000",
    period: "pago único",
    promo: "Hosting 3 meses + dominio incluidos",
    description:
      "Todo lo del plan Presencia, potenciado: más secciones, más control y más datos para vender más.",
    features: [
      "Todo lo incluido en Presencia",
      "Sitio multi-sección (institucional completo)",
      "Panel de edición simple para tus textos e imágenes",
      "Blog o sección de novedades",
      "Google Analytics + Search Console",
      "SEO avanzado en todas las páginas",
      "Botón flotante de WhatsApp",
      "Certificado SSL y seguridad reforzada",
      "1 mes de soporte post-lanzamiento incluido",
      "Entrega en 2-4 semanas",
    ],
    featured: true,
  },
  {
    name: "A Medida",
    price: "Cotización personalizada",
    period: "según alcance",
    promo: null,
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

export function Pricing() {
  return (
    <section id="precios" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display">
            Una inversión que se paga sola
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-foreground/80 md:text-body">
            No es un gasto: una web bien hecha recupera su valor con los primeros clientes que te
            trae. Sin costos ocultos y con precios claros desde el inicio.
          </p>
        </div>
        {/* 4 planes: 1 col → 2 (sm) → 4 (lg), igual que las grillas de Problema
            y Beneficios. */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            className={`inline-flex h-12 shrink-0 items-center justify-center rounded-md border-2 border-brand px-6 font-display text-sm font-semibold text-brand transition duration-200 hover:bg-brand-soft active:scale-[0.98] ${FOCUS_RING}`}
          >
            Cotizar mantenimiento
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
  const tiltRef = useTilt<HTMLDivElement>({ max: 3 });

  return (
    <Reveal index={index} className="relative h-full">
      {plan.featured && (
        // Halo detrás de la tarjeta. Al ser un hermano y no la sombra propia de
        // la tarjeta, late sin pisar el `hover:shadow-xl`.
        <span
          aria-hidden="true"
          className="animate-featured-halo pointer-events-none absolute -inset-1 rounded-2xl bg-brand/25 blur-lg"
        />
      )}
      <article
        ref={tiltRef}
        // La elevación usa `translate` (propiedad independiente en Tailwind v4),
        // no `transform`, que useTilt ya ocupa. Los tiempos los pone .tilt-card.
        className={`tilt-card relative flex h-full flex-col rounded-xl border p-6 hover:-translate-y-1.5 lg:p-7 ${
          plan.featured
            ? "border-brand bg-brand-soft hover:shadow-[0_18px_40px_rgba(24,24,27,0.22)]"
            : "border-hairline bg-background hover:border-brand/40 hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)]"
        }`}
      >
        {plan.featured && (
          <span className="tilt-layer mb-4 inline-flex w-fit items-center rounded-full bg-brand px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            Más elegido
          </span>
        )}
        <h3 className="font-display text-xl font-semibold text-foreground">{plan.name}</h3>
        {/* 22px en vez de 24: con 4 columnas, "Cotización personalizada" no
            desborda la caja en el breakpoint lg. */}
        <p className="mt-4 font-display text-subhead font-bold leading-tight text-brand">
          {plan.price}
        </p>
        <p className="text-sm text-foreground/70">{plan.period}</p>
        {plan.promo && (
          <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-md border border-dashed border-brand bg-brand-soft px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand">
            <Gift className="h-3.5 w-3.5" aria-hidden="true" />
            {plan.promo}
          </span>
        )}
        <p className="mt-4 text-ui leading-[1.6] text-foreground/80">{plan.description}</p>
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
          className={`mt-8 inline-flex h-12 items-center justify-center rounded-md font-display text-sm font-semibold transition duration-200 active:scale-[0.98] ${FOCUS_RING} ${
            plan.featured
              ? "bg-cta text-white hover:bg-cta-hover"
              : "border-2 border-brand text-brand hover:bg-brand-soft"
          }`}
        >
          Solicitar cotización
        </a>
      </article>
    </Reveal>
  );
}
