import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Boxes,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Check,
  Copy,
  ClipboardList,
  CreditCard,
  Globe,
  MessageCircle,
  Receipt,
  RefreshCw,
  Rocket,
  RotateCcw,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  BUSINESS_OPTIONS,
  DIAGNOSIS_INTRO,
  DIAGNOSIS_START_EVENT,
  type BusinessId,
  type DiagnosisStartDetail,
} from "../lib/diagnosis";
import {
  GOAL_OPTIONS,
  MAX_SELECTIONS,
  NEED_OPTIONS,
  PRIORITY_OPTIONS,
  SITUATION_OPTIONS,
  buildWhatsAppMessage,
  businessLabel,
  complementTitle,
  recommend,
  type AnswerOption,
  type CompleteAnswers,
  type GoalId,
  type NeedId,
  type PriorityId,
  type Recommendation,
  type SituationId,
} from "../lib/diagnosis-engine";
import { markInvite } from "../lib/diagnosis-invite";
import { getLastAnswers, saveLastAnswers } from "../lib/diagnosis-result";
import { getService } from "../lib/services-data";
import { FOCUS_RING, LIGHT_RING, trackEvent } from "../lib/site";
import { NewTabHint } from "./NewTabHint";

/* ============================ Datos de interfaz ============================ */

/** Opción del motor con su icono (el motor es puro y no conoce iconos). */
type UiAnswerOption<T extends string> = AnswerOption<T> & { icon: LucideIcon };

function withIcons<T extends string>(
  options: readonly AnswerOption<T>[],
  icons: Record<T, LucideIcon>,
): UiAnswerOption<T>[] {
  return options.map((o) => ({ ...o, icon: icons[o.id] }));
}

const SITUATION_UI = withIcons<SituationId>(SITUATION_OPTIONS, {
  S1: Globe,
  S2: MessageCircle,
  S3: TrendingDown,
  S4: RefreshCw,
  S5: ShoppingCart,
});
const NEED_UI = withIcons<NeedId>(NEED_OPTIONS, {
  N1: Search,
  N2: ShoppingBag,
  N3: CalendarCheck,
  N4: Boxes,
  N5: Receipt,
  N6: Zap,
  N7: BadgeCheck,
});
const GOAL_UI = withIcons<GoalId>(GOAL_OPTIONS, {
  O1: Users,
  O2: CreditCard,
  O3: CalendarClock,
  O4: ClipboardList,
  O5: Award,
});
const PRIORITY_UI = withIcons<PriorityId>(PRIORITY_OPTIONS, {
  P1: Rocket,
  P2: CalendarDays,
  P3: CalendarClock,
  P4: Search,
});

const TOTAL_STEPS = 5;
const DIALOG_ID = "diagnosis-dialog";
const TITLE_ID = "diagnosis-dialog-title";

interface Draft {
  business: BusinessId | null;
  situation: SituationId | null;
  needs: readonly NeedId[];
  goals: readonly GoalId[];
  priority: PriorityId | null;
}
const EMPTY: Draft = { business: null, situation: null, needs: [], goals: [], priority: null };
const STEP_KEYS = ["business", "situation", "needs", "goals", "priority"] as const;

function isAnswered(d: Draft, key: (typeof STEP_KEYS)[number]): boolean {
  const value = d[key];
  return Array.isArray(value) ? value.length > 0 : value !== null;
}

function isComplete(d: Draft): d is CompleteAnswers {
  return STEP_KEYS.every((k) => isAnswered(d, k));
}

/* ============================ Ventana ============================ */

/**
 * Ventana única del Diagnóstico Digital Gratuito (FR-013a). La abren la sección
 * `#diagnostico`, los atajos, la invitación y el botón flotante con `requestDiagnosis`.
 *
 * `<dialog>` nativo con `showModal()`: capa superior, fondo inerte y Escape
 * gratis (evento `cancel`). En escritorio no se bloquea el desplazamiento del
 * `body` (ocultar la barra movería el diseño); en móvil ocupa toda la pantalla
 * y sí lo bloquea, como el menú del navbar.
 */
