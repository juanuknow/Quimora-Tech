import { ArrowLeft, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { TopBar } from "./TopBar";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { getVerticalBySlug } from "../lib/verticals-data";
import { FOCUS_RING, whatsappHref, trackEvent } from "../lib/site";

/**
 * Layout de una página de industria (`/para/[slug]`) — mismo chrome que
 * `ServiceDetail` (es una página de venta, no legal), pero con una sección
 * de dolores propia: el gancho aquí es "esto te está pasando a ti", no una
 * lista de funcionalidades.
 */
export function VerticalDetail({ slug }: { slug: string }) {
  const vertical = getVerticalBySlug(slug);
  const { icon: Icon, title, intro, painPoints, benefits, name } = vertical;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <TopBar />
      <Nav />
      <main>
        <section className="border-b border-hairline bg-background">
          <div className="mx-auto max-w-[820px] px-6 py-20 md:py-24">
            <nav
              aria-label="Ruta de navegación"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <a href="/" className={`rounded-sm hover:text-brand ${FOCUS_RING}`}>
                Inicio
              </a>
              <span aria-hidden="true">/</span>
              <span className="text-foreground">{title}</span>
            </nav>

            <div className="mt-8 grid h-14 w-14 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon size={26} strokeWidth={1.8} />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold leading-[1.15] tracking-tight text-brand md:text-display">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-[1.7] text-foreground/80 md:text-body">
              {intro}
            </p>

            {/* Pain points */}
            <div className="mt-10 rounded-2xl border border-hairline bg-background p-6 md:p-8">
              <p className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Lo que probablemente te está pasando
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {painPoints.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-ui text-foreground/85">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-accent-strong"
                      strokeWidth={1.8}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <p className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Lo que incluye tu proyecto
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {benefits.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-ui text-foreground/85">
                    <Check size={18} className="mt-0.5 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-2xl border border-hairline bg-brand-soft/40 p-8 text-center md:p-10">
              <h2 className="font-display text-xl font-semibold text-brand md:text-subhead">
                ¿Hablamos de tu proyecto?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-[1.7] text-foreground/75">
                Te contamos qué se puede construir para {name}, en cuánto tiempo y con qué inversión
                — sin compromiso.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappHref(`Hola, quiero más información sobre una web para ${name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("contact", { method: "whatsapp", location: `vertical-${slug}` })
                  }
                  className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-cta px-6 font-display text-sm font-semibold text-white transition duration-200 hover:bg-cta-hover sm:w-auto active:scale-[0.98] ${FOCUS_RING}`}
                >
                  Escribir por WhatsApp
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/#contacto"
                  className={`inline-flex h-12 w-full items-center justify-center rounded-md border-2 border-brand px-6 font-display text-sm font-semibold text-brand transition duration-200 hover:bg-brand-soft sm:w-auto active:scale-[0.98] ${FOCUS_RING}`}
                >
                  Solicitar cotización
                </a>
              </div>
            </div>

            <a
              href="/#diagnostico"
              className={`mt-8 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
            >
              <ArrowLeft size={16} />
              Descubre qué solución necesita tu negocio
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
