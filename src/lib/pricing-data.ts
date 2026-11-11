/** Fuente única de planes. `adds` contiene solo lo que suma cada nivel. */
export type PlanName = "Emprendedor" | "Presencia" | "Crecimiento" | "A Medida";

export interface Plan {
  name: PlanName;
  price: string;
  period: string;
  promo: string | null;
  audience: string;
  description: string;
  delivery: string;
  support: string;
  includesPlan?: PlanName;
  includesNote?: string;
  adds: readonly string[];
  defaultSelected?: boolean;
}

export const PLANS: readonly Plan[] = [
  {
    name: "Emprendedor",
    price: "Desde $450.000",
    period: "Pago único",
    promo: "Hosting 3 meses + dominio incluidos",
    audience: "Para empezar a vender en línea",
    description:
      "Tu negocio en internet en una sola página: lo que ofreces y un canal directo para recibir pedidos.",
    delivery: "2–3 semanas",
    support: "Durante el lanzamiento",
    adds: [
      "Sitio de una página con tu marca",
      "Catálogo de productos o servicios",
      "Información de tu negocio: horario, ubicación y contacto",
      "Enlace directo a WhatsApp",
    ],
  },
  {
    name: "Presencia",
    price: "Desde $650.000",
    period: "Pago único",
    promo: "Hosting 3 meses + dominio incluidos",
    audience: "Para atraer clientes nuevos",
    description:
      "Una web profesional que te hace visible en Google y convierte visitas en contactos.",
    delivery: "2–3 semanas",
    support: "Durante el lanzamiento",
    includesPlan: "Emprendedor",
    adds: [
      "Diseño a medida de tu marca",
      "Formulario de contacto",
      "Galería de fotos o portafolio",
      "Mapa con tu ubicación (Google Maps)",
      "Enlaces a tus redes sociales",
      "SEO local: apareces cuando te buscan en tu zona",
      "Google Analytics para medir tus visitas",
    ],
    defaultSelected: true,
  },
  {
    name: "Crecimiento",
    price: "Desde $950.000",
    period: "Pago único",
    promo: "Hosting 3 meses + dominio incluidos",
    audience: "Para crecer y administrar tu web",
    description:
      "Más secciones, más control y más datos: tu web crece con tu negocio sin depender de nosotros.",
    delivery: "2–4 semanas",
    support: "1 mes después del lanzamiento",
    includesPlan: "Presencia",
    adds: [
      "Sitio con varias páginas (inicio, servicios, nosotros…)",
      "Panel para editar tus textos e imágenes",
      "Blog o sección de novedades",
      "SEO en todas las páginas",
      "Google Search Console: ves cómo te encuentran",
      "1 mes de soporte después del lanzamiento",
    ],
  },
  {
    name: "A Medida",
    price: "Cotización personalizada",
    period: "Según alcance",
    promo: null,
    audience: "Para vender, agendar o automatizar",
    description:
      "Cuando tu negocio necesita funciones propias: vender en línea, agendar o conectar tus sistemas.",
    delivery: "Según alcance",
    support: "Acompañamiento continuo",
    includesNote: "Crecimiento, según lo necesites",
    adds: [
      "Tienda online con pagos en línea",
      "Reservas o agendamiento de citas",
      "Integraciones con tus sistemas (inventario, facturación…)",
      "Mantenimiento mensual incluido",
    ],
  },
];

/** Compromisos reales presentes en cualquier proyecto (sin métricas inventadas). */
export const PLAN_INCLUDES = [
  "Diseño para celular",
  "Carga rápida",
  "Certificado SSL (https)",
  "SEO técnico",
  "Entrega de accesos y archivos",
  "Acompañamiento en el lanzamiento",
] as const;
