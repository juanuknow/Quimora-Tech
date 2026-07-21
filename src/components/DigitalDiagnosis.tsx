import { useState } from "react";
import {
  Store,
  ShoppingBag,
  UtensilsCrossed,
  Coffee,
  Stethoscope,
  Scale,
  Building2,
  Briefcase,
  CircleEllipsis,
  Users,
  Globe,
  Zap,
  CalendarClock,
  CalendarCheck,
  MessageCircle,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  CalendarDays,
  FileText,
  Search,
  MessagesSquare,
  Languages,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  Clock,
  Cpu,
  Gauge,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { FOCUS_RING, whatsappHref, trackEvent } from "../lib/site";

/* ============================ Domain model ============================ */

type BusinessId =
  | "tienda-fisica"
  | "tienda-online"
  | "restaurante"
  | "cafeteria"
  | "clinica"
  | "abogado"
  | "inmobiliaria"
  | "empresa"
  | "otro";

type ObjectiveId =
  | "mas-clientes"
  | "vender-internet"
  | "automatizar"
  | "mostrar-empresa"
  | "reservas"
  | "agendar-citas";

type FeatureId =
  | "whatsapp"
  | "catalogo"
  | "pagos"
  | "panel"
  | "reservas"
  | "blog"
  | "seo"
  | "chat"
  | "multiidioma";

type TimingId = "asap" | "este-mes" | "dos-meses" | "investigando";

type BudgetId = "menos-500" | "500-1000" | "1000-3000" | "mas-3000" | "no-se";

interface Option<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

const BUSINESS_OPTIONS: Option<BusinessId>[] = [
  { id: "tienda-fisica", label: "Tienda física", icon: Store },
  { id: "tienda-online", label: "Tienda online", icon: ShoppingBag },
  { id: "restaurante", label: "Restaurante", icon: UtensilsCrossed },
  { id: "cafeteria", label: "Cafetería", icon: Coffee },
  { id: "clinica", label: "Clínica", icon: Stethoscope },
  { id: "abogado", label: "Abogado", icon: Scale },
  { id: "inmobiliaria", label: "Inmobiliaria", icon: Building2 },
  { id: "empresa", label: "Empresa", icon: Briefcase },
  { id: "otro", label: "Otro", icon: CircleEllipsis },
];

const OBJECTIVE_OPTIONS: Option<ObjectiveId>[] = [
  { id: "mas-clientes", label: "Conseguir más clientes", icon: Users },
  { id: "vender-internet", label: "Vender por Internet", icon: Globe },
  { id: "automatizar", label: "Automatizar procesos", icon: Zap },
  { id: "mostrar-empresa", label: "Mostrar mi empresa", icon: Building2 },
  { id: "reservas", label: "Recibir reservas", icon: CalendarClock },
  { id: "agendar-citas", label: "Agendar citas", icon: CalendarCheck },
];

const FEATURE_OPTIONS: Option<FeatureId>[] = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "catalogo", label: "Catálogo", icon: BookOpen },
  { id: "pagos", label: "Pagos en línea", icon: CreditCard },
  { id: "panel", label: "Panel administrativo", icon: LayoutDashboard },
  { id: "reservas", label: "Reservas", icon: CalendarDays },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "seo", label: "SEO", icon: Search },
  { id: "chat", label: "Chat", icon: MessagesSquare },
  { id: "multiidioma", label: "Multiidioma", icon: Languages },
];

const TIMING_OPTIONS: Option<TimingId>[] = [
  { id: "asap", label: "Lo antes posible", icon: Zap },
  { id: "este-mes", label: "Este mes", icon: CalendarCheck },
  { id: "dos-meses", label: "En 2 meses", icon: CalendarClock },
  { id: "investigando", label: "Solo estoy investigando", icon: Search },
];

const BUDGET_OPTIONS: Option<BudgetId>[] = [
  { id: "menos-500", label: "Menos de $500.000", icon: CircleEllipsis },
  { id: "500-1000", label: "$500.000 – $1.000.000", icon: CircleEllipsis },
  { id: "1000-3000", label: "$1.000.000 – $3.000.000", icon: CircleEllipsis },
  { id: "mas-3000", label: "Más de $3.000.000", icon: CircleEllipsis },
  { id: "no-se", label: "No lo sé todavía", icon: CircleEllipsis },
];

