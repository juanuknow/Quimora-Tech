import { useEffect, useRef } from "react";
import { Sparkles, Check, ExternalLink, MessageCircle, ArrowRight, Plus } from "lucide-react";
import { useInView } from "../lib/hooks";
import { FOCUS_RING, whatsappHref } from "../lib/site";

/* ============================ Data ============================ */

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
  /** Real capabilities of the site (no invented metrics). */
  highlights: string[];
  technologies: string[];
}

// Proyecto real construido por Quimora Tech. Sin métricas de resultados
// inventadas: se muestra el sitio de verdad y lo que hace.
// liveUrl se activará cuando el sitio esté desplegado en un dominio estable.
const FEATURED: FeaturedProject = {
  name: "Diosa's Make up",
  category: "Tienda online · Cosméticos",
  domain: "diosascali.com",
  fullImage: "/images/diosas-full.webp",
  fallbackImage: "/images/diosas-cosmeticos.webp",
  description:
    "Tienda de maquillaje y cuidado personal con catálogo por categorías, buscador de productos, lista de favoritos, carrito y reseñas de clientas. Envíos a toda Colombia.",
  highlights: [
    "Catálogo por categorías",
    "Buscador de productos",
    "Carrito de compras",
    "Lista de favoritos",
    "Reseñas de clientas",
    "Envíos a toda Colombia",
  ],
  technologies: ["React", "Vite", "Tailwind CSS", "Supabase"],
};

/* ============================ Tilt ============================ */

/**
 * Cursor-driven 3D tilt. Writes the transform + glare position directly to the
 * element via ref (no React re-render → 60 FPS). Disabled on touch pointers and
 * when the user prefers reduced motion.
 */
function useTilt<T extends HTMLElement>(max = 6) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * 2 * max;
      const rx = -(py - 0.5) * 2 * max;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
          2,
        )}deg)`;
        el.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
      el.style.setProperty("--glare-x", "50%");
      el.style.setProperty("--glare-y", "0%");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return ref;
}

/* ============================ Live device ============================ */

/** The real full-page screenshot, scrolling inside browser chrome. */
function LiveScreenshot({ project }: { project: FeaturedProject }) {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Browser chrome */}
      <div className="flex h-[8%] shrink-0 items-center gap-[1%] bg-zinc-100 px-[2.5%]">
        <span className="aspect-square h-[20%] min-h-[4px] rounded-full bg-zinc-300" />
        <span className="aspect-square h-[20%] min-h-[4px] rounded-full bg-zinc-300" />
        <span className="aspect-square h-[20%] min-h-[4px] rounded-full bg-zinc-300" />
        <span className="ml-[2.5%] flex h-[55%] flex-1 items-center gap-[1.5%] truncate rounded-full bg-white px-[2.5%] text-[0.5rem] font-medium text-zinc-400">
          <span className="aspect-square h-[34%] min-h-[3px] shrink-0 animate-pulse rounded-full bg-emerald-500" />
          {project.domain}
        </span>
      </div>
      {/* Scrolling screenshot */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={project.fullImage}
          onError={(e) => {
            if (e.currentTarget.src !== project.fallbackImage) {
              e.currentTarget.src = project.fallbackImage;
            }
          }}
          alt={`Captura del sitio ${project.name}`}
          loading="lazy"
          className="live-scroll absolute inset-x-0 top-0 w-full"
        />
      </div>
    </div>
  );
}

function LaptopDevice({ project }: { project: FeaturedProject }) {
  const tiltRef = useTilt<HTMLDivElement>(6);

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
      <p className="mt-6 text-center text-xs text-muted-foreground md:hidden">
        La captura se desplaza sola para que la explores
      </p>
      <p className="mt-6 hidden text-center text-xs text-muted-foreground md:block">
        Pasa el cursor para recorrer el sitio
      </p>
    </div>
  );
}

/* ============================ Section ============================ */

export function Showcase3D() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const waHref = whatsappHref(
    `Hola, vi el proyecto "${FEATURED.name}" en su portafolio y quiero algo así para mi negocio.`,
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
            Un proyecto real, por dentro
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.15] tracking-tight text-brand md:text-[40px]">
            No te contamos que sabemos hacerlo. Te lo mostramos.
          </h2>
          <p className="mt-4 text-base leading-[1.6] text-foreground/80 md:text-[17px]">
            Explora un sitio que construimos —de verdad, no una imagen— y descubre cómo se ve por
            dentro.
          </p>
        </div>

        {/* Featured case */}
        <div
          ref={ref}
          className={`mt-16 grid items-center gap-10 transition-all duration-700 ease-out lg:grid-cols-2 lg:gap-16 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <LaptopDevice project={FEATURED} />

          <div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 font-display text-xs font-semibold text-brand">
              {FEATURED.category}
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-brand md:text-3xl">
              {FEATURED.name}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-foreground/80 md:text-base">
              {FEATURED.description}
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {FEATURED.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-[15px] text-foreground">
                  <Check size={16} className="shrink-0 text-success" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {FEATURED.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-hairline bg-background px-3 py-1.5 font-display text-xs font-medium text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {FEATURED.liveUrl && (
                <a
                  href={FEATURED.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-md border-2 border-brand px-6 font-display text-sm font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft ${FOCUS_RING}`}
                >
                  <ExternalLink size={17} />
                  Ver en vivo
                </a>
              )}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-md bg-cta px-6 font-display text-sm font-semibold text-white transition-colors duration-200 hover:bg-cta-hover ${FOCUS_RING}`}
              >
                <MessageCircle size={17} />
                Quiero un proyecto así
              </a>
            </div>
          </div>
        </div>

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
            Cuéntanos tu idea y la convertimos en un sitio que vende.
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
