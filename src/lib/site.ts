/**
 * Single source of truth for contact details and shared style tokens.
 * Changing a number or email here updates it everywhere — avoids the
 * drift where the site, footer and schema each showed a different value.
 */

export const WHATSAPP_NUMBER = "573244577198";
export const CONTACT_EMAIL = "devopsconsultoring@gmail.com";
export const CONTACT_PHONE = "+573244577198";
export const CONTACT_PHONE_DISPLAY = "+57 324 457 7198";
export const SITE_URL = "https://quimoratech.com";

/** Formspree endpoint that receives contact-form submissions (no backend). */
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzdnenqv";

/**
 * Google Analytics 4 measurement ID (formato "G-XXXXXXXXXX").
 * Pégalo aquí cuando crees la propiedad en analytics.google.com.
 * Mientras esté vacío, NO se carga ningún script de analytics.
 */
export const GA_MEASUREMENT_ID = "";

/** Envía un evento a GA4 si está cargado. No-op en SSR o sin ID configurado. */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", name, params ?? {});
}

/** Builds a wa.me deep link with a pre-filled, URL-encoded message. */
export function whatsappHref(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Standard focus ring for interactive elements on light surfaces. */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Focus ring for interactive elements on the dark (near-black) surfaces. */
export const LIGHT_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]";
