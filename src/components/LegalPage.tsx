import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { FOCUS_RING } from "../lib/site";

/**
 * Shared layout for the static legal pages (privacy, terms). Keeps a light,
 * readable prose column with a minimal header and footer, consistent with the
 * landing's design tokens.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-20 max-w-[820px] items-center justify-between px-6">
          <a href="/" className={`flex items-center gap-2.5 rounded-md ${FOCUS_RING}`}>
            <span className="grid h-9 w-9 place-items-center rounded-md bg-brand font-display text-lg font-bold text-primary-foreground">
              Q
            </span>
            <span className="font-display text-[17px] font-semibold tracking-tight">
              Quimora Tech
            </span>
          </a>
          <a
            href="/"
            className={`inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-brand ${FOCUS_RING}`}
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[820px] px-6 py-16 md:py-20">
        <h1 className="font-display text-3xl font-bold tracking-tight text-brand md:text-[40px]">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Última actualización: {updated}</p>
        <div className="legal-prose mt-10">{children}</div>
      </main>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-[820px] flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Quimora Tech · Cali, Colombia</p>
          <div className="flex items-center gap-5">
            <a href="/privacidad" className={`rounded-sm hover:text-brand ${FOCUS_RING}`}>
              Privacidad
            </a>
            <a href="/terminos" className={`rounded-sm hover:text-brand ${FOCUS_RING}`}>
              Términos
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
