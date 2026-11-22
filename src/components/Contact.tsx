import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Check, MapPin, Clock, Globe } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { NewTabHint, NEW_TAB_NOTICE } from "./NewTabHint";
import {
  FOCUS_RING,
  CONTACT_EMAIL,
  WHATSAPP_NUMBER_2,
  CONTACT_CITY,
  BUSINESS_HOURS,
  SERVICE_AREA,
  FORMSPREE_ENDPOINT,
  whatsappHref,
  trackEvent,
} from "../lib/site";

/* -------------------- Contact -------------------- */
const NEED_OPTIONS = [
  { value: "web", label: "Página web o landing" },
  { value: "tienda", label: "Tienda online" },
  { value: "software", label: "Sistema o software a medida" },
  { value: "mantenimiento", label: "Mantenimiento de mi web" },
  { value: "no-se", label: "Aún no lo sé, necesito orientación" },
] as const satisfies ReadonlyArray<{ value: string; label: string }>;

const EMPTY_FORM = {
  name: "",
  business: "",
  phone: "",
  email: "",
  need: "",
  message: "",
  _gotcha: "",
};

type ContactErrors = {
  name?: string;
  contact?: string;
  phone?: string;
  email?: string;
  need?: string;
};

export function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const needRef = useRef<HTMLSelectElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Al confirmarse el envío el formulario desaparece del DOM y con él el foco:
  // un lector de pantalla se quedaría sin ninguna señal de que salió bien. Se
  // mueve el foco al mensaje de confirmación para que se anuncie.
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const update =
    (field: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (data: typeof form): ContactErrors => {
    const next: ContactErrors = {};
    if (!data.name) next.name = "Cuéntanos tu nombre.";
    if (!data.phone && !data.email)
      next.contact = "Déjanos un WhatsApp o un correo para responderte.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      next.email = "Ese correo no parece válido.";
    const phoneDigits = data.phone.replace(/\D/g, "");
    if (
      data.phone &&
      (!/^[\d+\-()\s]+$/.test(data.phone) || phoneDigits.length < 7 || phoneDigits.length > 15)
    )
      next.phone = "Ese número de WhatsApp no parece válido.";
    if (!NEED_OPTIONS.some((option) => option.value === data.need))
      next.need = "Elige la opción que más se parezca a lo que necesitas.";
    setErrors(next);
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(false);
    const data = {
      name: form.name.trim(),
      business: form.business.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      need: form.need.trim(),
      message: form.message.trim(),
      _gotcha: form._gotcha.trim(),
    };
    if (data._gotcha) {
      setSent(true);
      return;
    }
    const next = validate(data);
    if (next.name) nameRef.current?.focus();
    else if (next.contact || next.phone) phoneRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else if (next.need) needRef.current?.focus();
    const needOption = NEED_OPTIONS.find((option) => option.value === data.need);
    if (Object.keys(next).length > 0 || !needOption) return;

    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          ...(data.business && { business: data.business }),
          ...(data.phone && { phone: data.phone }),
          ...(data.email && { email: data.email }),
          need: needOption.label,
          ...(data.message && { message: data.message }),
          _subject: `Nueva consulta de ${data.name} · ${needOption.label} · Quimora Tech`,
        }),
      });
      if (!res.ok) throw new Error(`Formspree respondió ${res.status}`);
      setSent(true);
      trackEvent("generate_lead", { method: "contact_form", service: needOption.value });
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldBase = `w-full rounded-md border bg-background px-4 py-3 text-ui text-foreground transition-colors placeholder:text-muted-foreground ${FOCUS_RING}`;

  return (
    <section id="contacto" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Left: pitch + direct options */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-hairline/60 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Hablemos
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-brand md:text-display">
              Cuéntanos sobre tu proyecto
            </h2>
            <p className="mt-4 max-w-md text-base text-foreground/80 md:text-body">
              Respondemos en menos de 24 horas con una propuesta clara. Sin compromiso y sin
              lenguaje técnico complicado.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <a
                href={whatsappHref("Hola, quiero una consulta gratis")}
                onClick={() => trackEvent("contact", { method: "whatsapp", location: "contacto" })}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escribir por WhatsApp, línea 1 ${NEW_TAB_NOTICE}`}
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <WhatsAppIcon size={18} />
                </span>
                WhatsApp línea 1
                <NewTabHint />
              </a>
              <a
                href={whatsappHref("Hola, quiero una consulta gratis", WHATSAPP_NUMBER_2)}
                onClick={() =>
                  trackEvent("contact", { method: "whatsapp", location: "contacto-linea-2" })
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escribir por WhatsApp, línea 2 ${NEW_TAB_NOTICE}`}
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <WhatsAppIcon size={18} />
                </span>
                WhatsApp línea 2
                <NewTabHint />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Mail size={18} />
                </span>
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="mt-6 flex flex-col gap-4 border-t border-hairline pt-6">
              <div className="inline-flex items-center gap-3 text-sm text-foreground">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand"
                >
                  <MapPin size={18} />
                </span>
                {CONTACT_CITY}
              </div>
              <div className="inline-flex items-center gap-3 text-sm text-foreground">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand"
                >
                  <Clock size={18} />
                </span>
                {BUSINESS_HOURS}
              </div>
              <div className="inline-flex items-center gap-3 text-sm text-foreground">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand"
                >
                  <Globe size={18} />
                </span>
                {SERVICE_AREA}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-hairline bg-hairline/40 p-6 md:p-8">
            {sent ? (
              <div
                ref={successRef}
                role="status"
                tabIndex={-1}
                className="flex h-full min-h-[320px] flex-col items-center justify-center text-center focus:outline-none"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white">
                  <Check size={28} />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                  ¡Mensaje enviado!
                </h3>
                <p className="mt-2 max-w-sm text-sm text-foreground/70">
                  Gracias por escribirnos. Te responderemos en menos de 24 horas. Si prefieres,
                  escríbenos directo por WhatsApp y te contestamos al instante.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm(EMPTY_FORM);
                    setErrors({});
                    setSubmitError(false);
                    // El botón que se pulsó desaparece: el foco pasa al primer campo.
                    requestAnimationFrame(() => nameRef.current?.focus());
                  }}
                  className={`mt-6 rounded-md font-display text-sm font-semibold text-brand underline-offset-4 hover:underline ${FOCUS_RING}`}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                <input
                  type="text"
                  name="_gotcha"
                  value={form._gotcha}
                  onChange={update("_gotcha")}
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div>
                  <label
                    htmlFor="cf-name"
                    className="font-display text-sm font-medium text-foreground"
                  >
                    Nombre{" "}
                    <span aria-hidden="true" className="text-accent-strong">
                      *
                    </span>
                  </label>
                  <input
                    id="cf-name"
                    name="name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    value={form.name}
                    onChange={update("name")}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "cf-name-err" : undefined}
                    className={`mt-2 ${fieldBase} ${errors.name ? "border-destructive" : "border-input"}`}
                    placeholder="Tu nombre"
                  />
                  {errors.name && (
                    <p id="cf-name-err" className="mt-1.5 text-xs text-destructive-strong">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cf-business"
                    className="font-display text-sm font-medium text-foreground"
                  >
                    Nombre de tu negocio (opcional)
                  </label>
                  <input
                    id="cf-business"
                    name="business"
                    type="text"
                    autoComplete="organization"
                    maxLength={80}
                    value={form.business}
                    onChange={update("business")}
                    className={`mt-2 ${fieldBase} border-input`}
                  />
                </div>

                <fieldset className="min-w-0">
                  <legend className="font-display text-sm font-medium text-foreground">
                    ¿Cómo te contactamos?{" "}
                    <span aria-hidden="true" className="text-accent-strong">
                      *
                    </span>
                  </legend>
                  <p id="cf-contact-help" className="mt-2 text-sm text-muted-foreground">
                    Déjanos tu WhatsApp, tu correo o ambos.
                  </p>
                  <div className="mt-3 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="cf-phone"
                        className="font-display text-sm font-medium text-foreground"
                      >
                        WhatsApp
                      </label>
                      <input
                        id="cf-phone"
                        name="phone"
                        ref={phoneRef}
                        type="tel"
                        autoComplete="tel"
                        maxLength={20}
                        value={form.phone}
                        onChange={update("phone")}
                        aria-invalid={!!(errors.contact || errors.phone)}
                        aria-describedby={[
                          "cf-contact-help",
                          errors.contact && "cf-contact-err",
                          errors.phone && "cf-phone-err",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        className={`mt-2 ${fieldBase} ${errors.contact || errors.phone ? "border-destructive" : "border-input"}`}
                        placeholder="+57 300 000 0000"
                      />
                      {errors.phone && (
                        <p id="cf-phone-err" className="mt-1.5 text-xs text-destructive-strong">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="cf-email"
                        className="font-display text-sm font-medium text-foreground"
                      >
                        Correo
                      </label>
                      <input
                        id="cf-email"
                        name="email"
                        ref={emailRef}
                        type="email"
                        autoComplete="email"
                        maxLength={120}
                        value={form.email}
                        onChange={update("email")}
                        aria-invalid={!!(errors.contact || errors.email)}
                        aria-describedby={[
                          "cf-contact-help",
                          errors.contact && "cf-contact-err",
                          errors.email && "cf-email-err",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        className={`mt-2 ${fieldBase} ${errors.contact || errors.email ? "border-destructive" : "border-input"}`}
                        placeholder="tu@correo.com"
                      />
                      {errors.email && (
                        <p id="cf-email-err" className="mt-1.5 text-xs text-destructive-strong">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  {errors.contact && (
                    <p id="cf-contact-err" className="mt-1.5 text-xs text-destructive-strong">
                      {errors.contact}
                    </p>
                  )}
                </fieldset>

                <div>
                  <label
                    htmlFor="cf-need"
                    className="font-display text-sm font-medium text-foreground"
                  >
                    ¿Qué necesitas?{" "}
                    <span aria-hidden="true" className="text-accent-strong">
                      *
                    </span>
                  </label>
                  <select
                    id="cf-need"
                    name="need"
                    ref={needRef}
                    value={form.need}
                    onChange={update("need")}
                    aria-required="true"
                    aria-invalid={!!errors.need}
                    aria-describedby={errors.need ? "cf-need-err" : undefined}
                    className={`mt-2 min-w-0 ${fieldBase} ${errors.need ? "border-destructive" : "border-input"}`}
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {NEED_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.need && (
                    <p id="cf-need-err" className="mt-1.5 text-xs text-destructive-strong">
                      {errors.need}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cf-message"
                    className="font-display text-sm font-medium text-foreground"
                  >
                    Cuéntanos más (opcional)
                  </label>
                  <textarea
                    id="cf-message"
                    name="message"
                    rows={4}
                    maxLength={1000}
                    value={form.message}
                    onChange={update("message")}
                    className={`mt-2 resize-y ${fieldBase} border-input`}
                    placeholder="Cuéntanos qué necesitas para tu negocio…"
                  />
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive-strong"
                  >
                    No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className={`inline-flex h-14 items-center justify-center rounded-md bg-cta px-8 font-display text-ui font-semibold text-white transition duration-200 hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] ${FOCUS_RING}`}
                >
                  {submitting ? "Enviando…" : "Enviar consulta"}
                </button>
                <p className="text-center text-xs text-foreground/70">
                  Al enviar aceptas nuestra{" "}
                  <a href="/privacidad" className="underline underline-offset-2 hover:text-brand">
                    Política de Privacidad
                  </a>{" "}
                  y que te contactemos sobre tu consulta. Utilizamos proveedores tecnológicos para
                  procesarla, como explica la política.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
