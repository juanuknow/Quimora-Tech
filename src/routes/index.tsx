import { createFileRoute } from "@tanstack/react-router";
import { DigitalDiagnosis } from "../components/DigitalDiagnosis";
import { Showcase3D } from "../components/Showcase3D";
import { SoftwareSolutions } from "../components/SoftwareSolutions";
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
      <TopBar />
      <Nav />
      <main id="main">
        <Hero />
        <DigitalDiagnosis />
        <Problem />
        <Benefits />
        <SoftwareSolutions />
        <Showcase3D />
        <Stats />
        <Timeline />
        <Pricing />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
