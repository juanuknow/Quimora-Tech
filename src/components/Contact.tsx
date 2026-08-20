import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Phone, Mail, Check } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import {
  FOCUS_RING,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  WHATSAPP_NUMBER_2,
  CONTACT_PHONE_2,
  CONTACT_PHONE_2_DISPLAY,
  FORMSPREE_ENDPOINT,
  whatsappHref,
  trackEvent,
} from "../lib/site";

/* -------------------- Contact -------------------- */
type ContactErrors = { name?: string; email?: string; message?: string };

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const update =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): ContactErrors => {
    const next: ContactErrors = {};
    if (!form.name.trim()) next.name = "Cuéntanos tu nombre.";
    if (!form.email.trim()) next.email = "Necesitamos un correo para responderte.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Ese correo no parece válido.";
    if (!form.message.trim()) next.message = "Cuéntanos brevemente qué necesitas.";
    setErrors(next);
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(false);
    const next = validate();
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else if (next.message) messageRef.current?.focus();
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || "—",
          message: form.message,
          _subject: `Nueva consulta de ${form.name} · Quimora Tech`,
        }),
      });
      if (!res.ok) throw new Error(`Formspree respondió ${res.status}`);
      setSent(true);
      trackEvent("generate_lead", { method: "contact_form" });
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldBase = `w-full rounded-md border bg-background px-4 py-3 text-ui text-foreground transition-colors placeholder:text-muted-foreground/70 ${FOCUS_RING}`;

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
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <WhatsAppIcon size={18} />
                </span>
                Escribir por WhatsApp
              </a>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Phone size={18} />
                </span>
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href={whatsappHref("Hola, quiero una consulta gratis", WHATSAPP_NUMBER_2)}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <WhatsAppIcon size={18} />
                </span>
                {CONTACT_PHONE_2_DISPLAY}
              </a>
              <a
                href={`tel:${CONTACT_PHONE_2}`}
                className={`inline-flex items-center gap-3 rounded-md text-sm text-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Phone size={18} />
                </span>
                {CONTACT_PHONE_2_DISPLAY}
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
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-hairline bg-hairline/40 p-6 md:p-8">
            {sent ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
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
                    setForm({ name: "", email: "", phone: "", message: "" });
                  }}
                  className={`mt-6 rounded-md font-display text-sm font-semibold text-brand underline-offset-4 hover:underline ${FOCUS_RING}`}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="cf-name"
                    className="font-display text-sm font-medium text-foreground"
                  >
                    Nombre <span className="text-accent-strong">*</span>
                  </label>
                  <input
                    id="cf-name"
                    ref={nameRef}
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "cf-name-err" : undefined}
                    className={`mt-2 ${fieldBase} ${errors.name ? "border-destructive" : "border-input"}`}
                    placeholder="Tu nombre"
                  />
                  {errors.name && (
                    <p id="cf-name-err" className="mt-1.5 text-xs text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cf-email"
                      className="font-display text-sm font-medium text-foreground"
                    >
                      Email <span className="text-accent-strong">*</span>
                    </label>
                    <input
                      id="cf-email"
                      ref={emailRef}
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "cf-email-err" : undefined}
                      className={`mt-2 ${fieldBase} ${errors.email ? "border-destructive" : "border-input"}`}
                      placeholder="tu@correo.com"
                    />
                    {errors.email && (
                      <p id="cf-email-err" className="mt-1.5 text-xs text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="cf-phone"
                      className="font-display text-sm font-medium text-foreground"
                    >
                      Teléfono <span className="text-muted-foreground">(opcional)</span>
                    </label>
                    <input
                      id="cf-phone"
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      className={`mt-2 ${fieldBase} border-input`}
                      placeholder="+57 300 000 0000"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cf-message"
                    className="font-display text-sm font-medium text-foreground"
                  >
                    Mensaje <span className="text-accent-strong">*</span>
                  </label>
                  <textarea
                    id="cf-message"
                    ref={messageRef}
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "cf-message-err" : undefined}
                    className={`mt-2 resize-y ${fieldBase} ${errors.message ? "border-destructive" : "border-input"}`}
                    placeholder="Cuéntanos qué necesitas para tu negocio…"
                  />
                  {errors.message && (
                    <p id="cf-message-err" className="mt-1.5 text-xs text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
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
                  y que te contactemos sobre tu consulta. Nunca compartimos tus datos.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
