import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
 * Todos los paneles se renderizan siempre, de modo que el contenido sigue en el
 * HTML servido y es indexable. Los inactivos llevan `hidden="until-found"`: la
 * búsqueda del navegador (Ctrl+F) también encuentra los servicios de otra
 * pestaña y, al hacerlo, `beforematch` la selecciona. Donde no hay soporte
 * (Safari) se comporta como `hidden` normal. Sigue el patrón de pestañas de
 * WAI-ARIA: flechas, Inicio y Fin mueven la selección.
 */
export function SolutionsCatalog() {
  const [active, setActive] = useState<ServiceCategoryId>(SERVICE_CATEGORIES[0].id);
  const tabRefs = useRef<Partial<Record<ServiceCategoryId, HTMLButtonElement | null>>>({});
  const panelRefs = useRef<Partial<Record<ServiceCategoryId, HTMLDivElement | null>>>({});

  // Una coincidencia de Ctrl+F dentro de un panel oculto lo revela: sincroniza
  // la pestaña para que estado visual y accesible no se contradigan.
  useEffect(() => {
    const cleanups = SERVICE_CATEGORIES.map(({ id }) => {
      const panel = panelRefs.current[id];
      if (!panel) return () => {};
      const onMatch = () => setActive(id);
      panel.addEventListener("beforematch", onMatch);
      return () => panel.removeEventListener("beforematch", onMatch);
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // React 19 serializa `hidden` como booleano (`hidden=""`) y descarta el valor
  // "until-found", así que se aplica en el DOM tras cada cambio de pestaña.
  // React no lo pisa mientras su propio valor no cambie.
  useEffect(() => {
    for (const { id } of SERVICE_CATEGORIES) {
      if (id !== active) panelRefs.current[id]?.setAttribute("hidden", "until-found");
    }
  }, [active]);

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
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              // La pestaña activa también se marca con una línea (borde de un
              // pseudo-elemento) y no solo con el relleno: el modo de alto
              // contraste de Windows elimina los fondos y ambas se verían iguales.
              className={`relative inline-flex min-h-11 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border px-2 font-display text-caption font-semibold sm:px-5 sm:text-ui transition-[background-color,border-color,color,transform] duration-200 ease-out-strong active:scale-[0.98] ${LIGHT_RING} ${
                selected
                  ? "border-white bg-white text-brand-dark after:pointer-events-none after:absolute after:inset-x-3 after:bottom-1.5 after:border-b-2 after:border-current"
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
        const isActive = id === active;
        return (
          <div
            key={id}
            ref={(el) => {
              panelRefs.current[id] = el;
            }}
            role="tabpanel"
            id={`panel-${id}`}
            aria-labelledby={`tab-${id}`}
            // Booleano en el HTML servido; tras hidratar, el efecto de arriba lo
            // promueve a "until-found". El panel no lleva márgenes ni rellenos:
            // `until-found` no usa `display: none` y los seguiría pintando.
            hidden={!isActive}
          >
            {/* La clave cambia al activarse: vuelve a montar el contenido y
                repite la entrada, que con `until-found` ya no la dispara el
                paso de `display: none` a visible. */}
            <div key={isActive ? "activo" : "inactivo"} className="animate-tab-in pt-8">
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
          </div>
        );
      })}
    </Reveal>
  );
}
