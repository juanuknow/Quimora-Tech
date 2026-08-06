import { WhatsAppIcon } from "./WhatsAppIcon";
import { FOCUS_RING, whatsappHref, trackEvent } from "../lib/site";

/* -------------------- Floating WhatsApp -------------------- */
export function FloatingWhatsApp() {
  return (
    // La entrada vive en el contenedor y el hover en el enlace: si compartieran
    // elemento, el `scale` final de la animación anularía el `hover:scale-110`.
    // Entra ~1,2 s después de la carga, ya asentado el hero.
    <div className="animate-pop-in-bounce fixed bottom-5 right-5 z-50 [--delay:1200ms] md:bottom-8 md:right-8">
      <span
        aria-hidden="true"
        className="animate-soft-ping pointer-events-none absolute inset-0 rounded-full bg-brand/40"
      />
      <a
        href={whatsappHref("Hola, quiero más información sobre sus servicios")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp"
        onClick={() => trackEvent("contact", { method: "whatsapp", location: "floating" })}
        className={`relative grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-lg transition-[scale] duration-200 hover:scale-110 active:scale-[0.98] ${FOCUS_RING}`}
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}
