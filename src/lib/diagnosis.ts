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
 * Modelo compartido entre el wizard del Diagnóstico y quienes lo abren desde
 * otra parte de la página (los atajos entre secciones).
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

export const DIAGNOSIS_START_EVENT = "diagnosis:start";

/**
 * Abre el diagnóstico con el tipo de negocio ya elegido y lleva al visitante
 * hasta él. Es un evento del `window` y no props: quien lo dispara y el wizard
 * viven en ramas distintas de la página.
 */
export function requestDiagnosis(business: BusinessId): void {
  window.dispatchEvent(new CustomEvent<BusinessId>(DIAGNOSIS_START_EVENT, { detail: business }));
  document.getElementById("diagnostico")?.scrollIntoView({ block: "start" });
}
