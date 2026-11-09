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
  type LucideIcon,
} from "lucide-react";

/**
 * Modelo compartido entre la ventana del Diagnóstico y quienes la abren desde
 * otra parte de la página (la sección, los atajos y la invitación).
 */

export type BusinessId =
  | "tienda-fisica"
  | "tienda-online"
  | "restaurante"
  | "cafeteria"
  | "clinica"
  | "abogado"
  | "inmobiliaria"
  | "empresa"
  | "otro";

export interface Option<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

export const BUSINESS_OPTIONS: Option<BusinessId>[] = [
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

/**
 * Texto de apoyo aprobado en la spec (FR-003). Lo usan la sección
 * `#diagnostico`, la pregunta 1 de la ventana (FR-003b) y la invitación de escritorio.
 */
export const DIAGNOSIS_INTRO =
  "Descubre qué oportunidades tiene tu negocio para crecer con tecnología. Responde unas preguntas y recibe una recomendación personalizada, completamente gratis.";

export const DIAGNOSIS_START_EVENT = "diagnosis:start";

/** Desde dónde se abre el diagnóstico; viaja a la analítica como `source`. */
export type DiagnosisSource = "invitacion" | "seccion" | "atajo";

export interface DiagnosisStartDetail {
  source: DiagnosisSource;
  /** Solo desde un atajo: el diagnóstico empieza en la pregunta 2 con este negocio. */
  business?: BusinessId;
}

/**
 * Abre la ventana única del diagnóstico (`DiagnosisDialog`). Es un evento del
 * `window` y no props: quien lo dispara (sección, atajos, invitación) y la
 * ventana viven en ramas distintas de la página. No desplaza la página.
 */
export function requestDiagnosis(detail: DiagnosisStartDetail): void {
  window.dispatchEvent(new CustomEvent<DiagnosisStartDetail>(DIAGNOSIS_START_EVENT, { detail }));
}