interface Answers {
  business: BusinessId | null;
  objective: ObjectiveId | null;
  features: FeatureId[];
  timing: TimingId | null;
  budget: BudgetId | null;
}

const EMPTY_ANSWERS: Answers = {
  business: null,
  objective: null,
  features: [],
  timing: null,
  budget: null,
};

/* ============================ Recommendation engine ============================ */

type SolutionKey = "ecommerce" | "reservas" | "citas" | "panel" | "corporativo" | "landing";
type Complexity = "Baja" | "Media" | "Alta";

interface Solution {
  name: string;
  tagline: string;
  /** Essential features (labels) the solution needs to deliver its objective. */
  essentials: string[];
  baseComplexity: Complexity;
  technologies: string[];
}

const SOLUTIONS: Record<SolutionKey, Solution> = {
  ecommerce: {
    name: "Tienda online (E-commerce)",
    tagline: "Vende tus productos 24/7 con pagos y catálogo automatizados.",
    essentials: [
      "Tienda online",
      "Pasarela de pagos",
      "Catálogo e inventario",
      "WhatsApp",
      "SEO",
      "Analytics",
    ],
    baseComplexity: "Media",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
  },
  reservas: {
    name: "Sistema de reservas",
    tagline: "Recibe reservas online sin llamadas ni mensajes manuales.",
    essentials: [
      "Módulo de reservas",
      "Confirmación automática",
      "WhatsApp",
      "Panel de gestión",
      "SEO",
      "Analytics",
    ],
    baseComplexity: "Media",
    technologies: ["React", "Node.js", "PostgreSQL"],
  },
  citas: {
    name: "Agendamiento de citas",
    tagline: "Tus clientes agendan solos y tú reduces las ausencias.",
    essentials: [
      "Agendamiento online",
      "Recordatorios automáticos",
      "WhatsApp",
      "Panel de gestión",
      "SEO",
      "Analytics",
    ],
    baseComplexity: "Media",
    technologies: ["React", "Node.js", "PostgreSQL"],
  },
  panel: {
    name: "Plataforma a medida",
    tagline: "Automatiza tus procesos internos y ahorra horas de trabajo.",
    essentials: [
      "Panel administrativo",
      "Automatizaciones",
      "Integraciones",
      "WhatsApp",
      "Analytics",
    ],
    baseComplexity: "Alta",
    technologies: ["React", "Node.js", "PostgreSQL", "APIs"],
  },
  corporativo: {
    name: "Sitio corporativo profesional",
    tagline: "Proyecta confianza y muestra tu empresa como un referente.",
    essentials: ["Diseño profesional", "WhatsApp", "SEO", "Analytics"],
    baseComplexity: "Baja",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
  },
  landing: {
    name: "Landing de conversión + SEO",
    tagline: "Convierte a tus visitantes en clientes con una página enfocada.",
    essentials: ["Landing optimizada", "WhatsApp", "SEO", "Chat", "Analytics"],
    baseComplexity: "Baja",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
  },
};

const COMPLEXITY_DATA: Record<Complexity, { time: string; budget: string; rank: number }> = {
  Baja: { time: "1 – 2 semanas", budget: "$650.000 – $1.200.000", rank: 1 },
  Media: { time: "3 – 4 semanas", budget: "$1.500.000 – $3.000.000", rank: 2 },
  Alta: { time: "6 – 8 semanas", budget: "$3.500.000 – $6.000.000", rank: 3 },
};

const BUDGET_RANK: Record<BudgetId, number> = {
  "menos-500": 1,
  "500-1000": 2,
  "1000-3000": 3,
  "mas-3000": 4,
  "no-se": 0,
};

/** Picks the solution that best fits the objective, refined by business type. */
function pickSolution(a: Answers): SolutionKey {
  const { objective, business, features } = a;

  if (objective === "vender-internet" || business === "tienda-online") return "ecommerce";
  if (business === "tienda-fisica" && (features.includes("pagos") || features.includes("catalogo")))
    return "ecommerce";

  if (objective === "reservas" || business === "restaurante" || business === "cafeteria")
    return "reservas";

  if (objective === "agendar-citas" || business === "clinica" || business === "abogado")
    return "citas";

  if (objective === "automatizar") return "panel";

  if (objective === "mostrar-empresa" || business === "empresa" || business === "inmobiliaria")
    return "corporativo";

  if (objective === "mas-clientes") return "landing";

  return "corporativo";
}

