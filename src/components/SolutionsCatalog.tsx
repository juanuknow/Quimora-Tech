import { useRef, useState, type KeyboardEvent } from "react";
import { Reveal } from "./Reveal";
import { SolutionCard } from "./SolutionCard";
import { LIGHT_RING } from "../lib/site";
import { SERVICE_CATEGORIES, services, type ServiceCategoryId } from "../lib/services-data";

/**
 * Catálogo de soluciones agrupado en pestañas.
 *
 * Con 14 tarjetas iguales en una sola rejilla no se distinguía qué era cada
 * cosa y en móvil sumaban ~5 000 px de scroll. Agrupadas, cada pestaña muestra
 * 4–5 tarjetas.
 *
 * Todos los paneles se renderizan siempre (los inactivos con `hidden`), de modo
 * que el contenido sigue en el HTML servido y es indexable. Sigue el patrón de
 * pestañas de WAI-ARIA: flechas, Inicio y Fin mueven la selección.
 */
export function SolutionsCatalog() {
  const [active, setActive] = useState<ServiceCategoryId>(SERVICE_CATEGORIES[0].id);
  const tabRefs = useRef<Partial<Record<ServiceCategoryId, HTMLButtonElement | null>>>({});

  const select = (id: ServiceCategoryId) => {
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = SERVICE_CATEGORIES.length - 1;
    const target =
      e.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : e.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (target === null) return;
    e.preventDefault();
    select(SERVICE_CATEGORIES[target].id);
  };

  return (
    <Reveal className="mt-20">
      <div
        role="tablist"
        aria-label="Categorías de soluciones"
        className="grid grid-cols-3 gap-2 sm:flex sm:justify-center"
      >
        {SERVICE_CATEGORIES.map(({ id, label }, i) => {
          const selected = id === active;
          const count = services.filter((s) => s.category === id).length;
          return (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={selected}
              aria-controls={`panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border px-2 font-display text-caption font-semibold sm:px-5 sm:text-ui transition-[background-color,border-color,color,transform] duration-200 ease-out-strong active:scale-[0.98] ${LIGHT_RING} ${
                selected
                  ? "border-white bg-white text-brand-dark"
                  : "border-white/20 text-white/75 hover:border-white/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
              <span
                className={`hidden text-caption tabular-nums sm:inline ${selected ? "text-brand-dark/60" : "text-white/50"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {SERVICE_CATEGORIES.map(({ id, description }) => {
        const items = services.filter((s) => s.category === id);
        return (
          <div
            key={id}
            role="tabpanel"
            id={`panel-${id}`}
            aria-labelledby={`tab-${id}`}
            hidden={id !== active}
            className="animate-tab-in mt-8"
          >
            <p className="mx-auto max-w-xl text-center text-ui leading-[1.6] text-white/65 md:text-base">
              {description}
            </p>
            {/* Flex centrado y no grid: si la última fila queda incompleta
                (4 o 5 tarjetas), las huérfanas se centran en vez de pegarse a
                la izquierda. El ancho de cada tarjeta descuenta el `gap`. */}
            <ul className="mt-8 flex flex-wrap justify-center gap-4">
              {items.map((solution) => (
                <li
                  key={solution.title}
                  className="w-full sm:w-[calc(50%_-_0.5rem)] xl:w-[calc(33.333%_-_0.667rem)]"
                >
                  <SolutionCard solution={solution} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </Reveal>
  );
}
