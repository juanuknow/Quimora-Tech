import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { GA_MEASUREMENT_ID, FOCUS_RING } from "../lib/site";

/** Botón primario de las páginas de sistema (404 / error), con el mismo
 *  lenguaje visual que los CTA de la landing: alto táctil y foco visible. */
const SYSTEM_BUTTON = `inline-flex h-11 items-center justify-center rounded-md bg-cta px-5 font-display text-sm font-semibold text-white transition duration-200 hover:bg-cta-hover active:scale-[0.98] ${FOCUS_RING}`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-brand">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          No encontramos esta página
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o fue movida a otra dirección.
        </p>
        <div className="mt-6">
          <Link to="/" className={SYSTEM_BUTTON}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Esta página no cargó
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo falló de nuestro lado. Puedes intentarlo de nuevo o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className={SYSTEM_BUTTON}
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className={`inline-flex h-11 items-center justify-center rounded-md border-2 border-brand bg-background px-5 font-display text-sm font-semibold text-brand transition duration-200 hover:bg-brand-soft active:scale-[0.98] ${FOCUS_RING}`}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Quimora Tech · Páginas Web que Convierten Visitantes en Clientes" },
      {
        name: "description",
        content:
          "Desarrollamos sitios web ultra-rápidos, optimizados para móviles y diseñados a medida para hacer crecer tu negocio sin dolores de cabeza técnicos.",
      },
      { name: "author", content: "Quimora Tech" },
      { property: "og:title", content: "Quimora Tech · Páginas Web que Convierten" },
      {
        property: "og:description",
        content:
          "Sitios web ultra-rápidos, mobile-first y diseñados para convertir visitantes en clientes reales.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_CO" },
      { property: "og:site_name", content: "Quimora Tech" },
      { property: "og:image", content: "https://quimoratech.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Quimora Tech — Páginas web que convierten visitantes en clientes reales",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://quimoratech.com/og-image.png" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      // Self-hosted fonts (see @font-face in styles.css); preloaded to avoid FOUT.
      {
        rel: "preload",
        href: "/fonts/inter-variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/space-grotesk-variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Quimora Tech",
  description:
    "Agencia de diseño y desarrollo web. Creamos sitios ultra-rápidos, mobile-first y optimizados para convertir visitantes en clientes.",
  url: "https://quimoratech.com",
  image: "https://quimoratech.com/og-image.png",
  telephone: "+573244577198",
  email: "devopsconsultoring@gmail.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cali",
    addressRegion: "Valle del Cauca",
    addressCountry: "CO",
  },
  areaServed: [
    { "@type": "City", name: "Cali" },
    { "@type": "State", name: "Valle del Cauca" },
    { "@type": "Country", name: "Colombia" },
  ],
  serviceType: ["Diseño web", "Desarrollo web", "Optimización de conversión", "SEO"],
};

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        {/* Google Analytics 4 — solo se carga cuando GA_MEASUREMENT_ID está definido. */}
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