/** Raises complexity by one level, capped at "Alta". */
function bumpComplexity(c: Complexity): Complexity {
  if (c === "Baja") return "Media";
  if (c === "Media") return "Alta";
  return "Alta";
}

const FEATURE_LABEL: Record<FeatureId, string> = Object.fromEntries(
  FEATURE_OPTIONS.map((f) => [f.id, f.label]),
) as Record<FeatureId, string>;

const GAP_BY_SOLUTION: Record<SolutionKey, string> = {
  ecommerce: "aún no vende por Internet ni cobra en línea de forma automática",
  reservas: "todavía gestiona las reservas de forma manual, perdiendo tiempo y clientes",
  citas: "no permite a tus clientes agendar solos, lo que genera ausencias y llamadas innecesarias",
  panel: "depende de procesos manuales que consumen horas de trabajo cada semana",
  corporativo: "aún no proyecta una imagen profesional y confiable en Internet",
  landing: "no cuenta con una web que capte clientes de forma automática",
};

interface Diagnosis {
  businessLabel: string;
  objectiveLabel: string;
  solutionName: string;
  solutionTagline: string;
  stars: number;
  neededFeatures: string[];
  timeEstimate: string;
  complexity: Complexity;
  budgetEstimate: string;
  technologies: string[];
  maturityScore: number;
  maturityText: string;
  whatsappHref: string;
  express: boolean;
}

function buildDiagnosis(a: Answers): Diagnosis {
  const businessLabel = BUSINESS_OPTIONS.find((o) => o.id === a.business)?.label ?? "tu negocio";
  const objectiveLabel =
    OBJECTIVE_OPTIONS.find((o) => o.id === a.objective)?.label.toLowerCase() ?? "crecer";

  const key = pickSolution(a);
  const solution = SOLUTIONS[key];

  // Needed = solution essentials + extra features the user picked that aren't implied.
  const extras = a.features
    .filter((f) => f === "blog" || f === "multiidioma" || f === "chat")
    .map((f) => FEATURE_LABEL[f]);
  const neededFeatures = [...solution.essentials];
  extras.forEach((label) => {
    if (!neededFeatures.includes(label)) neededFeatures.push(label);
  });

  // Complexity: base, bumped if the project carries heavy add-ons or many features.
  let complexity = solution.baseComplexity;
  if (a.features.includes("multiidioma")) complexity = bumpComplexity(complexity);
  if (a.features.length >= 6) complexity = bumpComplexity(complexity);

  const { time, budget, rank } = COMPLEXITY_DATA[complexity];

  // Stars = fit between the recommended solution and the declared budget (kept positive).
  const budgetRank = a.budget ? BUDGET_RANK[a.budget] : 0;
  const stars = budgetRank > 0 && budgetRank < rank ? 4 : 5;

  // Digital maturity score (deterministic, ~35–92).
  const maturityScore = computeMaturity(a);

  const gap = GAP_BY_SOLUTION[key];
  const maturityText =
    `Tu negocio tiene una base ${maturityScore >= 70 ? "sólida" : "con buen potencial"}, ` +
    `pero ${gap}. Con ${solution.name.toLowerCase()} y una estrategia SEO podrías ` +
    `ampliar significativamente tu alcance y captar más clientes de forma constante.`;

  const express = a.timing === "asap";

  const summary =
    `Hola, hice el Diagnóstico Digital de Quimora Tech. ` +
    `Negocio: ${businessLabel}. Objetivo: ${objectiveLabel}. ` +
    `Solución recomendada: ${solution.name}. Quiero agendar la videollamada gratuita.`;
  const whatsappUrl = whatsappHref(summary);

  return {
    businessLabel,
    objectiveLabel,
    solutionName: solution.name,
    solutionTagline: solution.tagline,
    stars,
    neededFeatures,
    timeEstimate: time,
    complexity,
    budgetEstimate: budget,
    technologies: solution.technologies,
    maturityScore,
    maturityText,
    whatsappHref: whatsappUrl,
    express,
  };
}

