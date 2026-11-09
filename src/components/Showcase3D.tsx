import { useEffect, useRef, useState } from "react";
import { Sparkles, Check, ExternalLink, MessageCircle, ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useInView, useTilt } from "../lib/hooks";
import { FOCUS_RING, whatsappHref } from "../lib/site";
import { NewTabHint } from "./NewTabHint";
import { BrowserChrome } from "./BrowserChrome";
import { DesktopAppChrome } from "./DesktopAppChrome";
import { ShowcaseGallery, type GalleryView } from "./ShowcaseGallery";

/* ============================ Data ============================ */

interface ProjectFact {
  value: string;
  label: string;
}

interface FeaturedProject {
  name: string;
  category: string;
  domain: string;
  /** Live site URL. Only rendered as "Ver en vivo" if the site is deployed. */
  liveUrl?: string;
  /** Long, full-page screenshot that scrolls inside the device frame. */
  fullImage: string;
  /** Shown if `fullImage` is missing, so the frame never looks broken. */
  fallbackImage: string;
  description: string;
  /** Cifras verificables del proyecto (no métricas de resultados). */
  facts: ProjectFact[];
  /** Real capabilities of the site (no invented metrics). */
  highlights: string[];
  technologies: string[];
  kind?: "website" | "desktop";
}

// Proyecto real construido por Quimora Tech. Sin métricas de resultados
// inventadas: se muestra el sitio de verdad y lo que hace. Las cifras de
// `facts` son conteos reales del catálogo y de las funciones del sitio.
// liveUrl se activará cuando el sitio esté desplegado en un dominio estable.
const FEATURED: FeaturedProject = {
  name: "Diosa's Make up",
  category: "Tienda online · Cosméticos",
  domain: "diosascali.com",
  fullImage: "/images/diosas-full.webp",
  fallbackImage: "/images/diosas-cosmeticos.webp",
  description:
    "Tienda online de maquillaje y cuidado capilar: catálogo con menú por categorías y marcas, buscador, favoritos, carrito con pedido por WhatsApp, compra al por mayor y reseñas moderadas. La dueña administra precios, stock, fotos y reseñas desde su propio panel.",
  facts: [
    { value: "+850", label: "productos en el catálogo" },
    { value: "5", label: "grupos de categorías, con subcategorías y tipos" },
    { value: "2", label: "modos de compra: al detal y al por mayor" },
  ],
  highlights: [
    "Catálogo por categorías y marcas",
    "Buscador de productos",
    "Carrito de compras",
    "Pedido por WhatsApp",
    "Compra al por mayor",
    "Lista de favoritos",
    "Reseñas de clientas",
    "Panel de administración propio",
    "Mapa y horarios de la tienda",
    "Envíos a toda Colombia",
  ],
  technologies: ["React", "Vite", "Tailwind CSS", "Supabase", "Netlify"],
};

// La versión 0.5.6 está en pruebas en el local. Las capturas provienen de la
// versión 0.5.4 en modo demo; no muestran información de la operación real.
const ENTRE_HILOS: FeaturedProject = {
  name: "Entre Hilos",
  category: "Aplicación de escritorio · En pruebas en el local",
  domain: "Entre Hilos · Gestión del local",
  kind: "desktop",
  fullImage: "/images/entre-hilos-inicio.png",
  fallbackImage: "/images/entre-hilos-inicio.png",
  description:
    "Desarrollamos una aplicación Windows para organizar la recepción de prendas, los pedidos, el trabajo de taller, los abonos y la caja de un local. Funciona sin internet y genera comprobantes internos. La versión 0.5.6 ya está en pruebas con el personal del local; el despliegue definitivo está previsto después de esta etapa.",
  facts: [],
  highlights: [
    "Pedidos identificados por prenda",
    "Seguimiento del trabajo de taller",
    "Abonos y saldos por pedido",
    "Caja con cierre diario",
    "Historial de cambios",
    "Respaldos locales",
  ],
  technologies: ["Electron", "React", "TypeScript", "SQLite"],
};

