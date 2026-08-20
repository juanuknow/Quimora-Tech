import { Phone, Mail, ArrowUp } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { verticals } from "../lib/verticals-data";
import {
  LIGHT_RING,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  WHATSAPP_NUMBER_2,
  CONTACT_PHONE_2,
  CONTACT_PHONE_2_DISPLAY,
  whatsappHref,
} from "../lib/site";

/* -------------------- Footer -------------------- */
const FOOTER_NAV = [
  {
    title: "Navegación",
    links: [
      { href: "/#top", label: "Inicio" },
      { href: "/#servicios", label: "Servicios" },
      { href: "/#soluciones", label: "Soluciones de Software" },
      { href: "/#nosotros", label: "Cómo Trabajamos" },
      { href: "/#precios", label: "Precios" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/#showcase", label: "Casos de Éxito" },
      { href: "/#faq", label: "Preguntas Frecuentes" },
      { href: "/#contacto", label: "Contacto" },
    ],
  },
] as const;

/** Enlaces a las páginas de industria (`/para/[slug]`) — refuerza el SEO
 *  interno y evita que queden huérfanas fuera del sitemap. */
const INDUSTRY_LINKS = verticals.map((v) => ({
  href: `/para/${v.slug}`,
  label: v.name.charAt(0).toUpperCase() + v.name.slice(1),
}));

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
        {/* 5 columnas necesitan más ancho del que hay en el arranque de "md"
            (768px) sin que el correo de contacto se desborde — grid-cols-2
            de paso en md, y la disposición final solo desde "lg" (1024px). */}
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.85fr_0.85fr_0.85fr_1fr] lg:gap-x-12">
          {/* Brand column */}
          <div>
            <a href="/#top" className={`inline-flex items-center gap-2.5 rounded-md ${LIGHT_RING}`}>
              <span className="grid h-9 w-9 place-items-center rounded-md bg-white p-1">
                <img src="/images/logo-mark.png" alt="" className="h-full w-full object-contain" />
              </span>
              <span className="font-display text-body font-semibold tracking-tight">
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
              className={`tilt-card mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-sm font-semibold text-brand-dark transition-colors hover:bg-white/90 ${LIGHT_RING}`}
            >
              <WhatsAppIcon size={16} />
              Escribir por WhatsApp
            </a>
          </div>

          {/* Nav columns */}
          {FOOTER_NAV.map((col) => (
            <nav key={col.title}>
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-white/55">
                {col.title}
              </h3>
              <ul className="mt-3 flex flex-col text-sm text-white/65">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className={`flex min-h-11 items-center rounded-sm transition hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Industry column */}
          <nav>
            <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-white/55">
              Soluciones por industria
            </h3>
            <ul className="mt-3 flex flex-col text-sm text-white/65">
              {INDUSTRY_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`flex min-h-11 items-center rounded-sm transition hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact column */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-white/55">
              Contacto
            </h3>
            <ul className="mt-3 flex flex-col gap-1 text-sm text-white/65">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className={`inline-flex min-h-11 items-center gap-3 rounded-sm transition hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5">
                    <Phone size={15} />
                  </span>
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref("Hola, quiero más información", WHATSAPP_NUMBER_2)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-11 items-center gap-3 rounded-sm transition hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5">
                    <WhatsAppIcon size={15} />
                  </span>
                  {CONTACT_PHONE_2_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_2}`}
                  className={`inline-flex min-h-11 items-center gap-3 rounded-sm transition hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5">
                    <Phone size={15} />
                  </span>
                  {CONTACT_PHONE_2_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={`inline-flex min-h-11 items-center gap-3 rounded-sm transition hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
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
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-1 px-6 py-3 text-xs text-white/60 md:flex-row md:px-10">
          <p>© 2026 Quimora Tech. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a
              href="/privacidad"
              className={`flex min-h-11 items-center rounded-sm transition hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
            >
              Privacidad
            </a>
            <a
              href="/terminos"
              className={`flex min-h-11 items-center rounded-sm transition hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
            >
              Términos
            </a>
            <a
              href="/#top"
              aria-label="Volver arriba"
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-sm transition hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
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
