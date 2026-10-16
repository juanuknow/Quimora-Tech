import { useEffect, useState, type CSSProperties } from "react";
import { useInView } from "../lib/hooks";

/**
 * Marco del visual de la sección: el mockup SVG hace de placeholder y el vídeo
 * ambiental se funde encima cuando está listo.
 *
 * El SVG no es un adorno redundante — es lo que sostiene el encuadre mientras
 * el vídeo no existe: ocupa el hueco (sin salto de layout), se ve completo si
 * el vídeo falla o el usuario pide movimiento reducido, y es lo único que
 * aparece en el HTML servido. El vídeo nunca es la única versión del bloque.
 */
export function SolutionsVisual() {
  // rootMargin adelanta el disparo ~250px antes de que el bloque entre en el
  // viewport: el vídeo ya está descargando cuando el usuario lo alcanza, en
  // vez de arrancar justo al 25% de visibilidad y notarse el fundido tarde.
  const { ref, inView } = useInView<HTMLDivElement>(0, "250px");
  const [videoReady, setVideoReady] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  // El `src` solo se monta al acercarse la sección al viewport: así el vídeo
  // no compite por ancho de banda con la carga inicial —vive muy por debajo
  // del pliegue— y quien nunca baja hasta aquí no lo descarga jamás.
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlayVideo(true);
  }, [inView]);

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-8 rounded-full bg-white/10 blur-3xl"
      />
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/15 bg-brand-dark shadow-2xl">
        <SolutionsMockup />
        {playVideo && (
          <video
            src="/videos/soluciones.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* Viñeta: funde los bordes del vídeo con el negro de la sección para
            que se lea como parte del fondo y no como un recuadro pegado. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(9,9,11,0.85)_100%)]"
        />
      </div>
    </div>
  );
}

/**
 * Mockup de un panel de gestión: da cuerpo visual a "software", no solo a
 * "página web". Las animaciones arrancan al entrar en pantalla —no en la carga—
 * porque la sección vive muy por debajo del pliegue.
 */
function SolutionsMockup() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);

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
    <svg
      ref={ref}
      viewBox="0 0 420 300"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
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
      <line x1="116" y1="58" x2="116" y2="272" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
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
  );
}
