import { BUSINESS_OPTIONS, type BusinessId } from "./diagnosis";
import { getService, type ServiceId } from "./services-data";
import { PLANS } from "./pricing-data";
import { whatsappHref } from "./site";

/**
 * Motor del Diagnóstico Digital Gratuito: reglas fijas, sin React ni DOM.
 *
 * Fuente: `specs/001-diagnostico-captacion/spec.md` ("Reglas de recomendación")
 * y `contracts/diagnosis-engine.md`. La misma combinación de respuestas produce
 * siempre el mismo resultado; el contenido de cada servicio ("cómo trabajaría"
 * y beneficios) se lee del catálogo publicado, nunca se escribe aquí.
 *
 * Los textos redactados en este archivo (resúmenes, explicaciones, próximos
 * pasos y motivos) requieren la aprobación del responsable antes de publicarse
 * (`validation.md` §2).
 */

/* ============================ Respuestas ============================ */

export type SituationId = "S1" | "S2" | "S3" | "S4" | "S5";
export type NeedId = "N1" | "N2" | "N3" | "N4" | "N5" | "N6" | "N7";
export type GoalId = "O1" | "O2" | "O3" | "O4" | "O5";
export type PriorityId = "P1" | "P2" | "P3" | "P4";

/** Opción de una pregunta. Sin icono: la interfaz lo añade (`UiAnswerOption`). */
export interface AnswerOption<T extends string> {
  id: T;
  label: string;
}

export interface CompleteAnswers {
  business: BusinessId;
  situation: SituationId;
  need: NeedId;
  goal: GoalId;
  priority: PriorityId;
}

export const SITUATION_OPTIONS: readonly AnswerOption<SituationId>[] = [
  { id: "S1", label: "No tengo página web" },
  { id: "S2", label: "Solo uso redes sociales o WhatsApp" },
  { id: "S3", label: "Tengo una web, pero no me trae clientes" },
  { id: "S4", label: "Tengo una web y quiero renovarla" },
  { id: "S5", label: "Ya vendo por internet" },
];

export const NEED_OPTIONS: readonly AnswerOption<NeedId>[] = [
  { id: "N1", label: "Que más clientes me encuentren" },
  { id: "N2", label: "Vender mis productos por internet" },
  { id: "N3", label: "Recibir reservas o citas sin hacerlo a mano" },
  { id: "N4", label: "Controlar mi inventario o existencias" },
  { id: "N5", label: "Ordenar mis ventas, caja y cotizaciones" },
  { id: "N6", label: "Ahorrar tiempo automatizando tareas" },
  { id: "N7", label: "Dar una imagen más profesional" },
];

export const GOAL_OPTIONS: readonly AnswerOption<GoalId>[] = [
  { id: "O1", label: "Conseguir más clientes o contactos" },
  { id: "O2", label: "Vender en línea" },
  { id: "O3", label: "Llenar mi agenda de reservas o citas" },
  { id: "O4", label: "Operar con más orden y menos trabajo manual" },
  { id: "O5", label: "Fortalecer mi marca" },
];

export const PRIORITY_OPTIONS: readonly AnswerOption<PriorityId>[] = [
  { id: "P1", label: "Lo antes posible" },
  { id: "P2", label: "Este mes" },
  { id: "P3", label: "En los próximos 2 meses" },
  { id: "P4", label: "Solo estoy investigando" },
];

/* ============================ Recomendación ============================ */

export type PrimaryRule = "R-P1" | "R-P2" | "R-P3" | "R-P4" | "R-P5" | "R-P6" | "R-P7" | "R-P8";
export type ComplementRule = "R-K1" | "R-K2" | "R-K3" | "R-K4";
export type NextStepRule = "R-N1" | "R-N2" | "R-N3" | "R-N4";

export interface Complement {
  rule: ComplementRule;
  kind: "service" | "plan-component";
  /** Solo si `kind` es `"service"`. */
  serviceId?: ServiceId;
  /** Solo si `kind` es `"plan-component"`: textos del plan publicado. */
  planComponents?: readonly string[];
  /** Motivo visible, redactado a partir de las respuestas. */
  reason: string;
}

