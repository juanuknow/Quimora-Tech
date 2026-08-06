import { SearchX, Clock, UserX, TrendingDown, AlertCircle } from "lucide-react";
import { Reveal } from "./Reveal";

/* -------------------- Problem -------------------- */
const PAINS = [
  {
    icon: SearchX,
    title: "Nadie te encuentra en Google",
    body: "Sin optimización, tu negocio es invisible. Tus clientes potenciales están comprándole a tu competencia.",
  },
  {
    icon: Clock,
    title: "Una web lenta espanta clientes",
    body: "El 53% de los usuarios abandona un sitio que tarda más de 3 segundos en cargar. Cada segundo cuenta.",
  },
  {
    icon: UserX,
    title: "Visitas que no se convierten",
    body: "Recibes tráfico pero nadie te contacta ni compra. Una web sin estrategia es solo una tarjeta de presentación cara.",
  },
  {
    icon: TrendingDown,
    title: "Tu competencia te adelanta",
    body: "Mientras esperas, otros captan a tus clientes con sitios modernos, rápidos y pensados para vender.",
  },
] as const;

export function Problem() {
  return (
    <section className="border-t border-hairline bg-hairline/60">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <AlertCircle size={14} />
            El problema
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display">
            Cada día sin una web que venda, pierdes dinero
          </h2>
          <p className="mt-4 text-base text-foreground/80 md:text-body">
            La mayoría de negocios tienen una web que no trabaja para ellos. Estos son los errores
            que te están costando clientes ahora mismo.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PAINS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} index={i}>
              <div className="flex h-full flex-col rounded-xl border border-hairline bg-background p-6">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Icon size={22} strokeWidth={1.9} />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-[1.6] text-foreground/70">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-2xl text-center font-display text-lg font-medium text-foreground md:text-xl">
          La buena noticia: todo esto tiene solución.{" "}
          <span className="text-brand">Y es más simple de lo que crees.</span>
        </p>
      </div>
    </section>
  );
}
