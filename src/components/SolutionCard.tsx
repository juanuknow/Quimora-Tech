import { LIGHT_RING } from "../lib/site";
import type { Service } from "../lib/services-data";

const CARD_CLASS =
  "group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-[translate,border-color,background-color] duration-200 ease-out hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]";

/**
 * Tarjeta de una solución sobre fondo oscuro. Si el servicio tiene página propia
 * (`slug`) es un enlace a `/servicios/<slug>`; si no, un `article` informativo.
 */
export function SolutionCard({ solution }: { solution: Service }) {
  const { icon: Icon, title, body, slug } = solution;

  const content = (
    <>
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
    </>
  );

  return slug ? (
    <a href={`/servicios/${slug}`} className={`${CARD_CLASS} ${LIGHT_RING}`}>
      {content}
    </a>
  ) : (
    <article className={CARD_CLASS}>{content}</article>
  );
}
