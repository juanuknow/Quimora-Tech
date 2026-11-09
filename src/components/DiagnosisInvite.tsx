import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Sparkles, X } from "lucide-react";
import { DIAGNOSIS_INTRO, requestDiagnosis } from "../lib/diagnosis";
import { canShowInvite, markInvite } from "../lib/diagnosis-invite";
import { FOCUS_RING, LIGHT_RING, trackEvent } from "../lib/site";

/* -------------------- Invitación al diagnóstico -------------------- */

/** Momento objetivo de aparición, desde el inicio de la navegación (FR-001, R5). */
const TARGET_MS = 2500;
/** Si al montar ya pasó esto, la invitación no cabe en 2–3 s: no se muestra (U1). */
const LATEST_MOUNT_MS = 2700;
const MIN_DELAY_MS = 300;
/** Variante de ventana solo con al menos 768 × 640 px (FR-007, I1). */
const WIDE_QUERY = "(min-width: 768px) and (min-height: 640px)";
/** Límite de la tarjeta móvil (FR-007b). */
const MAX_HEIGHT_RATIO = 0.25;
const MIN_TARGET_PX = 44;

/** FR-005: no interrumpir a quien ya está escribiendo, en el diagnóstico o en el menú. */
function visitorIsBusy(): boolean {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    if (active.matches("input, textarea, select, [contenteditable='true']")) return true;
    if (active.closest("#contacto")) return true;
  }
  const diagnosis = document.getElementById("diagnosis-dialog");
  if (diagnosis instanceof HTMLDialogElement && diagnosis.open) return true;
  if (document.querySelector('[aria-controls="mobile-menu"][aria-expanded="true"]')) return true;
  // Navegación de escritorio: el desplegable "Servicios" se abre con :hover/:focus-within (CSS).
  return document.querySelector("header")?.matches(":hover, :focus-within") ?? false;
}

const intersects = (a: DOMRect, b: DOMRect) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/**
 * Las cinco condiciones de FR-007b, medidas en la pantalla real. La condición 5
 * (no bloquear el desplazamiento ni capturar el foco) se cumple por construcción:
 * la tarjeta no usa `showModal`, no toca el `body` y no mueve el foco.
 */
function cardFits(card: HTMLElement): boolean {
  const viewport = window.visualViewport;
  const vh = viewport ? viewport.height : window.innerHeight;
  const vw = viewport ? viewport.width : window.innerWidth;
  const rect = card.getBoundingClientRect();
  // (1) Como máximo el 25 % de la altura visible.
  if (rect.height > vh * MAX_HEIGHT_RATIO) return false;
  // (2) Objetivos táctiles de al menos 44 × 44 px.
  for (const control of card.querySelectorAll<HTMLElement>("button, a")) {
    const r = control.getBoundingClientRect();
    if (r.width < MIN_TARGET_PX || r.height < MIN_TARGET_PX) return false;
  }
  // (3) Dentro del área visible (los márgenes ya suman las áreas seguras con `env()`).
  if (rect.top < 0 || rect.left < 0 || rect.right > vw || rect.bottom > vh) return false;
  // (4) Sin tapar la barra de navegación ni el botón flotante de WhatsApp.
  const header = document.querySelector("header");
  if (header && intersects(rect, header.getBoundingClientRect())) return false;
  for (const wa of document.querySelectorAll<HTMLElement>('.fixed a[href*="wa.me/"]')) {
    if (intersects(rect, wa.getBoundingClientRect())) return false;
  }
  return true;
}

/** Destino lógico del foco cuando el elemento anterior ya no existe (FR-004). */
function focusFallback() {
  document.getElementById("main")?.focus({ preventScroll: true });
}

/**
 * Invitación al Diagnóstico Digital Gratuito (US3). Solo se monta en la home.
 *
 * - Ventana centrada (`<dialog>` con `showModal`) con al menos 768 × 640 px.
 * - En el resto, tarjeta inferior no bloqueante que solo aparece si cumple las
 *   cinco condiciones de FR-007b; si no, se suprime sin dejar rastro (FR-007c).
 * - Una vez por sesión (`diagnosis-invite.ts`). Para retirarla sin tocar el
 *   diagnóstico basta con dejar de montarla en `src/routes/index.tsx`.
 */