const ENTRE_HILOS_VIEWS: readonly GalleryView[] = [
  {
    id: "inicio",
    label: "Inicio",
    title: "Las tareas del local, a la vista",
    caption: "Accesos directos para recibir prendas, buscar pedidos, revisar el taller y registrar abonos. Captura del modo demostración con datos ficticios.",
    image: "/images/entre-hilos-inicio.png",
    alt: "Inicio de Entre Hilos en modo demostración con accesos a recepción, pedidos y taller",
    device: "browser",
  },
  {
    id: "pedidos",
    label: "Pedidos",
    title: "Buscar un pedido sin recorrer papeles",
    caption: "Búsqueda por cliente, número o código, y filtros para entregas, atrasos, saldos y borradores.",
    image: "/images/entre-hilos-pedidos.png",
    alt: "Pantalla de pedidos con búsqueda por código y filtros de estado",
    device: "browser",
  },
  {
    id: "detalle",
    label: "Detalle",
    title: "Trabajo, entrega y dinero por separado",
    caption: "Cada pedido muestra el estado de sus prendas, los pagos y las acciones disponibles sin confundir una etapa con otra.",
    image: "/images/entre-hilos-detalle.png",
    alt: "Detalle de un pedido ficticio con acciones de pago, taller y entrega",
    device: "browser",
  },
  {
    id: "caja",
    label: "Caja",
    title: "El efectivo del día, explicado",
    caption: "La vista distingue efectivo inicial, cobros, egresos y el importe esperado en caja.",
    image: "/images/entre-hilos-caja.png",
    alt: "Caja de demostración con desglose de efectivo esperado",
    device: "browser",
  },
];

// Capturas reales del mismo proyecto (public/images/). Cada una explica una
// parte del sitio; solo se describen funciones que existen.
const GALLERY_VIEWS: readonly GalleryView[] = [
  {
    id: "inicio",
    label: "Inicio",
    title: "Una portada que invita a comprar",
    caption:
      "Barra de avisos, menú por categorías, buscador y un hero con los productos destacados de la tienda.",
    image: "/images/diosas-hero.webp",
    alt: "Portada de Diosa's Make up con menú de categorías, buscador y productos destacados",
    device: "browser",
  },
  {
    id: "menu",
    label: "Menú",
    title: "Menú por categorías, con filtro de marca",
    caption:
      "Cada grupo despliega sus subcategorías y tipos de producto, con un selector de marca para llegar rápido a lo que la clienta busca.",
    image: "/images/diosas-menu.webp",
    alt: "Menú desplegable de Cuidado Capilar con selector de marca y lista de subcategorías",
    device: "browser",
  },
  {
    id: "producto",
    label: "Producto",
    title: "Ficha de producto sin salir del catálogo",
    caption:
      "Foto grande, precio, descripción y sugerencias de productos relacionados, todo en una ventana que se abre sobre el catálogo.",
    image: "/images/diosas-producto.webp",
    alt: "Ficha de un polvo suelto con foto, precio, botón de agregar al carrito y productos relacionados",
    device: "browser",
  },
  {
    id: "carrito",
    label: "Carrito",
    title: "Carrito y pedido directo a WhatsApp",
    caption:
      "El pedido se arma en el carrito y se envía por WhatsApp. Incluye la opción de compra al por mayor, con sus mínimos validados.",
    image: "/images/diosas-carrito.webp",
    alt: "Carrito de compras con dos productos, opción de pedido al por mayor y botón para finalizar por WhatsApp",
    device: "browser",
  },
  {
    id: "ubicacion",
    label: "Ubicación",
    title: "Ubicación, horarios y contacto",
    caption:
      "Mapa de la tienda, dirección, horarios de atención y acceso directo a WhatsApp para que las clientas lleguen o escriban.",
    image: "/images/diosas-ubicacion.webp",
    alt: "Sección de ubicación de la tienda con mapa de Google, dirección, horarios y botón de WhatsApp",
    device: "browser",
  },
  {
    id: "movil",
    label: "Celular",
    title: "Pensada para el celular",
    caption:
      "El sitio se adapta a pantallas pequeñas: menú, catálogo, carrito y pedido funcionan igual desde el teléfono.",
    image: "/images/diosas-movil.webp",
    alt: "Vista de Diosa's Make up en un celular, con menú, hero y productos",
    device: "phone",
  },
];

