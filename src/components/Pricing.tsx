import { useState, type KeyboardEvent } from "react";
import { Check, ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { FOCUS_RING, trackEvent, whatsappHref } from "../lib/site";
import { PLANS, PLAN_INCLUDES } from "../lib/pricing-data";

const INITIAL_PLAN = Math.max(
  0,
  PLANS.findIndex((plan) => plan.defaultSelected),
);

export function Pricing() {
  const [activeIndex, setActiveIndex] = useState(INITIAL_PLAN);
  const previousIndex = (activeIndex - 1 + PLANS.length) % PLANS.length;
  const nextIndex = (activeIndex + 1) % PLANS.length;

  function selectPlan(index: number, focus = false) {
    if (index !== activeIndex) {
      setActiveIndex(index);
      trackEvent("pricing_plan_select", { plan: PLANS[index].name });
    }
    if (focus) {
      const tab = document.getElementById(`pricing-tab-${index}`);
      tab?.focus();
      tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = Number(event.currentTarget.dataset.index);
    let destination: number | undefined;
    if (event.key === "ArrowRight") destination = (index + 1) % PLANS.length;
    if (event.key === "ArrowLeft") destination = (index - 1 + PLANS.length) % PLANS.length;
    if (event.key === "Home") destination = 0;
    if (event.key === "End") destination = PLANS.length - 1;
    if (destination !== undefined) {
      event.preventDefault();
      selectPlan(destination, true);
    }
  }

  function movePlan(index: number) {
    selectPlan(index);
  }

  return (
    <section id="precios" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display">
            Una inversión que se paga sola
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-foreground/80 md:text-body">
            Precios claros desde el inicio. Elige un plan para ver su precio y todo lo que incluye.
          </p>
        </div>

        <div className="mt-10 flex items-center gap-3 md:mt-14">
          <button
            type="button"
            onClick={() => movePlan(previousIndex)}
            aria-label={`Plan anterior: ${PLANS[previousIndex].name}`}
            className={`hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-hairline bg-background text-brand transition-colors hover:bg-brand-soft md:grid ${FOCUS_RING}`}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <div
            role="tablist"
            aria-label="Planes"
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-1 py-2 md:grid md:grid-cols-4 md:overflow-visible"
          >
            {PLANS.map((item, index) => (
              <button
                key={item.name}
                id={`pricing-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls={`pricing-panel-${index}`}
                tabIndex={activeIndex === index ? 0 : -1}
                data-index={index}
                onClick={() => selectPlan(index)}
                onKeyDown={onTabKeyDown}
                className={`min-h-16 min-w-[44%] snap-start rounded-xl border px-4 py-3 text-left transition-colors motion-reduce:transition-none md:min-w-0 ${FOCUS_RING} ${
                  activeIndex === index
                    ? "border-brand bg-brand text-white"
                    : "border-hairline bg-background text-brand hover:bg-brand-soft"
                }`}
              >
                <span className="block font-display text-sm font-semibold">{item.name}</span>
                <span
                  className={`mt-0.5 block text-xs ${
                    activeIndex === index ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  {item.name === "A Medida" ? "A cotizar" : item.price}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => movePlan(nextIndex)}
            aria-label={`Plan siguiente: ${PLANS[nextIndex].name}`}
            className={`hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-hairline bg-background text-brand transition-colors hover:bg-brand-soft md:grid ${FOCUS_RING}`}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        <p
          className="mt-2 text-center text-sm text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          Plan {activeIndex + 1} de {PLANS.length}
        </p>

        <div
          id="pricing-panels"
          className="mt-5 grid overflow-hidden rounded-2xl border border-hairline bg-background"
        >
          {PLANS.map((panelPlan, index) => {
            const isActive = activeIndex === index;
            const message =
              panelPlan.name === "A Medida"
                ? "Hola, quiero cotizar un proyecto a medida"
                : `Hola, me interesa el plan ${panelPlan.name}`;

            return (
              <div
                key={panelPlan.name}
                id={`pricing-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`pricing-tab-${index}`}
                aria-hidden={!isActive}
                inert={!isActive}
                className={`[grid-area:1/1] grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] ${isActive ? "visible" : "invisible"}`}
              >
                <div className="flex flex-col bg-brand-soft p-6 sm:p-8 md:p-10">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-foreground/70">
                    {panelPlan.audience}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand">
                    {panelPlan.name}
                  </h3>
                  <p className="mt-5 font-display text-3xl font-bold leading-tight text-brand md:text-4xl">
                    {panelPlan.price}
                    <span className="mt-1 block font-sans text-sm font-normal text-foreground/70">
                      {panelPlan.period}
                    </span>
                  </p>
                  {panelPlan.promo && (
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-background px-3 py-2 font-display text-xs font-semibold text-brand">
                      <Gift size={14} aria-hidden="true" />
                      {panelPlan.promo}
                    </span>
                  )}
                  <p className="mt-5 text-ui leading-[1.6] text-foreground/80">
                    {panelPlan.description}
                  </p>
                  <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-hairline pt-4 text-sm text-foreground/80">
                    <div>
                      <dt>Entrega</dt>
                      <dd className="font-semibold text-brand">{panelPlan.delivery}</dd>
                    </div>
                    <div>
                      <dt>Soporte</dt>
                      <dd className="font-semibold text-brand">{panelPlan.support}</dd>
                    </div>
                  </dl>
                  <div className="mt-auto pt-8">
                    <a
                      href={whatsappHref(message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("pricing_plan_cta", { plan: panelPlan.name })}
                      className={`inline-flex min-h-12 w-full items-center justify-center rounded-md bg-cta px-5 py-3 text-center font-display text-sm font-semibold text-white transition-colors hover:bg-cta-hover active:scale-[0.98] ${FOCUS_RING}`}
                    >
                      {panelPlan.name === "A Medida"
                        ? "Cotizar por WhatsApp"
                        : `Quiero el plan ${panelPlan.name} →`}
                    </a>
                    <p className="mt-2 text-center text-xs text-foreground/70">
                      Confirmamos alcance y precio final antes de empezar.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col p-6 sm:p-8 md:p-10">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Lo que obtienes
                  </h4>
                  {(panelPlan.includesPlan || panelPlan.includesNote) && (
                    <p className="mt-4 inline-flex items-center rounded-lg border border-dashed border-hairline bg-brand-soft px-3 py-2 text-sm font-semibold text-brand">
                      ＋ Todo lo incluido en {panelPlan.includesPlan ?? panelPlan.includesNote}
                    </p>
                  )}
                  {/* Cuatro filas reparten la lista más larga en dos columnas; las listas cortas comienzan arriba sin dejar un hueco al final. */}
                  <ul className="mt-5 grid flex-1 content-between gap-x-6 gap-y-4 sm:grid-cols-1 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-4">
                    {panelPlan.adds.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-[1.45] text-foreground/85"
                      >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                          <Check size={12} aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => movePlan(previousIndex)}
            aria-label={`Plan anterior: ${PLANS[previousIndex].name}`}
            className={`grid h-11 w-11 place-items-center rounded-full border border-hairline bg-background text-brand transition-colors hover:bg-brand-soft ${FOCUS_RING}`}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <span className="text-xs text-muted-foreground" aria-hidden="true">
            {activeIndex + 1} / {PLANS.length}
          </span>
          <button
            type="button"
            onClick={() => movePlan(nextIndex)}
            aria-label={`Plan siguiente: ${PLANS[nextIndex].name}`}
            className={`grid h-11 w-11 place-items-center rounded-full border border-hairline bg-background text-brand transition-colors hover:bg-brand-soft ${FOCUS_RING}`}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-hairline pt-6 text-sm text-foreground/80">
          <strong className="font-display font-semibold text-brand">En todos los planes</strong>
          {PLAN_INCLUDES.map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <Check size={15} aria-hidden="true" className="shrink-0 text-brand" />
              {item}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-5 rounded-2xl border border-hairline bg-brand-soft/40 p-6 text-center sm:flex-row sm:text-left md:p-8">
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
      </div>
    </section>
  );
}