export function DiagnosisDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const restoreOverflowRef = useRef<string | null>(null);
  /** Evita repetir `diagnosis_result_view` al volver a renderizar el mismo resultado. */
  const resultViewedRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"questions" | "result">("questions");
  const [step, setStep] = useState(0);
  const [startStep, setStartStep] = useState(0);
  const [answers, setAnswers] = useState<Draft>(EMPTY);
  const [showError, setShowError] = useState(false);

  // Apertura por evento (sección, atajos, invitación).
  useEffect(() => {
    const onStart = (e: Event) => {
      const detail = (e as CustomEvent<DiagnosisStartDetail>).detail;
      const dialog = dialogRef.current;
      if (!detail || !dialog || dialog.open) return;
      const first = detail.business ? 1 : 0;
      const lastAnswers = detail.showLastResult ? getLastAnswers() : null;
      openerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setAnswers(lastAnswers ?? { ...EMPTY, business: detail.business ?? null });
      setStep(first);
      setStartStep(first);
      setPhase(lastAnswers ? "result" : "questions");
      setShowError(false);
      setOpen(true);
      resultViewedRef.current = false;
      // Volver a ver un resultado no es empezar un diagnóstico.
      if (!lastAnswers) trackEvent("diagnosis_start", { source: detail.source });
      if (window.matchMedia("(max-width: 767.98px)").matches) {
        restoreOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
      dialog.showModal();
    };
    window.addEventListener(DIAGNOSIS_START_EVENT, onStart);
    return () => window.removeEventListener(DIAGNOSIS_START_EVENT, onStart);
  }, []);

  // Cierre (botón, Escape o `dialog.close()`): restaurar desplazamiento y foco.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      if (restoreOverflowRef.current !== null) {
        document.body.style.overflow = restoreOverflowRef.current;
        restoreOverflowRef.current = null;
      }
      setOpen(false);
      const opener = openerRef.current;
      openerRef.current = null;
      if (opener && opener.isConnected) opener.focus();
      else document.getElementById("main")?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Cada pantalla nueva lleva el foco a su encabezado, para lectores de pantalla y teclado.
  useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [open, step, phase]);

  const recommendation = useMemo<Recommendation | null>(
    () => (phase === "result" && isComplete(answers) ? recommend(answers) : null),
    [phase, answers],
  );

  // Llegar al resultado, por cualquier vía, evita que la invitación vuelva a aparecer (FR-002),
  // y se mide una sola vez por resultado mostrado (FR-025).
  useEffect(() => {
    if (!open || !recommendation) return;
    markInvite("completed");
    if (!resultViewedRef.current) {
      resultViewedRef.current = true;
      trackEvent("diagnosis_result_view", { solution_id: recommendation.primary });
    }
  }, [open, recommendation]);

  const answered = isAnswered(answers, STEP_KEYS[step]);

  const next = () => {
    if (!answered) {
      setShowError(true);
      return;
    }
    setShowError(false);
    // Solo el número de pregunta: nunca la respuesta (FR-026).
    trackEvent("diagnosis_question_answered", { step: step + 1 });
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      return;
    }
    if (isComplete(answers)) {
      trackEvent("diagnosis_complete", { solution_id: recommend(answers).primary });
      saveLastAnswers(answers);
    }
    setPhase("result");
  };
  const back = () => {
    setShowError(false);
    setStep((s) => Math.max(0, s - 1));
  };
  const restart = () => {
    resultViewedRef.current = false;
    setAnswers(EMPTY);
    setStep(0);
    setStartStep(0);
    setShowError(false);
    setPhase("questions");
  };
  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      id={DIALOG_ID}
      aria-labelledby={TITLE_ID}
      className="m-auto w-full max-w-[720px] overflow-hidden rounded-2xl border border-hairline bg-background p-0 text-foreground shadow-2xl backdrop:bg-brand-dark/60 max-md:h-dvh max-md:max-h-dvh max-md:max-w-none max-md:rounded-none max-md:border-0 md:max-h-[min(92dvh,880px)]"
    >
      {open && (
        <div className="flex flex-col max-md:h-dvh md:max-h-[min(92dvh,880px)]">
          <header className="flex items-center justify-between gap-4 border-b border-hairline px-6 py-4 md:px-8">
            <p
              id={TITLE_ID}
              className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-brand"
            >
              <Sparkles size={16} aria-hidden="true" />
              Diagnóstico Digital Gratuito
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar diagnóstico"
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-md text-foreground transition-colors duration-150 hover:bg-brand-soft active:scale-[0.98] ${FOCUS_RING}`}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8 md:px-10 md:py-10">
            {phase === "questions" ? (
              <Questions
                step={step}
                showIntro={step === 0 && startStep === 0}
                answers={answers}
                setAnswers={(d) => {
                  setShowError(false);
                  setAnswers(d);
                }}
                showError={showError}
                onNext={next}
                onBack={back}
                headingRef={headingRef}
              />
            ) : recommendation && isComplete(answers) ? (
              <Result
                answers={answers}
                rec={recommendation}
                onRestart={restart}
                headingRef={headingRef}
              />
            ) : null}
          </div>
        </div>
      )}
    </dialog>
  );
}

/* ============================ Preguntas ============================ */

interface QuestionsProps {
  step: number;
  showIntro: boolean;
  answers: Draft;
  setAnswers: (d: Draft) => void;
  showError: boolean;
  onNext: () => void;
  onBack: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}

function Questions({
  step,
  showIntro,
  answers,
  setAnswers,
  showError,
  onNext,
  onBack,
  headingRef,
}: QuestionsProps) {
  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const errorId = "diagnosis-step-error";

  return (
    <div className="motion-safe:animate-rise-in">
      {showIntro && (
        <p className="mb-8 rounded-xl bg-brand-soft px-5 py-4 text-ui leading-[1.6] text-foreground">
          {DIAGNOSIS_INTRO}
        </p>
      )}

      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span className="font-display uppercase tracking-widest">
          Pregunta {step + 1} de {TOTAL_STEPS}
        </span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-hairline"
        role="progressbar"
        aria-label="Progreso del diagnóstico"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step + 1}
        aria-valuetext={`Pregunta ${step + 1} de ${TOTAL_STEPS}`}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out-strong"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8">
        {step === 0 && (
          <SingleSelect
            title="¿Qué tipo de negocio tienes?"
            headingRef={headingRef}
            options={BUSINESS_OPTIONS}
            value={answers.business}
            onChange={(id) => setAnswers({ ...answers, business: id })}
            describedBy={showError ? errorId : undefined}
          />
        )}
        {step === 1 && (
          <SingleSelect
            title="¿Cuál es la situación digital de tu negocio hoy?"
            headingRef={headingRef}
            options={SITUATION_UI}
            value={answers.situation}
            onChange={(id) => setAnswers({ ...answers, situation: id })}
            columns="one"
            describedBy={showError ? errorId : undefined}
          />
        )}
        {step === 2 && (
          <MultiSelect
            title="¿Qué es lo que más necesitas resolver?"
            headingRef={headingRef}
            options={NEED_UI}
            value={answers.needs}
            onChange={(ids) => setAnswers({ ...answers, needs: ids })}
            describedBy={showError ? errorId : undefined}
          />
        )}
        {step === 3 && (
          <MultiSelect
            title="¿Qué objetivo comercial quieres alcanzar?"
            headingRef={headingRef}
            options={GOAL_UI}
            value={answers.goals}
            onChange={(ids) => setAnswers({ ...answers, goals: ids })}
            describedBy={showError ? errorId : undefined}
          />
        )}
        {step === 4 && (
          <SingleSelect
            title="¿Cuándo te gustaría empezar?"
            headingRef={headingRef}
            options={PRIORITY_UI}
            value={answers.priority}
            onChange={(id) => setAnswers({ ...answers, priority: id })}
            columns="one"
            describedBy={showError ? errorId : undefined}
          />
        )}
      </div>

      <p id={errorId} role="alert" className="mt-4 min-h-6 text-ui text-destructive-strong">
        {showError ? "Elige una opción para continuar." : ""}
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 0}
          className={`inline-flex h-11 items-center gap-1.5 rounded-md px-4 font-display text-sm font-semibold text-foreground transition-colors duration-150 hover:text-brand disabled:invisible active:scale-[0.98] ${FOCUS_RING}`}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          className={`inline-flex h-12 items-center gap-2 rounded-md bg-cta px-7 font-display text-sm font-semibold text-white transition-colors duration-200 hover:bg-cta-hover active:scale-[0.98] ${FOCUS_RING}`}
        >
          {step === TOTAL_STEPS - 1 ? "Ver mi diagnóstico" : "Siguiente"}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ============================ Selectores ============================ */

type SelectOption<T extends string> = AnswerOption<T> & { icon: LucideIcon };

function optionClass(selected: boolean, blocked = false): string {
  const state = selected
    ? "border-brand bg-brand-soft shadow-sm active:scale-[0.98]"
    : blocked
      ? "cursor-not-allowed border-hairline bg-background opacity-60"
      : "border-hairline bg-background hover:border-brand/40 hover:bg-brand-soft/40 active:scale-[0.98]";
  return `flex min-h-14 items-center gap-3 rounded-xl border p-4 text-left transition-[border-color,background-color,box-shadow] duration-150 ${FOCUS_RING} ${state}`;
}

function OptionContent({
  icon: Icon,
  label,
  selected,
}: {
  icon: LucideIcon;
  label: string;
  selected: boolean;
}) {
  return (
    <>
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
          selected ? "bg-brand text-white" : "bg-brand-soft text-brand"
        }`}
      >
        <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="font-display text-ui font-medium text-foreground">{label}</span>
    </>
  );
}

