import { BUSINESS_OPTIONS, requestDiagnosis, type BusinessId } from "../lib/diagnosis";
import { FOCUS_RING, trackEvent } from "../lib/site";

/** Los tipos de negocio más comunes; etiquetas e íconos salen de la fuente única del wizard. */
const SHORTCUT_IDS: readonly BusinessId[] = [
  "tienda-fisica",
  "tienda-online",
  "restaurante",
  "clinica",
  "otro",
];

const SHORTCUTS = BUSINESS_OPTIONS.filter((o) => SHORTCUT_IDS.includes(o.id));

/**
 * Franja entre "Especialistas" y el Diagnóstico: el visitante ya sabe qué
 * hacemos, y elegir su caso aquí le ahorra el primer paso del wizard.
 */
export function DiagnosisShortcuts() {
  return (
    <div className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[900px] px-6 py-14 text-center md:px-10">
        <h2 className="font-display text-subhead font-semibold text-brand">¿Cuál es tu caso?</h2>
        <p className="mx-auto mt-2 max-w-md text-ui text-foreground/70">
          Elige tu tipo de negocio y te armamos un diagnóstico gratuito en 2 minutos.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-3">
          {SHORTCUTS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => {
                  trackEvent("diagnosis_shortcut", { business: id });
                  requestDiagnosis(id);
                }}
                className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-hairline bg-background px-4 font-display text-ui font-semibold text-foreground transition-[transform,border-color,background-color] duration-150 ease-out-strong hover:border-brand hover:bg-brand-soft active:scale-[0.98] ${FOCUS_RING}`}
              >
                <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
