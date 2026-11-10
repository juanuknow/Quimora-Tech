import type { CSSProperties } from "react";
import { useInView } from "../lib/hooks";

/** Marco de la ilustración SVG de una tienda online en navegador y móvil. */
export function SolutionsVisual() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-8 rounded-full bg-white/10 blur-3xl"
      />
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/15 bg-brand-dark shadow-2xl">
        <SolutionsMockup />
      </div>
    </div>
  );
}

/** Tienda online en navegador y móvil, con animaciones escalonadas al entrar en pantalla. */
function SolutionsMockup() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);

  // Con movimiento reducido `useInView` responde `true` de inmediato y las
  // clases `animate-*` quedan neutralizadas en CSS: la ilustración se ve completa.
  // El retardo usa `style` porque Tailwind no compila valores dinámicos de clase.
  const fade = (delay: string) => ({
    className: inView ? "animate-fade-in" : "opacity-0",
    style: { "--delay": delay } as CSSProperties,
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 270"
      className="absolute inset-0 h-full w-full"
      fill="none"
      role="img"
      aria-label="Ilustración de una tienda online en una ventana de navegador y en un teléfono, con productos, carrito y botón de compra"
    >
      {/* Ventana del navegador */}
      <rect
        x="40"
        y="20"
        width="400"
        height="222"
        rx="12"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />
      <line x1="40" y1="52" x2="440" y2="52" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
      <circle cx="58" cy="36" r="3.5" fill="rgba(255,255,255,0.35)" />
      <circle cx="72" cy="36" r="3.5" fill="rgba(255,255,255,0.22)" />
      <circle cx="86" cy="36" r="3.5" fill="rgba(255,255,255,0.22)" />
      {/* Barra de dirección con candado */}
      <rect x="170" y="30" width="140" height="12" rx="6" fill="rgba(255,255,255,0.08)" />
      <rect x="179" y="35.5" width="5" height="4" rx="1" fill="rgba(255,255,255,0.45)" />
      <path
        d="M180 35.5v-1.4a1.5 1.5 0 0 1 3 0v1.4"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.9"
      />
      <rect x="189" y="34" width="62" height="4" rx="2" fill="rgba(255,255,255,0.22)" />

      {/* Navegación de la tienda y carrito con contador */}
      <g {...fade("0.15s")}>
        <rect x="54" y="62" width="30" height="8" rx="4" fill="rgba(255,255,255,0.42)" />
        <rect x="170" y="63" width="24" height="6" rx="3" fill="rgba(255,255,255,0.16)" />
        <rect x="202" y="63" width="24" height="6" rx="3" fill="rgba(255,255,255,0.16)" />
        <rect x="234" y="63" width="24" height="6" rx="3" fill="rgba(255,255,255,0.16)" />
        <path
          d="M305 62h2.2l1.7 8.4h8.2l1.5-5.8h-10.6"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="310.3" cy="73.2" r="1.1" fill="rgba(255,255,255,0.6)" />
        <circle cx="316.3" cy="73.2" r="1.1" fill="rgba(255,255,255,0.6)" />
        <circle cx="321" cy="60.5" r="3.6" fill="#ffffff" />
      </g>

      {/* Portada: titular, botón y producto destacado */}
      <g {...fade("0.3s")}>
        <rect
          x="54"
          y="82"
          width="270"
          height="56"
          rx="8"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <rect x="68" y="93" width="122" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
        <rect x="68" y="105" width="86" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
        <rect x="68" y="119" width="52" height="12" rx="6" fill="#ffffff" />
        <rect x="77" y="123.5" width="34" height="3" rx="1.5" fill="#09090b" />
        <rect x="262" y="88" width="50" height="44" rx="8" fill="rgba(255,255,255,0.08)" />
        <path
          d="M276 105h22l-1.8 16h-18.4z"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M281.5 105v-3a5.5 5.5 0 0 1 11 0v3"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </g>

      {/* Primer producto */}
      <g {...fade("0.45s")}>
        <rect
          x="54"
          y="148"
          width="127"
          height="66"
          rx="8"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <rect x="62" y="156" width="111" height="28" rx="6" fill="rgba(255,255,255,0.07)" />
        <circle cx="117.5" cy="170" r="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        <rect x="62" y="191" width="52" height="6" rx="3" fill="rgba(255,255,255,0.28)" />
        <rect x="62" y="201" width="30" height="7" rx="3.5" fill="rgba(255,255,255,0.5)" />
        <circle cx="167" cy="204" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
        <path
          d="M164 204h6M167 201v6"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>

      {/* Segundo producto */}
      <g {...fade("0.6s")}>
        <rect
          x="197"
          y="148"
          width="127"
          height="66"
          rx="8"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <rect x="205" y="156" width="111" height="28" rx="6" fill="rgba(255,255,255,0.07)" />
        <rect
          x="252.5"
          y="162"
          width="16"
          height="16"
          rx="4"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2"
        />
        <rect x="205" y="191" width="44" height="6" rx="3" fill="rgba(255,255,255,0.28)" />
        <rect x="205" y="201" width="34" height="7" rx="3.5" fill="rgba(255,255,255,0.5)" />
        <circle cx="310" cy="204" r="7" fill="#ffffff" />
        <path d="M307 204h6M310 201v6" stroke="#09090b" strokeWidth="1.3" strokeLinecap="round" />
      </g>

      {/* Teléfono: la misma tienda en móvil */}
      <g {...fade("0.8s")}>
        <rect
          x="344"
          y="62"
          width="76"
          height="172"
          rx="12"
          fill="#09090b"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.4"
        />
        <rect x="371" y="68" width="22" height="4" rx="2" fill="rgba(255,255,255,0.22)" />
        <rect x="354" y="82" width="22" height="6" rx="3" fill="rgba(255,255,255,0.42)" />
        <rect x="400" y="82" width="10" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
        <rect x="354" y="96" width="56" height="38" rx="6" fill="rgba(255,255,255,0.08)" />
        <circle cx="382" cy="115" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        <rect x="354" y="142" width="42" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
        <rect x="354" y="153" width="26" height="7" rx="3.5" fill="rgba(255,255,255,0.5)" />
        <rect
          x="354"
          y="168"
          width="56"
          height="24"
          rx="6"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <rect x="360" y="174" width="12" height="12" rx="3" fill="rgba(255,255,255,0.12)" />
        <rect x="378" y="175" width="24" height="4" rx="2" fill="rgba(255,255,255,0.28)" />
        <rect x="378" y="182" width="15" height="4" rx="2" fill="rgba(255,255,255,0.16)" />
        <rect x="354" y="206" width="56" height="16" rx="8" fill="#ffffff" />
        <rect x="368" y="212.5" width="28" height="3" rx="1.5" fill="#09090b" />
      </g>

      {/* Aviso flotante: pedido confirmado */}
      <g {...fade("1.2s")}>
        <rect
          x="150"
          y="226"
          width="150"
          height="36"
          rx="10"
          fill="#09090b"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.2"
        />
        <circle cx="170" cy="244" r="8.5" fill="#ffffff" />
        <path
          d="M166 244.2l2.8 2.8 5.2-5.6"
          stroke="#09090b"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="187" y="236" width="78" height="7" rx="3.5" fill="rgba(255,255,255,0.38)" />
        <rect x="187" y="248" width="50" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
      </g>
    </svg>
  );
}