export interface Recommendation {
  primaryRule: PrimaryRule;
  primary: ServiceId;
  complements: readonly Complement[];
  situationSummary: string;
  needLabel: string;
  howItWorks: string;
  benefits: readonly string[];
  explanation: string;
  /** Una frase de como máximo 200 caracteres; es la que va en el mensaje de WhatsApp. */
  shortExplanation: string;
  nextStepRule: NextStepRule;
  nextStep: string;
  /** Siempre `null` mientras no haya una correspondencia servicio–plazo aprobada (FR-018b). */
  deliveryTime: null;
}

/** Servicios que el diagnóstico puede recomendar como principal (tabla R-P). */
export const PRIMARY_SERVICES: readonly ServiceId[] = [
  "landing-pages",
  "sitios-corporativos",
  "tiendas-online",
  "reservas-citas",
  "inventario",
  "ventas-caja",
  "automatizacion",
];

/** Servicios internos o de agenda: necesitan una web si el negocio aún no la tiene (R-K1). */
const NEEDS_WEB_FOR_REACH: readonly ServiceId[] = [
  "reservas-citas",
  "inventario",
  "ventas-caja",
  "automatizacion",
];

const SALES_SYSTEMS: readonly ServiceId[] = ["tiendas-online", "inventario", "ventas-caja"];

/* ---------- Redacción según el tipo de negocio (R-C5) ---------- */

const BUSINESS_PHRASE: Record<BusinessId, string> = {
  "tienda-fisica": "tu tienda",
  "tienda-online": "tu tienda online",
  restaurante: "tu restaurante",
  cafeteria: "tu cafetería",
  clinica: "tu clínica",
  abogado: "tu despacho",
  inmobiliaria: "tu inmobiliaria",
  empresa: "tu empresa",
  otro: "tu negocio",
};