export function DiagnosisInvite() {
  const [variant, setVariant] = useState<"dialog" | "card" | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const acceptedRef = useRef(false);
  const viewedRef = useRef(false);

  const reportView = useCallback((format: "dialog" | "card") => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackEvent("diagnosis_popup_view", { format });
  }, []);

  // Planificación: 2,5 s desde la navegación; nunca fuera de 2–3 s.
  useEffect(() => {
    const elapsed = performance.now();
    if (elapsed > LATEST_MOUNT_MS || !canShowInvite()) return;
    const timer = window.setTimeout(
      () => {
        if (!canShowInvite() || visitorIsBusy()) return;
        setVariant(window.matchMedia(WIDE_QUERY).matches ? "dialog" : "card");
      },
      Math.max(MIN_DELAY_MS, TARGET_MS - elapsed),
    );
    return () => window.clearTimeout(timer);
  }, []);

  /* ---------- Ventana (escritorio y tableta) ---------- */

  useEffect(() => {
    if (variant !== "dialog") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    markInvite("shown");
    reportView("dialog");
    const onClose = () => {
      if (!acceptedRef.current) markInvite("dismissed");
      const previous = previousFocusRef.current;
      if (previous && previous.isConnected && previous !== document.body) previous.focus();
      else focusFallback();
      setVariant(null);
      if (acceptedRef.current) requestDiagnosis({ source: "invitacion" });
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [variant, reportView]);

  /* ---------- Tarjeta (móvil, horizontal y pantallas bajas) ---------- */

  useEffect(() => {
    if (variant !== "card") return;
    const card = cardRef.current;
    if (!card) return;
    if (!cardFits(card)) {
      setVariant(null); // FR-007c: suprimida, sin estado ni evento.
      return;
    }
    setCardVisible(true);
    markInvite("shown");
    reportView("card");
    // Si deja de caber (giro, teclado, ventana), se oculta sin contar como descarte.
    const recheck = () => {
      if (cardRef.current && !cardFits(cardRef.current)) {
        setCardVisible(false);
        setVariant(null);
      }
    };
    // WCAG 2.4.11: un elemento que recibe el foco no puede quedar tapado por la tarjeta. El
    // navegador no desplaza la página si el elemento está dentro de la pantalla, aunque quede
    // debajo de la tarjeta; se desplaza lo justo para dejarlo por encima.
    const keepFocusVisible = (e: FocusEvent) => {
      const target = e.target;
      const current = cardRef.current;
      if (!(target instanceof HTMLElement) || !current || current.contains(target)) return;
      const t = target.getBoundingClientRect();
      const c = current.getBoundingClientRect();
      // Contenedores como <main> (destino del foco al cerrar) no caben por encima de la
      // tarjeta: desplazarlos solo movería la página sin dejar nada más visible.
      if (target.id === "main" || t.height >= c.top) return;
      // "instant": `html` usa scroll-behavior smooth y el foco debe quedar visible ya.
      if (t.bottom > c.top && t.top < c.bottom) {
        window.scrollBy({ top: t.bottom - c.top + 16, behavior: "instant" });
      }
    };
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", recheck);
    window.addEventListener("resize", recheck);
    document.addEventListener("focusin", keepFocusVisible);
    return () => {
      viewport?.removeEventListener("resize", recheck);
      window.removeEventListener("resize", recheck);
      document.removeEventListener("focusin", keepFocusVisible);
    };
  }, [variant, reportView]);

  const hideCard = (dismiss: boolean) => {
    const focusWasInside = cardRef.current?.contains(document.activeElement) ?? false;
    if (dismiss) markInvite("dismissed");
    setCardVisible(false);
    setVariant(null);
    if (focusWasInside) focusFallback();
  };

  if (variant === "dialog") {
    return (
      <dialog
        ref={dialogRef}
        aria-labelledby="diagnosis-invite-title"
        aria-describedby="diagnosis-invite-text"
        className="m-auto w-full max-w-[520px] rounded-2xl border border-white/10 bg-brand-dark p-0 text-white shadow-2xl backdrop:bg-brand-dark/60"
      >
        <div className="relative px-8 pb-8 pt-10 motion-safe:animate-rise-in">
          <button
            type="button"
            aria-label="Cerrar invitación"
            onClick={() => dialogRef.current?.close()}
            className={`absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-md text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
          >
            <X size={20} aria-hidden="true" />
          </button>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-display text-xs font-semibold uppercase tracking-widest text-white/70">
            <Sparkles size={14} aria-hidden="true" />
            Diagnóstico Digital Gratuito
          </span>
          <h2
            id="diagnosis-invite-title"
            className="mt-5 pr-8 font-display text-2xl font-semibold leading-[1.2] tracking-tight md:text-display-sm"
          >
            ¿Tu negocio está aprovechando todo su potencial digital?
          </h2>
          <p id="diagnosis-invite-text" className="mt-4 text-ui leading-[1.6] text-white/80">
            {DIAGNOSIS_INTRO}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-caption text-white/70">
            <Clock size={16} aria-hidden="true" />
            Unos 2 minutos
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                acceptedRef.current = true;
                dialogRef.current?.close();
              }}
              className={`inline-flex h-12 items-center justify-center rounded-md bg-white px-6 font-display text-ui font-semibold text-brand transition-colors duration-200 hover:bg-white/90 active:scale-[0.98] ${LIGHT_RING}`}
            >
              Comenzar diagnóstico gratuito
            </button>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className={`inline-flex h-12 items-center justify-center rounded-md px-5 font-display text-ui font-semibold text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white active:scale-[0.98] ${LIGHT_RING}`}
            >
              Ahora no
            </button>
          </div>
        </div>
      </dialog>
    );
  }

  if (variant === "card") {
    return (
      <aside
        ref={cardRef}
        aria-label="Invitación al diagnóstico gratuito"
        onKeyDown={(e) => {
          if (e.key === "Escape") hideCard(true);
        }}
        style={{
          visibility: cardVisible ? "visible" : "hidden",
          bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
          left: "calc(16px + env(safe-area-inset-left, 0px))",
          right: "calc(16px + env(safe-area-inset-right, 0px))",
        }}
        className="fixed z-40 rounded-xl border border-hairline bg-background p-3 shadow-2xl"
      >
        <p role="status" className="sr-only">
          {cardVisible ? "Nueva invitación: Descubre qué necesita tu negocio." : ""}
        </p>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 pl-1 pt-1">
            <p className="font-display text-ui font-semibold leading-tight text-brand">
              Descubre qué necesita tu negocio
            </p>
            <p className="mt-1 text-caption text-muted-foreground">Gratis · Unos 2 minutos</p>
          </div>
          <button
            type="button"
            aria-label="Cerrar invitación"
            onClick={() => hideCard(true)}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-md text-foreground transition-colors duration-150 hover:bg-brand-soft active:scale-[0.98] ${FOCUS_RING}`}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              hideCard(false);
              requestDiagnosis({ source: "invitacion" });
            }}
            className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-cta px-3 font-display text-caption font-semibold text-white transition-colors duration-200 hover:bg-cta-hover active:scale-[0.98] ${FOCUS_RING}`}
          >
            Comenzar diagnóstico gratuito
          </button>
          <button
            type="button"
            onClick={() => hideCard(true)}
            className={`inline-flex min-h-11 items-center justify-center rounded-md px-3 font-display text-caption font-semibold text-foreground transition-colors duration-150 hover:bg-brand-soft active:scale-[0.98] ${FOCUS_RING}`}
          >
            Ahora no
          </button>
        </div>
      </aside>
    );
  }

  return null;
}