function computeMaturity(a: Answers): number {
  let score = 50;

  const businessPoints: Record<BusinessId, number> = {
    "tienda-online": 15,
    empresa: 10,
    clinica: 8,
    inmobiliaria: 8,
    abogado: 8,
    restaurante: 5,
    cafeteria: 5,
    "tienda-fisica": 3,
    otro: 5,
  };
  const objectivePoints: Record<ObjectiveId, number> = {
    "mostrar-empresa": 8,
    "mas-clientes": 6,
    reservas: 6,
    "agendar-citas": 6,
    automatizar: 4,
    "vender-internet": 2,
  };
  const timingPoints: Record<TimingId, number> = {
    asap: 4,
    "este-mes": 3,
    "dos-meses": 2,
    investigando: 0,
  };
  const budgetPoints: Record<BudgetId, number> = {
    "menos-500": 2,
    "500-1000": 6,
    "1000-3000": 6,
    "mas-3000": 6,
    "no-se": 0,
  };

  if (a.business) score += businessPoints[a.business];
  if (a.objective) score += objectivePoints[a.objective];
  if (a.timing) score += timingPoints[a.timing];
  if (a.budget) score += budgetPoints[a.budget];
  score += Math.min(a.features.length * 2, 12); // awareness of what they need

  return Math.max(35, Math.min(92, Math.round(score)));
}

/* ============================ UI ============================ */

const TOTAL_STEPS = 5;

export function DigitalDiagnosis() {
  const [phase, setPhase] = useState<"intro" | "wizard" | "result">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);

  const start = () => {
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    setPhase("wizard");
  };

  const restart = () => {
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    setPhase("intro");
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else setPhase("result");
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const canAdvance =
    (step === 0 && answers.business !== null) ||
    (step === 1 && answers.objective !== null) ||
    step === 2 || // features are optional
    (step === 3 && answers.timing !== null) ||
    (step === 4 && answers.budget !== null);

  return (
    <section id="diagnostico" className="border-t border-hairline bg-hairline/50">
      <div className="mx-auto max-w-[900px] px-6 py-20 md:px-10 md:py-24">
        <div className="overflow-hidden rounded-2xl border border-hairline bg-background shadow-xl shadow-black/5">
          {phase === "intro" && <Intro onStart={start} />}
          {phase === "wizard" && (
            <Wizard
              step={step}
              answers={answers}
              setAnswers={setAnswers}
              canAdvance={canAdvance}
              onNext={next}
              onBack={back}
            />
          )}
          {phase === "result" && <Result diagnosis={buildDiagnosis(answers)} onRestart={restart} />}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Intro -------------------- */
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="bg-linear-to-b from-brand-soft to-background px-6 py-14 text-center md:px-16 md:py-16">
      <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-background px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-brand">
        <Sparkles size={14} />
        Diagnóstico Digital gratuito
      </span>
      <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-brand md:text-[40px]">
        Descubre la mejor solución para tu negocio en menos de 2 minutos
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-[1.6] text-foreground/80 md:text-[17px]">
        Responde unas preguntas y te recomendaremos la solución ideal, el tiempo estimado de
        desarrollo y una aproximación del presupuesto.
      </p>
      <button
        type="button"
        onClick={onStart}
        className={`mt-9 inline-flex h-14 items-center justify-center gap-2 rounded-md bg-cta px-8 font-display text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-cta-hover ${FOCUS_RING}`}
      >
        <Sparkles size={18} />
        Descubre qué solución necesita tu negocio
      </button>
      <p className="mt-5 text-xs text-muted-foreground">
        Sin registro · 5 preguntas · Resultado al instante
      </p>
    </div>
  );
}

/* -------------------- Wizard -------------------- */
interface WizardProps {
  step: number;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  canAdvance: boolean;
  onNext: () => void;
  onBack: () => void;
}