const CASES = [
  { project: FEATURED, views: GALLERY_VIEWS, galleryHeading: "Recorre el sitio por dentro", galleryIntro: "Capturas reales de la tienda, de la portada al pedido por WhatsApp." },
  { project: ENTRE_HILOS, views: ENTRE_HILOS_VIEWS, galleryHeading: "Conoce la aplicación por dentro", galleryIntro: "Pantallas reales de la versión de demostración. Los clientes y pedidos que aparecen son ficticios." },
] as const;

/* ============================ Live device ============================ */

/** The real full-page screenshot, scrolling inside browser chrome. */
function LiveScreenshot({ project }: { project: FeaturedProject }) {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {project.kind === "desktop" ? <DesktopAppChrome title={project.domain} /> : <BrowserChrome domain={project.domain} />}
      {/* Scrolling screenshot */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={project.fullImage}
          onError={(e) => {
            if (e.currentTarget.src !== project.fallbackImage) {
              e.currentTarget.src = project.fallbackImage;
            }
          }}
          alt={`Captura ${project.kind === "desktop" ? "de la aplicación" : "del sitio"} ${project.name}`}
          loading="lazy"
          className={project.kind === "desktop" ? "absolute inset-0 h-full w-full object-contain object-top" : "live-scroll absolute inset-x-0 top-0 w-full"}
        />
      </div>
    </div>
  );
}

