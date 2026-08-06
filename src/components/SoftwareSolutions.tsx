import {
  Globe,
  MousePointerClick,
  ShoppingCart,
  ClipboardList,
  LayoutDashboard,
  Layers,
  CalendarCheck,
  Workflow,
  Plug,
  Users,
  BrainCircuit,
  Server,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Reveal } from "./Reveal";
import { useInView } from "../lib/hooks";
import { LIGHT_RING, whatsappHref, trackEvent } from "../lib/site";

/* ============================ Data ============================ */

interface Solution {
  icon: LucideIcon;
  title: string;
  /** Beneficio para el cliente, no la funcionalidad técnica. */
  body: string;
}

const SOLUTIONS: readonly Solution[] = [
  {
    icon: Globe,
    title: "Sitios web corporativos",
    body: "Presencia profesional que transmite confianza desde el primer clic y explica tu negocio sin que tengas que repetirlo.",
  },
  {
    icon: MousePointerClick,
    title: "Landing pages",
    body: "Páginas enfocadas en una sola acción: que el visitante te escriba, agende o compre.",
  },
  {
    icon: ShoppingCart,
    title: "Tiendas online (eCommerce)",
    body: "Vende las 24 horas con catálogo, carrito y pagos en línea, sin depender solo de las redes sociales.",
  },
  {
    icon: ClipboardList,
    title: "Sistemas administrativos",
    body: "Centraliza pedidos, inventario y clientes en un solo lugar y deja atrás las hojas de cálculo sueltas.",
  },
  {
    icon: LayoutDashboard,
    title: "Paneles de gestión",
    body: "Mira los números de tu negocio en tiempo real y toma decisiones con datos, no con intuición.",
  },
  {
    icon: Layers,
    title: "Plataformas web personalizadas",
    body: "Software hecho a la medida de tu operación, no un molde genérico al que tengas que adaptarte.",
  },
  {
    icon: CalendarCheck,
    title: "Reservas y citas",
    body: "Tus clientes agendan solos a cualquier hora: menos llamadas, menos cruces de horario.",
  },
  {
    icon: Workflow,
    title: "Automatización de procesos",
    body: "Las tareas repetitivas se hacen solas: menos errores manuales y más horas libres para vender.",
  },
  {
    icon: Plug,
    title: "Integraciones con APIs",
    body: "Conectamos tu web con pagos, envíos, WhatsApp o el sistema que ya usas a diario.",
  },
  {
    icon: Users,
    title: "Portales para clientes",
    body: "Un espacio privado donde cada cliente consulta su información sin escribirte por cada dato.",
  },
  {
    icon: BrainCircuit,
    title: "Soluciones con inteligencia artificial",
    body: "Asistentes, búsqueda inteligente y clasificación automática que responden por ti.",
  },
  {
    icon: Server,
    title: "Aplicaciones web escalables",
    body: "Arquitectura preparada para crecer: más usuarios y más datos sin tener que rehacer todo.",
  },
] as const;

/** Compromisos del proceso, no métricas de trayectoria. */
const CAPABILITIES = [
  "Del diseño al despliegue",
  "Código propio, sin plantillas",
  "Tecnología moderna y escalable",
] as const;

/** Rejilla técnica de fondo, atenuada hacia los bordes con una máscara radial. */
const GRID_LINE = "rgba(255,255,255,0.05)";
const GRID_MASK = "radial-gradient(ellipse at center, black 35%, transparent 75%)";
const GRID_STYLE: CSSProperties = {
  backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
  backgroundSize: "64px 64px",
  maskImage: GRID_MASK,
  WebkitMaskImage: GRID_MASK,
};

/* ============================ Section ============================ */

/**
 * Bloque "somos tu aliado tecnológico": amplía el alcance de la marca más allá
 * de la página web.
 *
 * Es la única sección oscura en mitad del recorrido, y esa inversión de
 * contraste es intencional: dentro de una paleta monocromática es la forma de
 * hacerla destacar sin introducir color, que rompería el sistema.
 */
