import { createFileRoute } from "@tanstack/react-router";
import { DigitalDiagnosis } from "../components/DigitalDiagnosis";
import { AuditOffer } from "../components/AuditOffer";
import { DiagnosisDialog } from "../components/DiagnosisDialog";
import { DiagnosisInvite } from "../components/DiagnosisInvite";
import { DiagnosisShortcuts } from "../components/DiagnosisShortcuts";
import { ReadingProgress } from "../components/ReadingProgress";
import { Showcase3D } from "../components/Showcase3D";
import { SoftwareSolutions } from "../components/SoftwareSolutions";
import { FloatingDiagnosis } from "../components/FloatingDiagnosis";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { TopBar } from "../components/TopBar";
import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Problem } from "../components/Problem";
import { Benefits } from "../components/Benefits";
import { Stats } from "../components/Stats";
import { Timeline } from "../components/Timeline";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ property: "og:url", content: "https://quimoratech.com/" }],
    links: [{ rel: "canonical", href: "https://quimoratech.com/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-brand focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-primary-foreground"
      >
        Saltar al contenido principal
      </a>
      <ReadingProgress />
      <TopBar />
      <Nav />
      {/* Recorrido comercial. Las seis secciones enlazadas en el navbar (top,
          soluciones, showcase, nosotros, precios, contacto) DEBEN conservar
          este orden relativo: el scroll-spy de Nav depende de él. */}
      {/* tabIndex -1: destino de foco del enlace "Saltar al contenido" y de las
          ventanas del diagnóstico cuando el elemento anterior ya no existe. */}
      <main id="main" tabIndex={-1} className="outline-none">
        {/* 1. Presentación y problema */}
        <Hero />
        <Problem />
        {/* 2. Respaldo y razones para elegirnos */}
        <Stats />
        <Benefits />
        {/* 3. Oferta principal y proyectos */}
        <SoftwareSolutions />
        <Showcase3D />
        {/* 4. Cómo trabajamos */}
        <Timeline />
        {/* 5. Diagnóstico */}
        <DiagnosisShortcuts />
        <DigitalDiagnosis />
        <AuditOffer />
        {/* 6. Precios, preguntas y contacto */}
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingDiagnosis />
      <FloatingWhatsApp />
      {/* Superposición, no sección: la ventana única del diagnóstico (FR-013a). */}
      <DiagnosisDialog />
      {/* Invitación (US3): retirarla solo exige borrar esta línea. */}
      <DiagnosisInvite />
    </div>
  );
}
