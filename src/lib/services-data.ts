import {
  Globe,
  MousePointerClick,
  ShoppingCart,
  ClipboardList,
  LayoutDashboard,
  Layers,
  CalendarCheck,
  Workflow,
  Plug,
  Users,
  BrainCircuit,
  Server,
  type LucideIcon,
} from "lucide-react";

/**
 * Fuente única del catálogo de "Soluciones de software" — usada por la
 * sección `SoftwareSolutions` en la home y por las páginas individuales en
 * `/servicios/[slug]`. Un mismo dato, dos vistas: cambiar un texto aquí
 * actualiza ambas.
 *
 * Solo los servicios con `slug` tienen página propia y aparecen en el
 * dropdown "Servicios" del navbar — los demás siguen siendo tarjetas de la
 * home sin ruta dedicada todavía.
 */
export interface Service {
  slug?: string;
  icon: LucideIcon;
  title: string;
  /** Beneficio para el cliente, no la funcionalidad técnica — texto corto de la tarjeta. */
  body: string;
  /**
   * Texto largo para la página individual. Ausente en todo el catálogo hoy:
   * ninguna de estas soluciones tiene copy extenso en el sitio todavía, así
   * que las páginas usan `body` como base hasta que se escriba contenido real.
   */
  longDescription?: string;
  /** Beneficios puntuales, si existen. Ninguno tiene esto definido aún. */
  benefits?: readonly string[];
}

export const services: readonly Service[] = [
  {
    icon: Globe,
    title: "Sitios web corporativos",
    body: "Presencia profesional que transmite confianza desde el primer clic y explica tu negocio sin que tengas que repetirlo.",
    slug: "desarrollo-web",
  },
  {
    icon: MousePointerClick,
    title: "Landing pages",
    body: "Páginas enfocadas en una sola acción: que el visitante te escriba, agende o compre.",
    slug: "landing-pages",
  },
  {
    icon: ShoppingCart,
    title: "Tiendas online (eCommerce)",
    body: "Vende las 24 horas con catálogo, carrito y pagos en línea, sin depender solo de las redes sociales.",
    slug: "tiendas-online",
  },
  {
    icon: ClipboardList,
    title: "Sistemas administrativos",
    body: "Centraliza pedidos, inventario y clientes en un solo lugar y deja atrás las hojas de cálculo sueltas.",
  },
  {
    icon: LayoutDashboard,
    title: "Paneles de gestión",
    body: "Mira los números de tu negocio en tiempo real y toma decisiones con datos, no con intuición.",
  },
  {
    icon: Layers,
    title: "Plataformas web personalizadas",
    body: "Software hecho a la medida de tu operación, no un molde genérico al que tengas que adaptarte.",
  },
  {
    icon: CalendarCheck,
    title: "Reservas y citas",
    body: "Tus clientes agendan solos a cualquier hora: menos llamadas, menos cruces de horario.",
  },
  {
    icon: Workflow,
    title: "Automatización de procesos",
    body: "Las tareas repetitivas se hacen solas: menos errores manuales y más horas libres para vender.",
  },
  {
    icon: Plug,
    title: "Integraciones con APIs",
    body: "Conectamos tu web con pagos, envíos, WhatsApp o el sistema que ya usas a diario.",
  },
  {
    icon: Users,
    title: "Portales para clientes",
    body: "Un espacio privado donde cada cliente consulta su información sin escribirte por cada dato.",
  },
  {
    icon: BrainCircuit,
    title: "Soluciones con inteligencia artificial",
    body: "Asistentes, búsqueda inteligente y clasificación automática que responden por ti.",
  },
  {
    icon: Server,
    title: "Aplicaciones web escalables",
    body: "Arquitectura preparada para crecer: más usuarios y más datos sin tener que rehacer todo.",
  },
] as const;

/** Solo los servicios con página propia — alimenta el dropdown del navbar. */
export const servicesWithPage: readonly Service[] = services.filter((s) => s.slug);

export function getServiceBySlug(slug: string): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) {
    throw new Error(`No existe un servicio con slug "${slug}" en services-data.ts`);
  }
  return service;
}