export function SoftwareSolutions() {
  return (
    <section id="soluciones" className="relative overflow-hidden bg-brand-dark">
      {/* Fondo: rejilla técnica difuminada hacia los bordes + halos radiales.
          La rejilla va en `style` porque combina imagen, tamaño y máscara: en
          utilidades sería una cadena arbitraria ilegible. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={GRID_STYLE} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.10),transparent_45%),radial-gradient(circle_at_88%_78%,rgba(255,255,255,0.07),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32">
        {/* Encabezado: texto a la izquierda, mockup a la derecha (como el hero). */}
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-white/70">
              <Sparkles size={14} />
              Aliado tecnológico
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-display-lg">
              Desarrollamos soluciones de software a la medida
            </h2>
            <p className="mt-5 max-w-xl text-base leading-[1.7] text-white/70 md:text-body">
              Quimora Tech no se queda en la página web. Diseñamos, desarrollamos y ponemos en
              producción el software que tu negocio necesita: desde una landing que capta clientes
              hasta sistemas internos que ordenan toda tu operación.
            </p>
            <p className="mt-4 max-w-xl text-base leading-[1.7] text-white/70 md:text-body">
              Un solo equipo de principio a fin, con la misma exigencia de velocidad, seguridad y
              medición en cada proyecto.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {CAPABILITIES.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-caption text-white/75"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <SolutionsMockup />
        </div>

        {/* Catálogo de soluciones */}
        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SOLUTIONS.map((solution, i) => (
            // El escalonado se reinicia cada 4 tarjetas: con 12 en pantalla, una
            // cascada continua dejaría la última esperando casi un segundo.
            <SolutionCard key={solution.title} solution={solution} index={i % 4} />
          ))}
        </div>

        {/* Cierre + CTA */}
        <div className="mt-16 rounded-2xl border border-white/15 bg-white/[0.04] p-8 text-center md:p-12">
          <h3 className="mx-auto max-w-2xl font-display text-2xl font-semibold leading-[1.25] text-white md:text-display-sm">
            Cuéntanos tu idea y desarrollamos la solución tecnológica que tu negocio necesita
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-ui leading-[1.7] text-white/65 md:text-base">
            No importa si ya tienes claro qué quieres o apenas es una idea suelta: lo aterrizamos
            contigo y te decimos qué se puede construir, en cuánto tiempo y con qué inversión.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappHref(
                "Hola, quiero desarrollar una solución de software a la medida para mi negocio",
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("contact", { method: "whatsapp", location: "soluciones" })}
              className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-md bg-white px-8 font-display text-ui font-semibold text-brand transition duration-200 hover:bg-white/90 sm:w-auto active:scale-[0.98] ${LIGHT_RING}`}
            >
              Escribir por WhatsApp
              <ArrowRight size={18} />
            </a>
            <a
              href="#contacto"
              className={`inline-flex h-14 w-full items-center justify-center rounded-md border-2 border-white/40 bg-transparent px-8 font-display text-ui font-semibold text-white transition duration-200 hover:bg-white/10 sm:w-auto active:scale-[0.98] ${LIGHT_RING}`}
            >
              Solicitar cotización
            </a>
          </div>
          <p className="mt-7 text-xs text-white/50">
            Asesoría inicial sin costo · Te respondemos en menos de 24 horas
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================ Card ============================ */

function SolutionCard({ solution, index }: { solution: Solution; index: number }) {
  const { icon: Icon, title, body } = solution;

  return (
    <Reveal index={index} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-[translate,border-color,background-color] duration-200 ease-out hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]">
        {/* Brillo cenital que aparece al pasar el cursor. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.14),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="relative grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/10 text-white transition-colors duration-200 group-hover:bg-white group-hover:text-brand-dark">
          <Icon size={21} strokeWidth={1.8} />
        </div>
        <h3 className="relative mt-5 font-display text-body font-semibold leading-snug text-white">
          {title}
        </h3>
        <p className="relative mt-2.5 text-sm leading-[1.65] text-white/60">{body}</p>
      </article>
    </Reveal>
  );
}

/* ============================ Mockup ============================ */

/**
 * Mockup de un panel de gestión: da cuerpo visual a "software", no solo a
 * "página web". Las animaciones arrancan al entrar en pantalla —no en la carga—
 * porque la sección vive muy por debajo del pliegue.
 */
function SolutionsMockup() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  // Con movimiento reducido `useInView` responde `true` de inmediato y las
  // clases `animate-*` quedan neutralizadas en CSS: el mockup se ve completo,
  // nunca atrapado en `opacity-0`.
  //
  // El retardo viaja por `style` y no como `[--delay:…]`: Tailwind compila las
  // clases leyendo el código fuente, así que una construida en tiempo de
  // ejecución no existiría en el CSS final.
  const fade = (delay: string) => ({
    className: inView ? "animate-fade-in" : "opacity-0",
    style: { "--delay": delay } as CSSProperties,
  });

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-8 rounded-full bg-white/10 blur-3xl"
      />
      <svg
        viewBox="0 0 420 300"
        className="relative h-auto w-full drop-shadow-2xl"
        fill="none"
        role="img"
        aria-label="Ilustración de un panel de gestión con indicadores, una gráfica de crecimiento y un módulo de integraciones"
      >
        {/* Ventana */}
        <rect
          x="30"
          y="24"
          width="360"
          height="248"
          rx="12"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.2"
        />
        {/* Barra de título */}
        <line x1="30" y1="58" x2="390" y2="58" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
        <circle cx="50" cy="41" r="3.5" fill="rgba(255,255,255,0.35)" />
        <circle cx="64" cy="41" r="3.5" fill="rgba(255,255,255,0.22)" />
        <circle cx="78" cy="41" r="3.5" fill="rgba(255,255,255,0.22)" />
        <rect x="150" y="36" width="120" height="10" rx="5" fill="rgba(255,255,255,0.08)" />

        {/* Barra lateral */}
        <line
          x1="116"
          y1="58"
          x2="116"
          y2="272"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.2"
        />
        <g {...fade("0.15s")}>
          <rect x="44" y="78" width="56" height="8" rx="4" fill="rgba(255,255,255,0.42)" />
          <rect x="44" y="100" width="48" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
          <rect x="44" y="122" width="52" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
          <rect x="44" y="144" width="40" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
        </g>

        {/* Indicadores */}
        <g {...fade("0.3s")}>
          {[132, 216, 300].map((x, i) => (
            <g key={x}>
              <rect
                x={x}
                y="78"
                width="74"
                height="46"
                rx="8"
                fill="rgba(255,255,255,0.06)"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
              <rect x={x + 12} y="90" width="26" height="6" rx="3" fill="rgba(255,255,255,0.28)" />
              <rect
                x={x + 12}
                y="103"
                width={44 - i * 8}
                height="9"
                rx="4.5"
                fill="rgba(255,255,255,0.5)"
              />
            </g>
          ))}
        </g>

        {/* Panel de la gráfica */}
        <rect
          x="132"
          y="140"
          width="242"
          height="112"
          rx="8"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <line x1="146" y1="238" x2="360" y2="238" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {/* --len (250) supera la longitud real del trazo (~239 px) para que
            termine de dibujarse justo al final de la animación. */}
        <polyline
          points="152,226 194,200 236,210 278,176 320,186 358,156"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={inView ? "animate-draw-stroke [--len:250]" : "opacity-0"}
        />
        <circle cx="278" cy="176" r="3.5" fill="#ffffff" {...fade("1s")} />
        <circle cx="358" cy="156" r="4.5" fill="#ffffff" {...fade("1.5s")} />

        {/* Módulo flotante: integraciones / automatización */}
        <g {...fade("0.75s")}>
          <rect
            x="248"
            y="218"
            width="140"
            height="66"
            rx="10"
            fill="#09090b"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.2"
          />
          <line
            x1="272"
            y1="240"
            x2="266"
            y2="258"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
          />
          <line
            x1="272"
            y1="240"
            x2="284"
            y2="258"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
          />
          <circle cx="272" cy="238" r="4.5" fill="#ffffff" />
          <circle cx="265" cy="260" r="3.5" fill="rgba(255,255,255,0.55)" />
          <circle cx="285" cy="260" r="3.5" fill="rgba(255,255,255,0.55)" />
          <rect x="302" y="236" width="66" height="8" rx="4" fill="rgba(255,255,255,0.38)" />
          <rect x="302" y="252" width="44" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
        </g>
      </svg>
    </div>
  );
}
