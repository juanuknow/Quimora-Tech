import type { ComponentType } from "react";
import { RestaurantLogo } from "../components/hero-demo/RestaurantLogo";
import { StoreLogo } from "../components/hero-demo/StoreLogo";
import { ClinicLogo } from "../components/hero-demo/ClinicLogo";
import { RealEstateLogo } from "../components/hero-demo/RealEstateLogo";

/** Fictional businesses from the v2 prototype. Never customer testimonials. */
export type HeroDemoData = {
  label: string;
  name: string;
  domain: string;
  benefit: string;
  navigation: readonly string[];
  logo: ComponentType;
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
    logo: RestaurantLogo,
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
    logo: StoreLogo,
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
    logo: ClinicLogo,
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
    logo: RealEstateLogo,
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
