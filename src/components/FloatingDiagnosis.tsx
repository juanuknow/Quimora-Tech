import { useSyncExternalStore } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { requestDiagnosis } from "../lib/diagnosis";
import { getLastAnswers, subscribeLastAnswers } from "../lib/diagnosis-result";
import { FOCUS_RING } from "../lib/site";

const CONTROL = `inline-flex h-11 items-center rounded-full font-display text-caption font-semibold text-brand transition-colors duration-150 hover:bg-brand-soft active:scale-[0.98] ${FOCUS_RING}`;

/**
 * Acceso permanente al diagnóstico en la home. Sin un diagnóstico terminado lo
 * comienza; con uno terminado permite verlo o volver a empezar.
 *
 * El botón principal es el mismo elemento en ambos estados para que el foco
 * pueda volver a él al cerrar la ventana. `z-30` lo deja debajo de la barra de
 * navegación, su menú móvil y la tarjeta de invitación (`z-40`).
 */
export function FloatingDiagnosis() {
  const hasResult = useSyncExternalStore(
    subscribeLastAnswers,
    () => getLastAnswers() !== null,
    () => false,
  );

  return (
    <div className="animate-pop-in-bounce fixed bottom-6 left-5 z-30 flex items-center rounded-full border border-hairline bg-background p-0.5 shadow-lg [--delay:1400ms] md:bottom-9 md:left-8">
      <button
        type="button"
        onClick={() => requestDiagnosis({ source: "flotante", showLastResult: hasResult })}
        className={`${CONTROL} gap-2 px-4`}
      >
        <Sparkles size={16} className="max-[359px]:hidden" aria-hidden="true" />
        {hasResult ? (
          "Ver mi diagnóstico"
        ) : (
          <>
            <span className="md:hidden">Diagnóstico gratuito</span>
            <span className="max-md:hidden">Comenzar diagnóstico gratuito</span>
          </>
        )}
      </button>
      {hasResult && (
        <>
          <span aria-hidden="true" className="h-6 w-px bg-hairline" />
          <button
            type="button"
            onClick={() => requestDiagnosis({ source: "flotante" })}
            aria-label="Volver a empezar el diagnóstico"
            title="Volver a empezar"
            className={`${CONTROL} w-11 justify-center`}
          >
            <RotateCcw size={16} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