/** "reservas" para restaurante y cafetería, "citas" para clínica, abogado e inmobiliaria. */
function bookingWord(business: BusinessId): string {
  if (business === "restaurante" || business === "cafeteria") return "reservas";
  if (business === "clinica" || business === "abogado" || business === "inmobiliaria")
    return "citas";
  return "reservas o citas";
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

function labelOf<T extends string>(options: readonly AnswerOption<T>[], id: T): string {
  const option = options.find((o) => o.id === id);
  if (!option) throw new Error(`Opción desconocida: ${id}`);
  return option.label;
}

export function businessLabel(id: BusinessId): string {
  const option = BUSINESS_OPTIONS.find((o) => o.id === id);
  if (!option) throw new Error(`Tipo de negocio desconocido: ${id}`);
  return option.label;
}

/* ---------- R-P: solución principal ---------- */

function pickPrimary(a: CompleteAnswers): { rule: PrimaryRule; id: ServiceId } {
  switch (a.need) {
    case "N1":
      return a.situation === "S4" || a.goal === "O5"
        ? { rule: "R-P1", id: "sitios-corporativos" }
        : { rule: "R-P2", id: "landing-pages" };
    case "N2":
      return { rule: "R-P3", id: "tiendas-online" };
    case "N3":
      return { rule: "R-P4", id: "reservas-citas" };
    case "N4":
      return { rule: "R-P5", id: "inventario" };
    case "N5":
      return { rule: "R-P6", id: "ventas-caja" };
    case "N6":
      return { rule: "R-P7", id: "automatizacion" };
    case "N7":
      return { rule: "R-P8", id: "sitios-corporativos" };
  }
}

/* ---------- R-K: complementos ---------- */

/** Componentes del plan Emprendedor que respaldan R-K2 (fuente: `pricing-data.ts`). */
const CATALOG_FEATURE = "Catálogo de productos o servicios";
const WHATSAPP_FEATURE = "Enlace directo a WhatsApp";

function emprendedorComponents(): readonly string[] {
  const plan = PLANS.find((p) => p.name === "Emprendedor");
  const features: readonly string[] = plan?.features ?? [];
  if (!features.includes(CATALOG_FEATURE) || !features.includes(WHATSAPP_FEATURE)) {
    throw new Error("El plan Emprendedor ya no publica los componentes que respaldan R-K2");
  }
  return [CATALOG_FEATURE, WHATSAPP_FEATURE];
}

function pickComplements(a: CompleteAnswers, primary: ServiceId): Complement[] {
  const candidates: Complement[] = [];
  if (
    NEEDS_WEB_FOR_REACH.includes(primary) &&
    (a.situation === "S1" || a.situation === "S2") &&
    (a.goal === "O1" || a.goal === "O2" || a.goal === "O3")
  ) {
    candidates.push({
      rule: "R-K1",
      kind: "service",
      serviceId: "landing-pages",
      reason: "Aún no tienes web y tu objetivo exige que los clientes te encuentren y te escriban",
    });
  }
  if (a.goal === "O2" && primary !== "tiendas-online" && a.situation !== "S5") {
    candidates.push({
      rule: "R-K2",
      kind: "plan-component",
      planComponents: emprendedorComponents(),
      reason:
        "Quieres vender en línea; el catálogo con pedidos por WhatsApp es el primer paso sin montar una tienda completa",
    });
  }
  if (a.goal === "O3" && primary !== "reservas-citas") {
    candidates.push({
      rule: "R-K3",
      kind: "service",
      serviceId: "reservas-citas",
      reason: `Tu objetivo es llenar tu agenda de ${bookingWord(a.business)}`,
    });
  }
  if (a.situation === "S5" && SALES_SYSTEMS.includes(primary)) {
    candidates.push({
      rule: "R-K4",
      kind: "service",
      serviceId: "integraciones-api",
      reason:
        "Ya vendes por internet: conectar lo que ya usas (pagos, envíos o tu sistema) evita duplicar trabajo",
    });
  }
  // R-C4: como máximo dos, sin repetir la principal ni repetirse entre sí.
  const chosen: Complement[] = [];
  for (const c of candidates) {
    if (chosen.length === 2) break;
    if (c.kind === "service" && c.serviceId === primary) continue;
    if (chosen.some((x) => complementKey(x) === complementKey(c))) continue;
    chosen.push(c);
  }
  return chosen;
}

const complementKey = (c: Complement) =>
  c.kind === "service" ? `s:${c.serviceId}` : `p:${(c.planComponents ?? []).join("|")}`;

/** Nombre visible de un complemento (servicio del catálogo o componentes de plan). */
export function complementTitle(c: Complement): string {
  if (c.kind === "service" && c.serviceId) return getService(c.serviceId).title;
  const [first, ...rest] = c.planComponents ?? [];
  return [first, ...rest.map(lowerFirst)].join(" con ");
}

/* ---------- Textos (pendientes de aprobación, validation.md §2) ---------- */

const SITUATION_SENTENCE: Record<SituationId, (neg: string) => string> = {
  S1: (neg) => `${capitalize(neg)} todavía no tiene página web propia.`,
  S2: (neg) => `${capitalize(neg)} se apoya solo en redes sociales o WhatsApp, sin una web propia.`,
  S3: (neg) => `${capitalize(neg)} ya tiene una página web, pero hoy no le está trayendo clientes.`,
  S4: (neg) => `${capitalize(neg)} ya tiene una página web y quieres renovarla.`,
  S5: (neg) => `${capitalize(neg)} ya vende por internet.`,
};

function explain(
  a: CompleteAnswers,
  rule: PrimaryRule,
): { explanation: string; shortExplanation: string } {
  switch (rule) {
    case "R-P1":
      return a.situation === "S4"
        ? {
            explanation:
              "Como quieres renovar tu web, te recomendamos un sitio corporativo nuevo que reemplace al actual y presente tu negocio con claridad, con buenas prácticas de SEO desde el diseño.",
            shortExplanation:
              "Un sitio corporativo nuevo reemplaza la web actual y presenta el negocio con claridad.",
          }
        : {
            explanation:
              "Como quieres fortalecer tu marca, un sitio corporativo presenta tu negocio de forma profesional y explica lo que haces sin que tengas que repetirlo.",
            shortExplanation:
              "Un sitio corporativo presenta el negocio de forma profesional y fortalece la marca.",
          };
    case "R-P2":
      return a.situation === "S3"
        ? {
            explanation:
              "Tu web actual no te trae clientes: una landing page nueva, enfocada en una sola acción —que el visitante te escriba, agende o compre—, puede reemplazarla.",
            shortExplanation:
              "Una landing page nueva, enfocada en una sola acción, reemplaza la web que no trae clientes.",
          }
        : {
            explanation:
              "Una landing page se enfoca en una sola acción: que el visitante te escriba, agende o compre, sin distracciones.",
            shortExplanation:
              "Una landing page se enfoca en una sola acción: que el visitante escriba, agende o compre.",
          };
    case "R-P3":
      return a.situation === "S5"
        ? {
            explanation:
              "Ya vendes por internet; una tienda online propia te da un canal de venta tuyo, sin depender solo de las redes sociales o de terceros.",
            shortExplanation:
              "Una tienda propia da un canal de venta sin depender solo de redes sociales o terceros.",
          }
        : {
            explanation:
              "Una tienda online te permite vender las 24 horas con catálogo, carrito y pagos en línea, sin depender solo de las redes sociales.",
            shortExplanation:
              "Una tienda online permite vender las 24 horas con catálogo, carrito y pagos en línea.",
          };
    case "R-P4": {
      const word = bookingWord(a.business);
      return {
        explanation: `Con un sistema de ${word}, tus clientes agendan solos a cualquier hora: menos llamadas y menos cruces de horario.`,
        shortExplanation: `Un sistema de ${word} permite que los clientes agenden solos a cualquier hora.`,
      };
    }
    case "R-P5":
      return {
        explanation:
          "Un sistema de inventario te muestra tus existencias y movimientos en tiempo real, sin hojas de cálculo sueltas.",
        shortExplanation:
          "Un sistema de inventario muestra existencias y movimientos en tiempo real.",
      };
    case "R-P6":
      return {
        explanation:
          "Un sistema de control de ventas, caja y cotizaciones reúne todo en un solo lugar y reduce el trabajo manual y el margen de error.",
        shortExplanation: "Un sistema de ventas, caja y cotizaciones reúne todo en un solo lugar.",
      };
    case "R-P7":
      return {
        explanation:
          "La automatización hace que las tareas repetitivas se hagan solas: menos errores manuales y más tiempo para vender.",
        shortExplanation: "La automatización hace que las tareas repetitivas se hagan solas.",
      };
    case "R-P8":
      return {
        explanation:
          "Un sitio corporativo a medida proyecta una imagen profesional y explica tu negocio sin que tengas que repetirlo.",
        shortExplanation:
          "Un sitio corporativo a medida proyecta una imagen profesional del negocio.",
      };
  }
}

/** ¿Cubren la principal o los complementos el objetivo declarado? Si no, aplica R-C3. */
function goalCovered(
  goal: GoalId,
  primary: ServiceId,
  complements: readonly Complement[],
): boolean {
  const rules = complements.map((c) => c.rule);
  switch (goal) {
    case "O1":
      return (
        ["landing-pages", "sitios-corporativos", "tiendas-online"].includes(primary) ||
        rules.includes("R-K1")
      );
    case "O2":
      return primary === "tiendas-online" || rules.includes("R-K2");
    case "O3":
      return primary === "reservas-citas" || rules.includes("R-K3");
    case "O4":
      return ["inventario", "ventas-caja", "automatizacion"].includes(primary);
    case "O5":
      return primary === "sitios-corporativos";
  }
}

const NEXT_STEP: Record<PriorityId, { rule: NextStepRule; text: string }> = {
  P1: {
    rule: "R-N1",
    text: "Hablar con un asesor para definir el alcance, la inversión y una fecha de inicio cercana.",
  },
  P2: {
    rule: "R-N2",
    text: "Hablar con un asesor para definir el alcance y la inversión y planificar el inicio este mes.",
  },
  P3: {
    rule: "R-N3",
    text: "Hablar con un asesor para definir el alcance y la inversión y preparar el proyecto con tiempo.",
  },
  P4: {
    rule: "R-N4",
    text: "Resolver dudas con un asesor, sin compromiso, para comparar opciones antes de decidir.",
  },
};

/** FR-018a: la inversión se define con el asesor, nunca en el diagnóstico. */
const INVESTMENT_NOTE =
  "La inversión se define con el asesor por WhatsApp, una vez conocido el alcance real del proyecto.";

/* ---------- API ---------- */

/** Recomendación integral determinista (FR-014 a FR-018b). */
export function recommend(a: CompleteAnswers): Recommendation {
  const { rule, id: primary } = pickPrimary(a);
  const complements = pickComplements(a, primary);
  const service = getService(primary);
  const neg = BUSINESS_PHRASE[a.business];
  const goalLabel = labelOf(GOAL_OPTIONS, a.goal);
  const { explanation, shortExplanation } = explain(a, rule);
  const step = NEXT_STEP[a.priority];
  const pendingGoal = goalCovered(a.goal, primary, complements)
    ? ""
    : ` En la asesoría revisaremos también tu objetivo: ${lowerFirst(goalLabel)}.`;

  return {
    primaryRule: rule,
    primary,
    complements,
    situationSummary: `${SITUATION_SENTENCE[a.situation](neg)} Tu objetivo: ${lowerFirst(goalLabel)}.`,
    needLabel: labelOf(NEED_OPTIONS, a.need),
    howItWorks: service.longDescription ?? service.body,
    benefits: service.benefits ?? [],
    explanation,
    shortExplanation,
    nextStepRule: step.rule,
    nextStep: `${step.text}${pendingGoal} ${INVESTMENT_NOTE}`,
    deliveryTime: null,
  };
}

/** Etiquetas de las cinco respuestas, en el orden del cuestionario. */
export function answerLabels(a: CompleteAnswers): {
  business: string;
  situation: string;
  need: string;
  goal: string;
  priority: string;
} {
  return {
    business: businessLabel(a.business),
    situation: labelOf(SITUATION_OPTIONS, a.situation),
    need: labelOf(NEED_OPTIONS, a.need),
    goal: labelOf(GOAL_OPTIONS, a.goal),
    priority: labelOf(PRIORITY_OPTIONS, a.priority),
  };
}

/* ============================ Mensaje de WhatsApp ============================ */

/** Límite del texto del mensaje y del enlace codificado (FR-022b). */
export const MESSAGE_MAX_CHARS = 2000;

export interface WhatsAppMessage {
  text: string;
  href: string;
  /** `true` si se limitaron los beneficios a los tres primeros (FR-022b). */
  reduced: boolean;
}

/**
 * Mensaje prellenado para "Continuar por WhatsApp" y "Copiar mensaje"
 * (`contracts/whatsapp-message.md`). Se compone solo con las respuestas y la
 * recomendación; nunca incluye precios, plazos ni datos personales.
 *
 * `forceFull` desactiva la reducción; solo lo usa la verificación exhaustiva.
 */
export function buildWhatsAppMessage(
  a: CompleteAnswers,
  rec: Recommendation,
  opts: { forceFull?: boolean } = {},
): WhatsAppMessage {
  const labels = answerLabels(a);
  const compose = (benefits: readonly string[]) =>
    [
      "Hola, Quimora Tech. Acabo de completar el Diagnóstico Digital Gratuito en su página web.",
      "",
      `Tipo de negocio: ${labels.business}.`,
      `Situación digital actual: ${labels.situation}.`,
      `Principal necesidad: ${labels.need}.`,
      `Objetivo: ${labels.goal}.`,
      `Prioridad: ${labels.priority}.`,
      "",
      `Solución recomendada: ${getService(rec.primary).title}.`,
      ...(benefits.length > 0 ? ["Beneficios:", ...benefits.map((b) => `- ${b}`)] : []),
      "Complementos:",
      ...(rec.complements.length > 0
        ? rec.complements.map((c) => `- ${complementTitle(c)}: ${c.reason}.`)
        : ["- ninguno adicional"]),
      `Por qué: ${rec.shortExplanation}`,
      `Próximo paso: ${rec.nextStep}`,
      "",
      "Me gustaría recibir asesoría personalizada para implementar esta solución en mi negocio. ¡Gracias!",
    ].join("\n");

  let text = compose(rec.benefits);
  let reduced = false;
  if (!opts.forceFull && whatsappHref(text).length > MESSAGE_MAX_CHARS) {
    text = compose(rec.benefits.slice(0, 3));
    reduced = true;
  }
  return { text, href: whatsappHref(text), reduced };
}
