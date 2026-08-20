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
  Boxes,
  Receipt,
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
  /** Texto largo para la página individual (`/servicios/[slug]`). */
  longDescription?: string;
  /** Beneficios puntuales mostrados como lista en la página individual. */
  benefits?: readonly string[];
  /**
   * Meta description propia para `/servicios/[slug]`, más orientada a
   * búsqueda que `body` (pensado para la tarjeta). Si falta, la ruta cae de
   * vuelta a `body`.
   */
  metaDescription?: string;
}

export const services: readonly Service[] = [
  {
    icon: Globe,
    title: "Sitios web corporativos",
    body: "Presencia profesional que transmite confianza desde el primer clic y explica tu negocio sin que tengas que repetirlo.",
    slug: "desarrollo-web",
    metaDescription:
      "Diseño y desarrollo de sitios web corporativos a medida en Cali: mobile-first, rápidos y optimizados para SEO desde el inicio.",
    longDescription:
      "Tu sitio web corporativo es la primera impresión que tiene un cliente de tu negocio antes de escribirte o llamarte. Diseñamos y desarrollamos sitios institucionales a medida — sin plantillas genéricas — pensados para transmitir profesionalismo desde el primer segundo y responder lo que un cliente se pregunta antes de contactarte: quién sos, qué ofrecés y por qué confiar en vos.\n\nCada sitio incluye diseño responsive mobile-first, optimización de velocidad de carga y buenas prácticas de SEO desde el inicio, para que tu negocio también sea encontrado en Google, no solo visto por quien ya te conoce.\n\nIdeal para empresas medianas, profesionales independientes y negocios que necesitan un canal digital serio para atraer clientes en Cali y el resto de Colombia.",
    benefits: [
      "Diseño a medida, sin plantillas genéricas",
      "Mobile-first y responsive en cualquier dispositivo",
      "Optimización de velocidad de carga desde el inicio",
      "Buenas prácticas de SEO integradas desde el diseño",
      "Enlace directo a WhatsApp para recibir contactos",
      "Entrega de accesos y archivos del proyecto — la web es tuya",
    ],
  },
  {
    icon: MousePointerClick,
    title: "Landing pages",
    body: "Páginas enfocadas en una sola acción: que el visitante te escriba, agende o compre.",
    slug: "landing-pages",
    metaDescription:
      "Landing pages a medida en Cali, enfocadas en un solo objetivo: que el visitante te escriba, agende o compre. Entrega rápida.",
    longDescription:
      "Una landing page es una página enfocada en un solo objetivo — que el visitante te escriba, agende una cita o complete una compra — sin los menús ni distracciones de un sitio institucional completo. Es la opción más rápida de lanzar cuando tenés una campaña, una promoción o un producto puntual que necesita convertir, no solo informar.\n\nDiseñamos cada landing a medida alrededor de un único llamado a la acción, con la velocidad de carga y el diseño mobile-first como prioridad: la mayoría de tu tráfico de campañas va a llegar desde el celular, y cada segundo de carga de más es un visitante que se va antes de ver tu oferta.\n\nEs la solución ideal si estás lanzando algo puntual — un evento, una promoción, un servicio nuevo — y necesitás una página lista en semanas, no meses.",
    benefits: [
      "Un solo objetivo de conversión, sin distracciones",
      "Diseño mobile-first pensado para tráfico de campañas",
      "Optimización de velocidad de carga desde el inicio",
      "Formulario o enlace directo a WhatsApp integrado",
      "Entrega rápida — ideal para lanzamientos puntuales",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Tiendas online (eCommerce)",
    body: "Vende las 24 horas con catálogo, carrito y pagos en línea, sin depender solo de las redes sociales.",
    slug: "tiendas-online",
    metaDescription:
      "Desarrollo de tiendas online en Cali: catálogo, carrito y pagos en línea. Vende 24/7 sin depender solo de redes sociales.",
    longDescription:
      "Una tienda online te permite vender las 24 horas del día sin depender únicamente de publicar en redes sociales, donde cada producto nuevo se pierde en el algoritmo a las pocas horas. Desarrollamos tiendas con catálogo por categorías, buscador de productos, carrito de compras y pagos en línea — la misma base con la que construimos diosascali.com, un proyecto real que podés explorar en la sección de casos de este sitio.\n\nCada tienda se diseña mobile-first, porque la mayoría de las compras por celular se abandonan cuando el sitio es lento o difícil de navegar. Sumamos buenas prácticas de SEO desde el inicio para que tus productos también aparezcan en las búsquedas de Google, no solo en tus redes.\n\nIdeal para negocios que ya venden por WhatsApp o redes y quieren un catálogo propio, permanente e indexable — sin pagar comisión por cada venta.",
    benefits: [
      "Catálogo de productos por categorías",
      "Carrito de compras y checkout en línea",
      "Diseño mobile-first — la mayoría de las compras llegan desde el celular",
      "SEO desde el inicio para que tus productos aparezcan en Google",
      "Sin comisión por venta, a diferencia de los marketplaces",
    ],
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
    icon: Boxes,
    title: "Sistemas de inventario",
    body: "Herramientas para controlar productos, existencias, movimientos y operaciones de forma eficiente.",
    slug: "sistemas-de-inventario",
    metaDescription:
      "Sistemas de inventario a medida para empresas en Cali: control de existencias y movimientos en tiempo real, sin hojas sueltas.",
    longDescription:
      "Perder de vista cuánto stock tenés realmente — o enterarte de un faltante cuando ya perdiste la venta — es uno de los problemas más comunes en negocios que crecen sin un sistema que los acompañe. Desarrollamos sistemas de inventario a medida para controlar productos, existencias y movimientos en un solo lugar, reemplazando las hojas de cálculo sueltas que nadie actualiza a tiempo.\n\nCada sistema se construye alrededor de cómo trabaja realmente tu negocio — no de un molde genérico — para que el registro de entradas, salidas y stock disponible sea parte natural de tu operación diaria, no una tarea extra al final del día.\n\nIdeal para negocios que manejan múltiples productos, ubicaciones o canales de venta y necesitan saber, en cualquier momento, qué tienen y qué les falta.",
    benefits: [
      "Control de existencias y movimientos en tiempo real",
      "Registro de entradas y salidas sin hojas de cálculo sueltas",
      "A la medida de cómo opera tu negocio, no un molde genérico",
      "Acceso desde cualquier dispositivo con conexión a internet",
    ],
  },
  {
    icon: Receipt,
    title: "Sistemas de facturación",
    body: "Soluciones para digitalizar y optimizar los procesos de facturación de tu negocio.",
    slug: "sistemas-de-facturacion",
    metaDescription:
      "Sistemas de facturación a medida para empresas en Cali: digitaliza y organiza tus facturas en un solo lugar.",
    longDescription:
      "Facturar a mano o con plantillas sueltas es lento y deja espacio para errores que después cuestan tiempo en contabilidad. Desarrollamos sistemas de facturación a medida para digitalizar ese proceso: generar, organizar y consultar tus facturas desde un solo sistema, sin depender de hojas de cálculo ni de rehacer plantillas cada mes.\n\nCada sistema se adapta a cómo factura realmente tu negocio — productos, servicios o ambos — y queda listo para crecer junto con tu operación.\n\nEl sistema se enfoca en generar, organizar y consultar tus facturas — no incluye integración con la facturación electrónica de la DIAN. Si tu negocio la necesita, contanoslo antes de arrancar para confirmar si aplica a tu proyecto.",
    benefits: [
      "Generación y organización de facturas desde un solo sistema",
      "A la medida de cómo factura tu negocio hoy",
      "Reduce el trabajo manual y el margen de error",
      "Pensado para crecer junto con tu operación",
    ],
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
    slug: "automatizacion-de-procesos",
    metaDescription:
      "Automatización de procesos e integraciones de sistemas para empresas en Cali: menos tareas manuales, más tiempo para vender.",
    longDescription:
      "Cada tarea repetitiva que hacés manualmente — copiar datos de un lado a otro, responder el mismo mensaje, actualizar una hoja de cálculo — es tiempo que no estás usando para vender. Automatizamos esos procesos y conectamos las herramientas que ya usás — pagos, WhatsApp, envíos o el sistema que ya tenés — para que la información fluya sola entre ellas, sin que alguien tenga que hacerlo a mano.\n\nNo vendemos automatización genérica: primero entendemos cómo trabaja tu negocio hoy, identificamos qué se repite y qué se puede conectar, y construimos la solución sobre eso.\n\nIdeal para negocios que ya tienen varias herramientas funcionando por separado y quieren que trabajen juntas, sin duplicar el trabajo humano.",
    benefits: [
      "Automatización de tareas repetitivas y manuales",
      "Integración con las herramientas que ya usás (pagos, WhatsApp, envíos, tu sistema actual)",
      "Menos errores manuales, más tiempo para vender",
      "Solución construida sobre cómo trabaja tu negocio hoy, no un molde genérico",
    ],
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