function Wizard({ step, answers, setAnswers, canAdvance, onNext, onBack }: WizardProps) {
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="px-6 py-10 md:px-12 md:py-12">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span className="font-display uppercase tracking-widest">
          Paso {step + 1} de {TOTAL_STEPS}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8">
        {step === 0 && (
          <SingleSelect
            title="¿Qué tipo de negocio tienes?"
            options={BUSINESS_OPTIONS}
            value={answers.business}
            onChange={(id) => setAnswers((a) => ({ ...a, business: id }))}
          />
        )}
        {step === 1 && (
          <SingleSelect
            title="¿Qué deseas lograr?"
            options={OBJECTIVE_OPTIONS}
            value={answers.objective}
            onChange={(id) => setAnswers((a) => ({ ...a, objective: id }))}
          />
        )}
        {step === 2 && (
          <MultiSelect
            title="¿Qué necesitas?"
            hint="Elige todas las que apliquen (opcional)."
            options={FEATURE_OPTIONS}
            values={answers.features}
            onToggle={(id) =>
              setAnswers((a) => ({
                ...a,
                features: a.features.includes(id)
                  ? a.features.filter((f) => f !== id)
                  : [...a.features, id],
              }))
            }
          />
        )}
        {step === 3 && (
          <SingleSelect
            title="¿Cuándo necesitas el proyecto?"
            options={TIMING_OPTIONS}
            value={answers.timing}
            onChange={(id) => setAnswers((a) => ({ ...a, timing: id }))}
          />
        )}
        {step === 4 && (
          <SingleSelect
            title="¿Cuál es tu presupuesto aproximado?"
            options={BUDGET_OPTIONS}
            value={answers.budget}
            onChange={(id) => setAnswers((a) => ({ ...a, budget: id }))}
            columns="one"
          />
        )}
      </div>

      {/* Nav */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 0}
          className={`inline-flex h-11 items-center gap-1.5 rounded-md px-4 font-display text-sm font-semibold text-foreground transition-colors hover:text-brand disabled:pointer-events-none disabled:opacity-0 ${FOCUS_RING}`}
        >
          <ArrowLeft size={16} />
          Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
          className={`inline-flex h-12 items-center gap-2 rounded-md bg-cta px-7 font-display text-sm font-semibold text-white transition-colors duration-200 hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
        >
          {step === TOTAL_STEPS - 1 ? "Ver mi diagnóstico" : "Siguiente"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* -------------------- Selectors -------------------- */
function SingleSelect<T extends string>({
  title,
  options,
  value,
  onChange,
  columns = "grid",
}: {
  title: string;
  options: Option<T>[];
  value: T | null;
  onChange: (id: T) => void;
  columns?: "grid" | "one";
}) {
  return (
    <fieldset>
      <legend className="font-display text-xl font-semibold text-brand md:text-2xl">{title}</legend>
      <div
        role="radiogroup"
        aria-label={title}
        className={`mt-6 grid gap-3 ${
          columns === "one" ? "sm:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {options.map(({ id, label, icon: Icon }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${FOCUS_RING} ${
                selected
                  ? "border-brand bg-brand-soft shadow-sm"
                  : "border-hairline bg-background hover:border-brand/40 hover:bg-brand-soft/40"
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  selected ? "bg-brand text-white" : "bg-brand-soft text-brand"
                }`}
              >
                <Icon size={18} strokeWidth={1.9} />
              </span>
              <span className="font-display text-[15px] font-medium text-foreground">{label}</span>
              {selected && <Check size={18} className="ml-auto text-brand" />}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function MultiSelect<T extends string>({
  title,
  hint,
  options,
  values,
  onToggle,
}: {
  title: string;
  hint: string;
  options: Option<T>[];
  values: T[];
  onToggle: (id: T) => void;
}) {
  return (
    <fieldset>
      <legend className="font-display text-xl font-semibold text-brand md:text-2xl">{title}</legend>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map(({ id, label, icon: Icon }) => {
          const selected = values.includes(id);
          return (
            <button
              key={id}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => onToggle(id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${FOCUS_RING} ${
                selected
                  ? "border-brand bg-brand-soft shadow-sm"
                  : "border-hairline bg-background hover:border-brand/40 hover:bg-brand-soft/40"
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  selected ? "bg-brand text-white" : "bg-brand-soft text-brand"
                }`}
              >
                <Icon size={18} strokeWidth={1.9} />
              </span>
              <span className="font-display text-[15px] font-medium text-foreground">{label}</span>
              <span
                className={`ml-auto grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                  selected ? "border-brand bg-brand text-white" : "border-hairline"
                }`}
              >
                {selected && <Check size={13} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* -------------------- Result -------------------- */
function Result({ diagnosis: d, onRestart }: { diagnosis: Diagnosis; onRestart: () => void }) {
  return (
    <div className="px-6 py-10 md:px-12 md:py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-soft px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-brand">
          <Sparkles size={14} />
          Diagnóstico Digital
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-brand md:text-[32px]">
          Tu recomendación personalizada
        </h2>
      </div>

      {/* Business / objective summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SummaryTile label="Tu negocio" value={d.businessLabel} />
        <SummaryTile label="Tu objetivo" value={cap(d.objectiveLabel)} />
      </div>

      {/* Recommendation */}
      <div className="mt-6 rounded-xl border border-brand/20 bg-brand-soft/50 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-brand md:text-2xl">
            {d.solutionName}
          </h3>
          <Stars value={d.stars} />
        </div>
        <p className="mt-2 text-[15px] leading-[1.6] text-foreground/80">{d.solutionTagline}</p>

        <p className="mt-6 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Necesitas
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {d.neededFeatures.map((f) => (
            <li key={f} className="flex items-center gap-2 text-[15px] text-foreground">
              <Check size={16} className="shrink-0 text-success" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <MetricTile icon={Clock} label="Tiempo estimado" value={d.timeEstimate} />
        <MetricTile icon={Gauge} label="Complejidad" value={d.complexity} />
        <MetricTile icon={Cpu} label="Presupuesto estimado" value={d.budgetEstimate} />
      </div>

      {/* Technologies */}
      <div className="mt-6">
        <p className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Tecnologías
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {d.technologies.map((t) => (
            <span
              key={t}
              className="rounded-full border border-hairline bg-background px-3 py-1.5 font-display text-sm font-medium text-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Digital maturity */}
      <div className="mt-8 rounded-xl border border-hairline bg-background p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-brand md:text-xl">
            Madurez Digital
          </h3>
          <span className="font-display text-2xl font-bold text-brand">
            {d.maturityScore}
            <span className="text-base font-medium text-muted-foreground">/100</span>
          </span>
        </div>
        <MaturityBar score={d.maturityScore} />
        <p className="mt-4 text-[15px] leading-[1.6] text-foreground/80">{d.maturityText}</p>
      </div>

      {/* Next step */}
      <div className="mt-8 rounded-xl bg-brand p-6 text-center text-white md:p-8">
        <h3 className="font-display text-xl font-semibold md:text-2xl">Siguiente paso</h3>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-[1.6] text-white/80">
          {d.express
            ? "Sabemos que tienes prisa: agenda una videollamada gratuita de 20 minutos y priorizamos tu proyecto."
            : "Agenda una videollamada gratuita de 20 minutos y definimos juntos el plan exacto."}
        </p>
        <a
          href={d.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("generate_lead", { method: "whatsapp", source: "diagnostico" })}
          className={`mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-md bg-white px-8 font-display text-[15px] font-semibold text-brand transition-colors duration-200 hover:bg-white/90 ${FOCUS_RING}`}
        >
          <MessageCircle size={18} />
          Agendar videollamada gratuita
        </a>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onRestart}
          className={`inline-flex items-center gap-1.5 rounded-sm font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
        >
          <RotateCcw size={15} />
          Hacer el diagnóstico de nuevo
        </button>
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-background p-5">
      <p className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 font-display text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-background p-5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
        <Icon size={18} strokeWidth={1.9} />
      </div>
      <p className="mt-4 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={18}
          className={i < value ? "text-brand" : "text-hairline"}
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

function MaturityBar({ score }: { score: number }) {
  const filled = Math.round(score / 10);
  return (
    <div
      className="mt-4 flex gap-1.5"
      role="progressbar"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Madurez digital"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 flex-1 rounded-full ${i < filled ? "bg-brand" : "bg-hairline"}`}
        />
      ))}
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
