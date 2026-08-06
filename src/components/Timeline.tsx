import type { CSSProperties } from "react";
import { MessageCircle, Code2, Rocket, TrendingUp } from "lucide-react";
import { useInView } from "../lib/hooks";

/* -------------------- Timeline (signature) -------------------- */
const STEPS = [
  {
    week: "SEMANA 1",
    icon: MessageCircle,
    accent: false,
    title: "Diagnóstico",
    body: "Escuchamos tus metas, analizamos tu competencia y definimos la estrategia.",
  },
  {
    week: "SEMANA 2–3",
    icon: Code2,
    accent: false,
    title: "Desarrollo",
    body: "Diseñamos y desarrollamos tu web con las últimas tecnologías, optimizada desde el inicio.",
  },
  {
    week: "SEMANA 4",
    icon: Rocket,
    accent: true,
    title: "Lanzamiento",
    body: "Tu web sale a producción. Tus clientes ya la ven, comienzan a contactarte.",
  },
  {
    week: "DESPUÉS",
    icon: TrendingUp,
    accent: false,
    title: "Crecimiento Continuo",
    body: "Medimos, optimizamos y escalamos. Cada semana, mejor.",
  },
] as const;

export function Timeline() {
  return (
    <section id="nosotros" className="border-t border-hairline bg-hairline/60">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent-strong">
            Tu web lista en 4 semanas. No 4 meses.
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display">
            Crecer es Simple
          </h2>
        </div>

        <TimelineDesktop />
        <TimelineMobile />
      </div>
    </section>
  );
}

/** Duración del trazado de la línea de conexión. */
const LINE_DRAW_MS = 1000;

/**
 * Momento en que la línea alcanza el ícono `i`, en ms desde que arranca.
 *
 * Con 4 columnas, los íconos quedan centrados en el 12,5 / 37,5 / 62,5 / 87,5 %
 * del ancho, y la línea recorre del 8 % al 92 % (84 % de ancho útil). La
 * fracción recorrida hasta cada ícono —(centro − 8) / 84— cae en 5,4 / 35,1 /
 * 64,9 / 94,6 %, que sobre 1000 ms es prácticamente 50 + i·300.
 *
 * De ahí que la línea use `ease-linear`: con una curva de salida el trazo
 * adelantaría al tiempo y los íconos aparecerían después de que la línea ya
 * pasó por ellos.
 */
const stepPopDelay = (i: number) => 50 + i * 300;

function TimelineDesktop() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="relative mt-20 hidden md:block">
      {/* Riel base, siempre completo; la línea de marca se dibuja encima. */}
      <div className="absolute left-[8%] right-[8%] top-8 h-[2px] bg-white" />
      <div
        style={{ transitionDuration: `${LINE_DRAW_MS}ms` }}
        className={`absolute left-[8%] right-[8%] top-8 h-[2px] origin-left bg-brand transition-[scale] ease-linear ${
          inView ? "scale-x-100" : "scale-x-0"
        }`}
      />
      <div className="relative grid grid-cols-4 gap-6">
        {STEPS.map(({ week, icon: Icon, accent, title, body }, i) => (
          <div key={title} className="flex flex-col items-center text-center">
            <div
              style={{ "--delay": `${stepPopDelay(i)}ms` } as CSSProperties}
              className={`relative z-10 grid h-16 w-16 place-items-center rounded-full border-2 ${
                accent
                  ? "border-accent-strong bg-white text-accent-strong"
                  : "border-brand bg-white text-brand"
              } ${inView ? "animate-icon-pop" : "scale-0 opacity-0"}`}
            >
              <Icon size={26} strokeWidth={1.9} />
            </div>
            <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {week}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 max-w-[240px] text-sm leading-[1.6] text-foreground/75">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineMobile() {
  const { ref, inView } = useInView<HTMLOListElement>(0.05);

  return (
    <ol ref={ref} className="relative mt-14 space-y-8 md:hidden">
      {/* En vertical la línea se dibuja de arriba abajo. */}
      <div
        style={{ transitionDuration: `${LINE_DRAW_MS}ms` }}
        className={`absolute bottom-2 left-[27px] top-2 w-[2px] origin-top bg-brand/30 transition-[scale] ease-linear ${
          inView ? "scale-y-100" : "scale-y-0"
        }`}
      />
      {STEPS.map((step) => (
        <TimelineMobileStep key={step.title} step={step} />
      ))}
    </ol>
  );
}

/**
 * Apilados en vertical, los pasos rara vez caben juntos en pantalla: cada uno
 * observa su propio elemento para que el ícono aparezca al llegar a él, en vez
 * de haberse animado ya fuera de vista.
 */
function TimelineMobileStep({ step }: { step: (typeof STEPS)[number] }) {
  const { week, icon: Icon, accent, title, body } = step;
  const { ref, inView } = useInView<HTMLLIElement>(0.5);

  return (
    <li ref={ref} className="relative flex gap-5">
      <div
        className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 bg-white ${
          accent ? "border-accent-strong text-accent-strong" : "border-brand text-brand"
        } ${inView ? "animate-icon-pop" : "scale-0 opacity-0"}`}
      >
        <Icon size={22} strokeWidth={1.9} />
      </div>
      <div className="min-w-0 pt-1">
        <p className="font-display text-note font-semibold uppercase tracking-[0.14em] text-brand">
          {week}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-ui leading-[1.6] text-foreground/75">{body}</p>
      </div>
    </li>
  );
}
