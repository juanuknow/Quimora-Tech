/**
 * Planes de la sección Precios: fuente única. La consume `Pricing` y, sin
 * precios, el diagnóstico (componentes del plan Emprendedor, regla R-K2).
 */
export const PLANS = [
  {
    name: "Emprendedor",
    price: "Desde $450.000",
    period: "pago único",
    promo: "Hosting 3 meses + dominio incluidos",
    description:
      "El punto de partida: tu negocio en línea con su catálogo y un canal directo para recibir pedidos.",
    features: [
      "Desarrollo de tu sitio web",
      "Catálogo de productos o servicios",
      "Información de tu negocio",
      "Enlace directo a WhatsApp",
      "Entrega en 2-3 semanas",
    ],
    featured: false,
  },
  {
    name: "Presencia",
    price: "Desde $650.000",
    period: "pago único",
    promo: "Hosting 3 meses + dominio incluidos",
    description:
      "Ideal para negocios que necesitan una presencia digital profesional para atraer clientes y generar contactos.",
    features: [
      "Landing page a medida",
      "Diseño responsive (Mobile-first)",
      "Formulario de contacto",
      "Vinculación con redes sociales",
      "Optimización básica de SEO",
      "Conexión con Google Analytics",
      "Catálogo de productos o servicios",
      "Galería de imágenes o portafolio",
      "Integración con Google Maps",
    ],
    featured: false,
  },
  {
    name: "Crecimiento",
    price: "Desde $950.000",
    period: "pago único",
    promo: "Hosting 3 meses + dominio incluidos",
    description:
      "Todo lo del plan Presencia, potenciado: más secciones, más control y más datos para vender más.",
    features: [
      "Todo lo incluido en Presencia",
      "Sitio multi-sección (institucional completo)",
      "Panel de edición simple para tus textos e imágenes",
      "Blog o sección de novedades",
      "Google Analytics + Search Console",
      "SEO avanzado en todas las páginas",
      "Botón flotante de WhatsApp",
      "Certificado SSL y seguridad reforzada",
      "1 mes de soporte post-lanzamiento incluido",
      "Entrega en 2-4 semanas",
    ],
    featured: true,
  },
  {
    name: "A Medida",
    price: "Cotización personalizada",
    period: "según alcance",
    promo: null,
    description:
      "Para tiendas en línea, sistemas de reservas o integraciones específicas de tu negocio.",
    features: [
      "Funcionalidad a medida",
      "Integraciones y pagos",
      "Mantenimiento incluido",
      "Acompañamiento continuo",
    ],
    featured: false,
  },
] as const;

/** Compromisos reales presentes en cualquier proyecto (sin métricas inventadas). */
export const PLAN_INCLUDES = [
  "Diseño mobile-first, responsive",
  "Optimización de velocidad de carga",
  "Buenas prácticas de SEO desde el inicio",
  "Conexión con WhatsApp",
  "Entrega de accesos y archivos del proyecto",
  "Acompañamiento durante el lanzamiento",
] as const;

export type Plan = (typeof PLANS)[number];