function LaptopDevice({ project }: { project: FeaturedProject }) {
  const tiltRef = useTilt<HTMLDivElement>({ max: 6, perspective: 1200, glare: true });

  return (
    <div className="group [perspective:1200px]">
      <div ref={tiltRef} className="device-3d relative">
        {/* Discreet glow */}
        <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[32px] bg-brand/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="w-full">
          <div className="relative rounded-[10px] bg-zinc-900 p-[2.2%] shadow-2xl shadow-black/25 ring-1 ring-white/10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-white">
              <LiveScreenshot project={project} />
              <div className="device-glare pointer-events-none absolute inset-0 z-10" />
            </div>
          </div>
          {/* Hinge / base */}
          <div className="relative left-1/2 h-[2.5%] min-h-[8px] w-[112%] -translate-x-1/2 rounded-b-[8px] bg-linear-to-b from-zinc-300 to-zinc-400 shadow-md">
            <div className="absolute left-1/2 top-0 h-[45%] w-[13%] -translate-x-1/2 rounded-b-[4px] bg-zinc-400/80" />
          </div>
        </div>
      </div>
      {/* Contact shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto -mt-1 h-5 w-[62%] rounded-[50%] bg-black/25 blur-xl transition-all duration-500 group-hover:w-[72%] group-hover:bg-black/30 motion-reduce:transition-none"
      />
      {project.kind !== "desktop" && (
        <>
          <p className="mt-6 text-center text-xs text-muted-foreground md:hidden">
            La captura se desplaza sola para que la explores
          </p>
          <p className="mt-6 hidden text-center text-xs text-muted-foreground md:block">
            Pasa el cursor para recorrer el sitio
          </p>
        </>
      )}
    </div>
  );
}

/* ============================ Section ============================ */

export function Showcase3D() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const [caseIndex, setCaseIndex] = useState(0);
  const currentCase = CASES[caseIndex];
  const project = currentCase.project;
  const previousIndex = (caseIndex - 1 + CASES.length) % CASES.length;
  const nextIndex = (caseIndex + 1) % CASES.length;
  const waHref = whatsappHref(
    `Hola, vi el proyecto "${project.name}" en su portafolio y quiero algo así para mi negocio.`,
  );

  return (
    <section id="showcase" className="relative overflow-hidden border-t border-hairline">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background via-brand-soft/40 to-background" />
      <div className="pointer-events-none absolute -left-32 top-32 -z-10 h-96 w-96 rounded-full bg-brand/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-32 -z-10 h-96 w-96 rounded-full bg-brand/[0.06] blur-3xl" />

      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-background px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-brand">
            <Sparkles size={14} />
            Proyectos reales, por dentro
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.15] tracking-tight text-brand md:text-display">
            No te contamos que sabemos hacerlo. Te lo mostramos.
          </h2>
          <p className="mt-4 text-base leading-[1.6] text-foreground/80 md:text-body">
            Explora una tienda online y una aplicación de escritorio en pruebas en el local, con capturas
            reales de lo que construimos.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4" role="group" aria-label="Navegar entre casos de éxito">
            <button
              type="button"
              onClick={() => setCaseIndex(previousIndex)}
              aria-label={`Ver caso anterior: ${CASES[previousIndex].project.name}`}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-hairline bg-background text-brand transition-colors hover:bg-brand-soft ${FOCUS_RING}`}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <p className="min-w-0 text-sm font-semibold text-brand" aria-live="polite" aria-atomic="true">
              <span className="text-muted-foreground">{caseIndex + 1} / {CASES.length}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              {project.name}
            </p>
            <button
              type="button"
              onClick={() => setCaseIndex(nextIndex)}
              aria-label={`Ver caso siguiente: ${CASES[nextIndex].project.name}`}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-hairline bg-background text-brand transition-colors hover:bg-brand-soft ${FOCUS_RING}`}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Featured case */}
        <div
          ref={ref}
          className={`mt-16 grid items-center gap-10 transition-all duration-700 ease-out lg:grid-cols-2 lg:gap-16 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <LaptopDevice project={project} />

          <div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 font-display text-xs font-semibold text-brand">
              {project.category}
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-brand md:text-3xl">
              {project.name}
            </h3>
            <p className="mt-3 text-ui leading-[1.6] text-foreground/80 md:text-base">
              {project.description}
            </p>

            {project.facts.length > 0 && <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-hairline py-5">
              {project.facts.map((fact) => (
                // dt/dd van en orden de lectura (etiqueta → valor); flex-col-reverse deja el número arriba.
                <div key={fact.label} className="flex flex-col-reverse justify-end gap-2">
                  <dt className="text-caption leading-[1.4] text-muted-foreground">{fact.label}</dt>
                  <dd className="font-display text-display-sm font-semibold leading-none text-brand">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>}

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-ui text-foreground">
                  <Check size={16} className="shrink-0 text-success" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-hairline bg-background px-3 py-1.5 font-display text-xs font-medium text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-md border-2 border-brand px-6 font-display text-sm font-semibold text-brand transition duration-200 hover:bg-brand-soft active:scale-[0.98] ${FOCUS_RING}`}
                >
                  <ExternalLink size={17} />
                  Ver en vivo
                  <NewTabHint />
                </a>
              )}
              <a
                href={project.kind === "desktop" ? "#contacto" : waHref}
                target={project.kind === "desktop" ? undefined : "_blank"}
                rel={project.kind === "desktop" ? undefined : "noopener noreferrer"}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-md bg-cta px-6 font-display text-sm font-semibold text-white transition duration-200 hover:bg-cta-hover active:scale-[0.98] ${FOCUS_RING}`}
              >
                <MessageCircle size={17} />
                {project.kind === "desktop" ? "Consultar un proyecto similar" : "Quiero un proyecto así"}
                {project.kind !== "desktop" && <NewTabHint />}
              </a>
            </div>
          </div>
        </div>

        <ShowcaseGallery
          key={project.name}
          domain={project.domain}
          kind={project.kind}
          idPrefix={project.kind === "desktop" ? "entre-hilos" : "showcase"}
          heading={currentCase.galleryHeading}
          intro={currentCase.galleryIntro}
          views={currentCase.views}
        />

        {/* Next project invitation */}
        <NextProjectCard />
      </div>
    </section>
  );
}

/** Honest, converting placeholder that fills the space and invites the visitor. */
function NextProjectCard() {
  return (
    <a
      href="#contacto"
      className={`group mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border-2 border-dashed border-hairline bg-background/60 p-8 text-center transition-colors hover:border-brand/50 hover:bg-brand-soft/40 sm:flex-row sm:text-left ${FOCUS_RING}`}
    >
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand transition-transform duration-200 group-hover:scale-110">
          <Plus size={24} />
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-brand">
            ¿Y si el próximo caso fuera el tuyo?
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            Cuéntanos tu idea y la convertimos en una solución a medida.
          </p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 font-display text-sm font-semibold text-brand">
        Empezar mi proyecto
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
    </a>
  );
}
