import { UtensilsCrossed, Stethoscope, Building2, Store, type LucideIcon } from "lucide-react";

/**
 * Páginas de industria (`/para/[slug]`) — SEO programático segmentado por
 * tipo de negocio, no por servicio. `services-data.ts` responde a "qué
 * construimos" (landing, tienda online, ...); esto responde a "para quién":
 * mismo negocio, dolor y beneficios distintos según el rubro.
 *
 * Cada entrada necesita copy propio y diferenciado — no rellenar con texto
 * genérico solo para sumar páginas al sitemap.
 */
export interface Vertical {
  slug: string;
  icon: LucideIcon;
  /** En minúscula, para insertar en frases: "una web para ${name}". */
  name: string;
  title: string;
  metaDescription: string;
  intro: string;
  painPoints: readonly string[];
  benefits: readonly string[];
}

export const verticals: readonly Vertical[] = [
  {
    slug: "restaurantes",
    icon: UtensilsCrossed,
    name: "restaurantes y cafeterías",
    title: "Páginas web para restaurantes y cafeterías",
    metaDescription:
      "Sitios web para restaurantes y cafeterías en Cali: menú siempre actualizado, reservas por WhatsApp y ficha optimizada para búsquedas locales.",
    intro:
      "Tu carta cambia, tus horarios cambian y tus clientes deciden dónde comer en segundos. Tu web tiene que seguirles el ritmo, no frenarlos.",
    painPoints: [
      "Actualizar el menú significa rehacer un PDF o publicar en redes, y aun así muchos clientes no lo ven",
      "Recibes llamadas y mensajes repetidos preguntando horario, ubicación o si hay mesa disponible",
      'No apareces cuando alguien busca "restaurante cerca de mí" en Google, y ese cliente termina en la competencia',
    ],
    benefits: [
      "Menú digital siempre actualizado, sin depender de un PDF desactualizado",
      "Reservas y pedidos directos por WhatsApp, con un clic desde el celular",
      'Ficha optimizada para búsquedas locales ("restaurante en [tu zona]")',
      "Fotos, ubicación y horario que generan confianza antes de que el cliente llegue",
    ],
  },
  {
    slug: "clinicas",
    icon: Stethoscope,
    name: "clínicas y consultorios",
    title: "Páginas web para clínicas y consultorios",
    metaDescription:
      "Sitios web para clínicas, consultorios y profesionales de la salud: agendamiento de citas online, recordatorios automáticos y perfil profesional.",
    intro:
      "Un paciente elige a su especialista antes de escribirle: lo que encuentra en tu web define si agenda contigo o sigue buscando.",
    painPoints: [
      "Tu recepción se satura respondiendo por WhatsApp las mismas preguntas sobre horarios y disponibilidad",
      "Los pacientes cancelan o no llegan porque agendar una cita implica llamar en horario de oficina",
      "No transmites la confianza que un paciente necesita antes de elegir un especialista",
    ],
    benefits: [
      "Agendamiento de citas online, disponible fuera de horario de atención",
      "Recordatorios automáticos que reducen las inasistencias",
      "Perfil de cada especialista con su experiencia y especialidad",
      "Diseño profesional que proyecta la confianza que el sector exige",
    ],
  },
  {
    slug: "inmobiliarias",
    icon: Building2,
    name: "inmobiliarias",
    title: "Páginas web para inmobiliarias",
    metaDescription:
      "Sitios web para inmobiliarias: catálogo propio de inmuebles con filtros, ficha por propiedad y formulario que califica al interesado.",
    intro:
      "En los portales genéricos compites por precio contra miles de anuncios iguales. En tu propia web, compites con tu marca.",
    painPoints: [
      "Publicas tus inmuebles en portales genéricos y desapareces entre miles de anuncios similares",
      "No tienes un catálogo propio: cada inmueble nuevo es una publicación suelta en redes que se pierde en 24 horas",
      "Los interesados se mezclan en WhatsApp sin un formulario previo que filtre quién realmente está listo para comprar o arrendar",
    ],
    benefits: [
      "Catálogo de inmuebles con filtros por tipo, zona y presupuesto",
      "Ficha por propiedad con galería, mapa y datos completos",
      "Formulario de contacto que califica al interesado antes de escribirte",
      "SEO local para aparecer cuando alguien busca inmuebles en tu zona",
    ],
  },
  {
    slug: "tiendas",
    icon: Store,
    name: "tiendas físicas",
    title: "Páginas web para tiendas físicas",
    metaDescription:
      "Sitios web para tiendas físicas: catálogo permanente indexado por Google, pedidos por WhatsApp sin comisiones y base para vender en línea.",
    intro:
      "Tu tienda ya tiene clientes fieles. Tu web es lo que te permite ganar los que aún no te conocen y te buscan en Google.",
    painPoints: [
      "Dependes solo de las redes sociales, donde el algoritmo decide quién te ve y cuándo",
      "No tienes un catálogo propio: cada producto nuevo es una historia que desaparece en 24 horas",
      "Pierdes ventas de clientes que buscan tu tienda en Google y no te encuentran",
    ],
    benefits: [
      "Catálogo online permanente, indexado por Google — no una publicación que caduca",
      "Pedidos directos por WhatsApp, sin comisiones de marketplace",
      "Ficha de negocio optimizada para búsquedas locales",
      "Base lista para crecer hacia ventas en línea cuando lo necesites",
    ],
  },
] as const;

export function getVerticalBySlug(slug: string): Vertical {
  const vertical = verticals.find((v) => v.slug === slug);
  if (!vertical) {
    throw new Error(`No existe una industria con slug "${slug}" en verticals-data.ts`);
  }
  return vertical;
}
