import { createFileRoute } from "@tanstack/react-router";
import { DigitalDiagnosis } from "../components/DigitalDiagnosis";
import { DiagnosisDialog } from "../components/DiagnosisDialog";
import { DiagnosisInvite } from "../components/DiagnosisInvite";
import { DiagnosisShortcuts } from "../components/DiagnosisShortcuts";
import { ReadingProgress } from "../components/ReadingProgress";
import { Showcase3D } from "../components/Showcase3D";
import { SoftwareSolutions } from "../components/SoftwareSolutions";
import { Specialists } from "../components/Specialists";
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
import { FinalCTA } from "../components/FinalCTA";
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
      {/* Recorrido comercial por bloques. Las seis secciones enlazadas en el
          navbar (top, soluciones, showcase, nosotros, precios, contacto) DEBEN
          conservar este orden relativo: el scroll-spy de Nav depende de él. */}
      {/* tabIndex -1: destino de foco del enlace "Saltar al contenido" y de las
          ventanas del diagnóstico cuando el elemento anterior ya no existe. */}
      <main id="main" tabIndex={-1} className="outline-none">
        {/* 1. Presentación */}
        <Hero />
        {/* 2. Respaldo técnico y beneficios */}
        <Stats />
        <Benefits />
        {/* 3. Servicios y soluciones */}
        <SoftwareSolutions />
        {/* 4. Casos de éxito */}
        <Showcase3D />
        {/* 5. Cómo trabajamos y especialidades */}
        <Timeline />
        <Specialists />
        {/* 6. Diagnóstico: el problema y la herramienta para resolverlo */}
        <Problem />
        <DiagnosisShortcuts />
        <DigitalDiagnosis />
        {/* 7–9. Precios, objeciones y cierre */}
        <Pricing />
        <FAQ />
        <Contact />
        <FinalCTA />
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
