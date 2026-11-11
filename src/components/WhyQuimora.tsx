type Reason = {
  title: string;
  problem: string;
  solution: string;
  standards: readonly string[];
};

const REASONS: readonly Reason[] = [
  {
    title: "Que te encuentren",
    problem: "Si no apareces en Google, tu cliente le compra a otro.",
    solution:
      "SEO desde el primer día: estructura, velocidad y contenido pensados para búsquedas locales.",
    standards: ["Meta Lighthouse 95+"],
  },
  {
    title: "Que no se vayan",
    problem: "Una web lenta pierde visitas antes de mostrarse.",
    solution: "Sitios ligeros y diseñados primero para el celular.",
    standards: ["Menos de 3 s de carga", "100 % responsive"],
  },
  {
    title: "Que te escriban",
    problem: "Recibir visitas no sirve si nadie contacta ni compra.",
    solution: "Cada página lleva a una acción clara: WhatsApp, cotización o compra.",
    standards: ["Una acción principal por página"],
  },
  {
    title: "Que sepas qué funciona",
    problem: "Sin datos, no sabes qué mejorar.",
    solution: "Conectamos Google Analytics desde el lanzamiento para que veas resultados reales.",
    standards: ["Analítica incluida"],
  },
];

export function WhyQuimora() {
  return (
    <section
      id="servicios"
      aria-labelledby="why-quimora-title"
      className="scroll-mt-28 border-t border-hairline bg-background"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-caption font-semibold text-muted-foreground">Por qué Quimora Tech</p>
        <h2
          id="why-quimora-title"
          className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display"
        >
          Lo que tu web debe lograr, y cómo lo conseguimos
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground md:text-body">
          Cuatro problemas que vemos en casi todos los negocios y lo que hacemos en cada proyecto
          para resolverlos.
        </p>
        <div
          aria-hidden="true"
          className="mt-10 hidden gap-8 border-b border-hairline pb-3 text-caption font-semibold text-muted-foreground md:grid md:grid-cols-[1fr_1.4fr_0.85fr]"
        >
          <span>El problema</span>
          <span>Cómo lo resolvemos</span>
          <span>Estándar</span>
        </div>
        <ul className="mt-8 divide-y divide-hairline border-y border-hairline md:mt-0 md:border-t-0">
          {REASONS.map((reason) => (
            <li
              key={reason.title}
              className="grid gap-4 py-6 md:grid-cols-[1fr_1.4fr_0.85fr] md:gap-8 md:py-7"
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-brand">{reason.title}</h3>
                <p className="mt-2 text-ui leading-relaxed text-muted-foreground">
                  {reason.problem}
                </p>
              </div>
              <div>
                <p className="mb-1 text-caption font-semibold text-muted-foreground md:sr-only">
                  Cómo lo resolvemos
                </p>
                <p className="text-ui leading-relaxed text-foreground">{reason.solution}</p>
              </div>
              <div>
                <p className="mb-2 text-caption font-semibold text-muted-foreground md:sr-only">
                  Estándar
                </p>
                <ul className="flex flex-wrap gap-2">
                  {reason.standards.map((standard) => (
                    <li
                      key={standard}
                      className="rounded-md bg-brand-soft px-3 py-2 text-caption font-medium text-brand"
                    >
                      {standard}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-caption text-muted-foreground">
          Respondemos tus mensajes en menos de 24 horas.
        </p>
      </div>
    </section>
  );
}
