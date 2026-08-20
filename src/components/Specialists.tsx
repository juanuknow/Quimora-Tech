import { ShoppingCart, Boxes, Receipt, Workflow, ArrowRight, Layers } from "lucide-react";
import { Reveal } from "./Reveal";
import { FOCUS_RING } from "../lib/site";

const SPECIALTIES = [
  {
    icon: ShoppingCart,
    title: "Ecommerce",
    body: "Experiencias de compra digitales diseñadas para convertir y facilitar la gestión de productos, pedidos y clientes.",
  },
  {
    icon: Boxes,
    title: "Sistemas de inventario",
    body: "Herramientas para controlar productos, existencias, movimientos y operaciones de forma eficiente.",
  },
  {
    icon: Receipt,
    title: "Sistemas de facturación",
    body: "Soluciones para digitalizar y optimizar los procesos de facturación de tu negocio.",
  },
  {
    icon: Workflow,
    title: "Integraciones y automatizaciones",
    body: "Conectamos herramientas y automatizamos procesos para reducir tareas manuales y mejorar la eficiencia.",
  },
] as const;

export function Specialists() {
  return (
    <section id="especialistas" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Layers size={14} />
            Especialidades
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display">
            Especialistas en
          </h2>
          <p className="mt-4 text-base text-foreground/80 md:text-body">
            Construimos soluciones digitales enfocadas en las operaciones reales de tu negocio.
          </p>
        </div>

        <div className="mt-14 border-t border-hairline" role="list">
          {SPECIALTIES.map((item, i) => (
            <SpecialtyRow key={item.title} item={item} index={i} />
          ))}
        </div>

        <Reveal index={SPECIALTIES.length} className="mt-10 flex justify-center">
          <a
            href="#contacto"
            className={`group inline-flex min-h-11 items-center gap-2 rounded-md px-2 py-2 font-display text-ui font-semibold text-brand transition-colors duration-200 hover:text-accent-strong active:scale-[0.98] ${FOCUS_RING}`}
          >
            ¿Necesitas una solución para tu negocio? Hablemos de tu proyecto
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function SpecialtyRow({ item, index }: { item: (typeof SPECIALTIES)[number]; index: number }) {
  const { icon: Icon, title, body } = item;
  const number = String(index + 1).padStart(2, "0");

  return (
    <Reveal index={index}>
      <div
        role="listitem"
        tabIndex={0}
        className={`group relative flex flex-col gap-4 border-b border-hairline py-8 pl-5 transition-[translate,border-color] duration-300 ease-out-strong hover:translate-x-1 focus-visible:translate-x-1 sm:flex-row sm:items-center sm:gap-8 sm:py-10 ${FOCUS_RING}`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-2 left-0 w-0.5 scale-y-0 bg-brand transition-transform duration-300 ease-out-strong group-hover:scale-y-100 group-focus-visible:scale-y-100"
        />
        <span className="font-display text-2xl font-semibold text-muted-foreground/50 transition-colors duration-300 group-hover:text-brand sm:w-16 sm:shrink-0 sm:text-display-sm">
          {number}
        </span>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-primary-foreground">
          <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
        </div>
        <div className="sm:max-w-xl">
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground md:text-subhead">
            {title}
          </h3>
          <p className="mt-2 text-ui leading-[1.6] text-foreground/80">{body}</p>
        </div>
      </div>
    </Reveal>
  );
}
