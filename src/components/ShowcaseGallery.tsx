import { useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FOCUS_RING } from "../lib/site";
import { BrowserChrome } from "./BrowserChrome";

/* ============================ Data ============================ */

export interface GalleryView {
  id: string;
  /** Etiqueta corta de la pestaña. */
  label: string;
  title: string;
  /** Qué hace esta parte del sitio — solo capacidades reales, sin métricas inventadas. */
  caption: string;
  image: string;
  alt: string;
  /** "browser" va dentro de una ventana de navegador; "phone" dentro de un celular. */
  device: "browser" | "phone";
}

interface ShowcaseGalleryProps {
  domain: string;
  views: readonly GalleryView[];
}

/* ============================ Devices ============================ */

function BrowserShot({ domain, view }: { domain: string; view: GalleryView }) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-lg bg-white shadow-xl shadow-black/15 ring-1 ring-black/10">
      <BrowserChrome domain={domain} />
      <div className="relative flex-1">
        <img
          src={view.image}
          alt={view.alt}
          width={1440}
          height={900}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}

function PhoneShot({ view }: { view: GalleryView }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative aspect-[780/1688] h-[96%] rounded-[1.6rem] bg-zinc-900 p-1.5 shadow-xl shadow-black/25 ring-1 ring-white/10">
        <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] bg-white">
          <img
            src={view.image}
            alt={view.alt}
            width={780}
            height={1688}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================ Gallery ============================ */

/**
 * Galería con pestañas de un proyecto real: una captura por parte del sitio
 * (inicio, menú, producto, carrito, ubicación, celular) con su explicación.
 * Todas las capturas viven apiladas y se funden entre sí, así que cambiar de
 * pestaña no mueve el layout ni vuelve a pedir imágenes.
 */
export function ShowcaseGallery({ domain, views }: ShowcaseGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = views[activeIndex];

  const select = (index: number, focus = false) => {
    const next = (index + views.length) % views.length;
    setActiveIndex(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  // Patrón WAI-ARIA de pestañas: flechas mueven entre pestañas, Inicio/Fin saltan a los extremos.
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") select(index + 1, true);
    else if (event.key === "ArrowLeft") select(index - 1, true);
    else if (event.key === "Home") select(0, true);
    else if (event.key === "End") select(views.length - 1, true);
    else return;
    event.preventDefault();
  };

  return (
    <div className="mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="font-display text-2xl font-semibold leading-[1.2] tracking-tight text-brand md:text-3xl">
          Recorre el sitio por dentro
        </h3>
        <p className="mt-3 text-ui leading-[1.6] text-foreground/80 md:text-base">
          Capturas reales de la tienda, de la portada al pedido por WhatsApp.
        </p>
      </div>

      {/* Pestañas */}
      <div
        role="tablist"
        aria-label="Partes del sitio"
        className="mt-8 flex flex-wrap items-center justify-center gap-2"
      >
        {views.map((view, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={view.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`showcase-tab-${view.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="showcase-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`inline-flex min-h-11 items-center rounded-md border px-4 font-display text-sm font-semibold transition-colors duration-200 active:scale-[0.98] motion-reduce:transition-none ${FOCUS_RING} ${
                selected
                  ? "border-cta bg-cta text-white"
                  : "border-hairline bg-background text-foreground hover:bg-brand-soft"
              }`}
            >
              {view.label}
            </button>
          );
        })}
      </div>

      {/* Escenario: todas las capturas apiladas, solo la activa es visible */}
      <div
        id="showcase-panel"
        role="tabpanel"
        aria-labelledby={`showcase-tab-${active.id}`}
        className="mx-auto mt-8 max-w-4xl rounded-2xl border border-hairline bg-brand-soft/60 p-4 md:p-8"
      >
        {/* Proporción = ventana 16:10 + barra de navegador (8 %) para que la captura no se recorte */}
        <div className="relative w-full" style={{ aspectRatio: "16 / 10.87" }}>
          {views.map((view, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={view.id}
                aria-hidden={!isActive}
                inert={!isActive}
                className={`absolute inset-0 transition-opacity duration-300 ease-out-strong motion-reduce:transition-none ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                {view.device === "phone" ? (
                  <PhoneShot view={view} />
                ) : (
                  <BrowserShot domain={domain} view={view} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie: qué muestra la captura + navegación */}
      <div className="mx-auto mt-6 flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div aria-live="polite" className="max-w-2xl">
          <p className="font-display text-lg font-semibold text-brand">{active.title}</p>
          <p className="mt-1 text-ui leading-[1.6] text-foreground/80">{active.caption}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="mr-1 text-caption tabular-nums text-muted-foreground">
            {activeIndex + 1} / {views.length}
          </span>
          <button
            type="button"
            onClick={() => select(activeIndex - 1)}
            aria-label="Captura anterior"
            className={`grid h-11 w-11 place-items-center rounded-md border border-hairline bg-background text-foreground transition-colors duration-200 hover:bg-brand-soft active:scale-[0.98] motion-reduce:transition-none ${FOCUS_RING}`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => select(activeIndex + 1)}
            aria-label="Captura siguiente"
            className={`grid h-11 w-11 place-items-center rounded-md border border-hairline bg-background text-foreground transition-colors duration-200 hover:bg-brand-soft active:scale-[0.98] motion-reduce:transition-none ${FOCUS_RING}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