function StepHeading({
  id,
  title,
  headingRef,
}: {
  id: string;
  title: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <h2
      id={id}
      ref={headingRef}
      tabIndex={-1}
      className="font-display text-xl font-semibold text-brand outline-none md:text-2xl"
    >
      {title}
    </h2>
  );
}

/**
 * Grupo de casillas con límite: el orden de elección es la prioridad y se ve en
 * cada opción. Al llegar al límite las demás quedan `aria-disabled`, sin salir
 * del orden de tabulación, para que sigan siendo legibles con lector de pantalla.
 */
function MultiSelect<T extends string>({
  title,
  headingRef,
  options,
  value,
  onChange,
  describedBy,
}: {
  title: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  options: readonly SelectOption<T>[];
  value: readonly T[];
  onChange: (ids: readonly T[]) => void;
  describedBy?: string;
}) {
  const headingId = useId();
  const hintId = useId();
  const atLimit = value.length >= MAX_SELECTIONS;

  const toggle = (id: T) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else if (!atLimit) onChange([...value, id]);
  };

  return (
    <div>
      <StepHeading id={headingId} title={title} headingRef={headingRef} />
      <p id={hintId} className="mt-2 text-ui text-muted-foreground">
        Elige hasta {MAX_SELECTIONS}, empezando por la más importante.
      </p>
      <div
        role="group"
        aria-labelledby={headingId}
        aria-describedby={describedBy ? `${hintId} ${describedBy}` : hintId}
        className="mt-6 grid gap-3"
      >
        {options.map(({ id, label, icon }) => {
          const rank = value.indexOf(id) + 1;
          const selected = rank > 0;
          const blocked = !selected && atLimit;
          return (
            <button
              key={id}
              type="button"
              role="checkbox"
              aria-checked={selected}
              aria-disabled={blocked || undefined}
              onClick={() => toggle(id)}
              className={optionClass(selected, blocked)}
            >
              <OptionContent icon={icon} label={label} selected={selected} />
              {selected && (
                <span className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand font-display text-caption font-semibold text-white">
                  <span className="sr-only">Prioridad </span>
                  {rank}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p role="status" className="mt-3 text-caption text-muted-foreground">
        {value.length} de {MAX_SELECTIONS} elegidas
        {atLimit ? ". Para cambiar una, quítala primero." : ""}
      </p>
    </div>
  );
}

/* Selección única (radiogroup) */

/**
 * Patrón WAI-ARIA de radiogroup: un solo tab-stop (la opción elegida o, si aún
 * no hay ninguna, la primera) y las flechas, Inicio y Fin mueven la selección.
 */
function SingleSelect<T extends string>({
  title,
  headingRef,
  options,
  value,
  onChange,
  columns = "grid",
  describedBy,
}: {
  title: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (id: T) => void;
  columns?: "grid" | "one";
  describedBy?: string;
}) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = options.findIndex((o) => o.id === value);
  const tabStop = selectedIndex === -1 ? 0 : selectedIndex;
  const headingId = useId();

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = options.length - 1;
    let next: number;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(options[next].id);
    buttonRefs.current[next]?.focus();
  };

  return (
    <div>
      <StepHeading id={headingId} title={title} headingRef={headingRef} />
      <div
        role="radiogroup"
        aria-labelledby={headingId}
        aria-describedby={describedBy}
        className={`mt-6 grid gap-3 ${
          columns === "one" ? "sm:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {options.map(({ id, label, icon }, index) => {
          const selected = value === id;
          return (
            <button
              key={id}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={index === tabStop ? 0 : -1}
              onClick={() => onChange(id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={optionClass(selected)}
            >
              <OptionContent icon={icon} label={label} selected={selected} />
              {selected && (
                <Check size={18} className="ml-auto shrink-0 text-brand" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ Resultado ============================ */

function Result({
  answers,
  rec,
  onRestart,
  headingRef,
}: {
  answers: CompleteAnswers;
  rec: Recommendation;
  onRestart: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const primary = getService(rec.primary);
  const sectionTitle =
    "font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground";

  return (
    <div className="motion-safe:animate-rise-in">
      {/* 1. Encabezado */}
      <div className="text-center">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-2xl font-semibold tracking-tight text-brand outline-none md:text-display-sm"
        >
          ¡Tu diagnóstico está listo!
        </h2>
        <p className="mt-2 text-caption text-muted-foreground">
          {businessLabel(answers.business)} · Es una orientación, no una auditoría técnica.
        </p>
      </div>

      {/* 2. Situación · 3. Necesidad */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-background p-5">
          <p className={sectionTitle}>Tu situación</p>
          <p className="mt-2 text-ui leading-[1.6] text-foreground">{rec.situationSummary}</p>
        </div>
        <div className="rounded-xl border border-hairline bg-background p-5">
          <p className={sectionTitle}>
            {rec.needLabels.length > 1 ? "Lo que necesitas resolver" : "Necesidad principal"}
          </p>
          <ul className="mt-2 grid gap-1">
            {rec.needLabels.map((label) => (
              <li key={label} className="font-display text-ui font-semibold text-brand">
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Solución · explicación */}
      <section
        aria-labelledby="diagnosis-solution"
        className="mt-6 rounded-xl border border-brand/20 bg-brand-soft/50 p-6 md:p-8"
      >
        <p className={sectionTitle}>Solución recomendada</p>
        <h3
          id="diagnosis-solution"
          className="mt-2 font-display text-xl font-semibold text-brand md:text-2xl"
        >
          {primary.title}
        </h3>
        <p className="mt-3 text-ui leading-[1.6] text-foreground">{rec.explanation}</p>

        {/* 5. Complementos */}
        {rec.complements.length > 0 && (
          <div className="mt-6">
            <p className={sectionTitle}>Complementos recomendados</p>
            <ul className="mt-3 grid gap-3">
              {rec.complements.map((c) => (
                <li
                  key={complementTitle(c)}
                  className="rounded-lg border border-hairline bg-background p-4"
                >
                  <p className="font-display text-ui font-semibold text-foreground">
                    {complementTitle(c)}
                  </p>
                  <p className="mt-1 text-caption leading-[1.5] text-muted-foreground">
                    {c.reason}.
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Con varias opciones marcadas: qué atiende cada una (R-C3, R-C6). */}
      {rec.coverage.length > 2 && (
        <section aria-labelledby="diagnosis-coverage" className="mt-6">
          <h3 id="diagnosis-coverage" className="font-display text-lg font-semibold text-brand">
            Cómo cubre esto lo que marcaste
          </h3>
          <ul className="mt-3 grid gap-3">
            {rec.coverage.map((item) => (
              <li key={item.label} className="flex items-start gap-2 text-ui">
                {item.solution ? (
                  <Check size={16} className="mt-1 shrink-0 text-success" aria-hidden="true" />
                ) : (
                  <MessageCircle
                    size={16}
                    className="mt-1 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
                <span>
                  <span className="block font-medium text-foreground">{item.label}</span>
                  <span className="block text-caption text-muted-foreground">
                    {item.solution ?? "Lo revisamos contigo en la asesoría"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6. Cómo trabajaría · 7. Beneficios */}
      <section aria-labelledby="diagnosis-how" className="mt-6">
        <h3 id="diagnosis-how" className="font-display text-lg font-semibold text-brand">
          Cómo trabajaría la solución
        </h3>
        {rec.howItWorks.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="mt-3 text-ui leading-[1.6] text-foreground/85">
            {paragraph}
          </p>
        ))}
        {rec.benefits.length > 0 && (
          <>
            <h3 className="mt-6 font-display text-lg font-semibold text-brand">
              Beneficios funcionales
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {rec.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-ui text-foreground">
                  <Check size={16} className="mt-1 shrink-0 text-success" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* 8. Plazo: se omite mientras no haya correspondencia aprobada (FR-018b). */}

      {/* 9. Próximo paso */}
      <section
        aria-labelledby="diagnosis-next"
        className="mt-8 rounded-xl bg-brand p-6 text-white md:p-8"
      >
        <h3 id="diagnosis-next" className="font-display text-xl font-semibold md:text-2xl">
          Próximo paso: asesoría personalizada
        </h3>
        <p className="mt-2 text-ui leading-[1.6] text-white/80">{rec.nextStep}</p>
        <p className="mt-4 text-ui leading-[1.6] text-white/80">
          Un asesor de Quimora Tech podrá revisar contigo esta recomendación y orientarte sobre la
          solución más adecuada para tu negocio.
        </p>
        {/* 10 y 11. Continuar por WhatsApp · Copiar mensaje */}
        <WhatsAppActions answers={answers} rec={rec} />
      </section>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onRestart}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 font-display text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-brand active:scale-[0.98] ${FOCUS_RING}`}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Volver a empezar
        </button>
      </div>
    </div>
  );
}

/* ============================ WhatsApp ============================ */

/**
 * Salida comercial del diagnóstico (US2). El mismo texto va al enlace de
 * WhatsApp y al portapapeles (FR-024). El clic registra la intención de
 * contactar, nunca un envío (FR-025a): WhatsApp se abre con el mensaje
 * prellenado y el visitante decide si lo envía.
 */
function WhatsAppActions({ answers, rec }: { answers: CompleteAnswers; rec: Recommendation }) {
  const message = useMemo(() => buildWhatsAppMessage(answers, rec), [answers, rec]);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const manualRef = useRef<HTMLTextAreaElement>(null);

  // Sin permiso de portapapeles: el mismo texto, ya seleccionado para copiarlo a mano.
  useEffect(() => {
    if (copyState === "manual") manualRef.current?.select();
  }, [copyState]);

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Portapapeles no disponible");
      await navigator.clipboard.writeText(message.text);
      setCopyState("copied");
    } catch {
      setCopyState("manual");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={message.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            // Intención de contactar (un clic), nunca un envío ni un lead recibido (FR-025a).
            trackEvent("diagnosis_whatsapp_click", { solution_id: rec.primary });
            trackEvent("generate_lead", { method: "whatsapp", source: "diagnostico" });
          }}
          className={`inline-flex h-14 items-center justify-center gap-2 rounded-md bg-white px-8 font-display text-ui font-semibold text-brand transition-colors duration-200 hover:bg-white/90 active:scale-[0.98] ${LIGHT_RING}`}
        >
          <MessageCircle size={18} aria-hidden="true" />
          Continuar por WhatsApp
          <NewTabHint />
        </a>
        <button
          type="button"
          onClick={copy}
          className={`inline-flex h-14 items-center justify-center gap-2 rounded-md border-2 border-white/40 px-6 font-display text-ui font-semibold text-white transition-colors duration-200 hover:bg-white/10 active:scale-[0.98] ${LIGHT_RING}`}
        >
          <Copy size={18} aria-hidden="true" />
          Copiar mensaje
        </button>
      </div>
      <p role="status" className="mt-3 min-h-5 text-caption text-white/80">
        {copyState === "copied" && "Mensaje copiado. Pégalo donde prefieras."}
        {copyState === "manual" &&
          "No se pudo copiar automáticamente: el mensaje está seleccionado abajo para que lo copies."}
      </p>
      {copyState === "manual" && (
        <textarea
          ref={manualRef}
          readOnly
          aria-label="Mensaje para copiar"
          value={message.text}
          rows={10}
          className="mt-2 w-full rounded-md border border-white/20 bg-white p-3 font-sans text-caption leading-[1.5] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        />
      )}
    </div>
  );
}
