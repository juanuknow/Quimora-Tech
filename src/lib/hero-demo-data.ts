/** Fictional businesses from the v2 prototype. Never customer testimonials. */
export type DemoLogoNode = {
  tag: "svg" | "circle" | "rect" | "path" | "ellipse";
  props: Record<string, string>;
  children: readonly DemoLogoNode[];
};
export type HeroDemoData = {
  label: string;
  name: string;
  domain: string;
  benefit: string;
  navigation: readonly string[];
  logo: DemoLogoNode;
  /** Reading order of the real text in each miniature. SVG artwork stays in its component. */
  copy: readonly string[];
};
export const HERO_DEMOS = {
  restaurantes: {
    label: "Restaurante",
    name: "Cazuela & Brasa",
    domain: "cazuelaybrasa.co",
    benefit: "Menú digital siempre actualizado y reservas por WhatsApp con un clic.",
    navigation: ["Menú", "Reservas", "Ubicación"],
    logo: {
      tag: "svg",
      props: {
        viewBox: "0 0 24 24",
      },
      children: [
        {
          tag: "circle",
          props: {
            cx: "12",
            cy: "12",
            r: "11",
            fill: "#9a3412",
          },
          children: [],
        },
        {
          tag: "path",
          props: {
            d: "M7 14c0-3 2-6 5-8 3 2 5 5 5 8a5 5 0 0 1-10 0z",
            fill: "#fdba74",
          },
          children: [],
        },
      ],
    },
    copy: [
      "Cocina vallecaucana a la brasa",
      "Abierto hoy · 12:00 – 22:00 · Granada, Cali",
      "Menú del día · actualizado hoy",
      "Bandeja de la casa",
      "Chicharrón, maduro, arroz, frijol",
      "$ 28.000",
      "Sancocho de gallina",
      "Los domingos, con aguacate",
      "$ 24.000",
      "Limonada de coco",
      "Natural, sin azúcar añadida",
      "$ 9.000",
      "Reservar mesa por WhatsApp",
    ],
  },
  tiendas: {
    label: "Tienda",
    name: "Almendra",
    domain: "almendratienda.co",
    benefit: "Catálogo permanente que Google indexa y pedidos por WhatsApp sin comisiones.",
    navigation: ["Mujer", "Hogar", "Carrito (2)"],
    logo: {
      tag: "svg",
      props: {
        viewBox: "0 0 24 24",
      },
      children: [
        {
          tag: "rect",
          props: {
            width: "24",
            height: "24",
            rx: "7",
            fill: "#78350f",
          },
          children: [],
        },
        {
          tag: "ellipse",
          props: {
            cx: "12",
            cy: "12",
            rx: "5",
            ry: "7.5",
            fill: "#fcd34d",
            transform: "rotate(25 12 12)",
          },
          children: [],
        },
      ],
    },
    copy: [
      "Nueva colección artesanal",
      "Hecho en el Valle · Envíos en Cali",
      "Más vendidos",
      "Blusa en lino",
      "$ 89.000",
      "Mochila tejida",
      "$ 120.000",
      "Taza de barro",
      "$ 35.000",
      "-15%",
      "Pedir por WhatsApp · sin comisiones",
    ],
  },
  clinicas: {
    label: "Clínica",
    name: "Odontología Arce",
    domain: "odontologiaarce.co",
    benefit: "Agendamiento de citas online con recordatorios que reducen las inasistencias.",
    navigation: ["Tratamientos", "Equipo", "Citas"],
    logo: {
      tag: "svg",
      props: {
        viewBox: "0 0 24 24",
      },
      children: [
        {
          tag: "rect",
          props: {
            width: "24",
            height: "24",
            rx: "12",
            fill: "#0e7490",
          },
          children: [],
        },
        {
          tag: "path",
          props: {
            d: "M7 8c2-2 4-1 5 0 1-1 3-2 5 0 1 2 0 5-1 7l-1 4h-1l-1-4h-2l-1 4H9l-1-4C7 13 6 10 7 8z",
            fill: "#fff",
          },
          children: [],
        },
      ],
    },
    copy: [
      "Dra. Valeria Arce",
      "Ortodoncia y estética dental · 12 años",
      "★★★★★",
      "4,9 · 186 opiniones",
      "Agenda tu valoración · noviembre",
      "Lun",
      "17",
      "Mar",
      "18",
      "Mié",
      "19",
      "Jue",
      "20",
      "Vie",
      "21",
      "8:00",
      "9:30",
      "11:00",
      "14:30",
      "16:00",
      "17:30",
      "Recordatorio automático",
      "Te avisamos 24 h antes por WhatsApp",
      "Confirmar cita · Mié 19, 9:30",
    ],
  },
  inmobiliarias: {
    label: "Inmobiliaria",
    name: "Ceiba Inmobiliaria",
    domain: "ceibainmobiliaria.co",
    benefit: "Catálogo propio con filtros y visitas agendadas desde cada inmueble.",
    navigation: ["Venta", "Arriendo", "Avalúos"],
    logo: {
      tag: "svg",
      props: {
        viewBox: "0 0 24 24",
      },
      children: [
        {
          tag: "rect",
          props: {
            width: "24",
            height: "24",
            rx: "6",
            fill: "#14532d",
          },
          children: [],
        },
        {
          tag: "circle",
          props: {
            cx: "12",
            cy: "9",
            r: "6",
            fill: "#4ade80",
          },
          children: [],
        },
        {
          tag: "rect",
          props: {
            x: "11",
            y: "13",
            width: "2",
            height: "7",
            fill: "#bbf7d0",
          },
          children: [],
        },
      ],
    },
    copy: [
      "Tipo",
      "Apartamento ▾",
      "Zona",
      "Sur ▾",
      "Hasta",
      "$ 450 M ▾",
      "48 inmuebles · 12 nuevos esta semana",
      "Apto en Ciudad Jardín",
      "3 hab · 2 baños · 82 m²",
      "$ 395.000.000",
      "Casa en Pance",
      "4 hab · 3 baños · 140 m²",
      "Arriendo $ 4,2 M",
      "Agendar visita a este inmueble",
    ],
  },
} as const satisfies Record<string, HeroDemoData>;
export type HeroDemoKey = keyof typeof HERO_DEMOS;
export const HERO_DEMO_KEYS = Object.keys(HERO_DEMOS) as HeroDemoKey[];
