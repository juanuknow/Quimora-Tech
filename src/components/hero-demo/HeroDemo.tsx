import { useEffect, useId, useRef, useState } from "react";
import type { FocusEvent } from "react";
import { Pause, Play } from "lucide-react";
import { FOCUS_RING, trackEvent } from "../../lib/site";
import { HERO_DEMOS, HERO_DEMO_KEYS } from "../../lib/hero-demo-data";
import { RestaurantDemo } from "./RestaurantDemo";
import { StoreDemo } from "./StoreDemo";
import { ClinicDemo } from "./ClinicDemo";
import { RealEstateDemo } from "./RealEstateDemo";
import "./hero-demo.css";

const DEMO_COMPONENTS = [RestaurantDemo, StoreDemo, ClinicDemo, RealEstateDemo];

export function HeroDemo() {
  const id = useId();
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const data = HERO_DEMOS[HERO_DEMO_KEYS[active]];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setPageHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const rotating = !userPaused && !hovering && !focusInside && !reducedMotion && !pageHidden;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % HERO_DEMO_KEYS.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [rotating]);

  function select(index: number, focus = false) {
    setUserPaused(true);
    setActive(index);
    trackEvent("hero_business_select", { vertical: HERO_DEMO_KEYS[index] });
    if (focus) tabs.current[index]?.focus();
  }

  function handleFocusOut(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false);
  }

  return (
    <div
      className="hero-demo w-full min-w-0 text-brand"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovering(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovering(false);
      }}
    >
      <p className="text-caption font-semibold text-muted-foreground" id={`${id}-label`}>
        ¿Qué negocio tienes?
      </p>
      <div
        className="mt-2.5 flex flex-wrap gap-2"
        role="tablist"
        aria-labelledby={`${id}-label`}
        onFocus={() => setFocusInside(true)}
        onBlur={handleFocusOut}
      >
        {HERO_DEMO_KEYS.map((key, index) => (
          <button
            key={key}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            type="button"
            className={`min-h-11 cursor-pointer rounded-full border px-3.5 text-caption font-semibold transition-colors motion-reduce:transition-none max-[400px]:px-3 ${active === index ? "border-brand bg-brand text-white" : "border-hairline bg-background text-brand hover:bg-brand-soft"} ${FOCUS_RING}`}
            role="tab"
            id={`${id}-tab-${key}`}
            aria-controls={`${id}-panel-${key}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => {
              let next: number;
              switch (event.key) {
                case "ArrowRight":
                  next = (index + 1) % HERO_DEMO_KEYS.length;
                  break;
                case "ArrowLeft":
                  next = (index + HERO_DEMO_KEYS.length - 1) % HERO_DEMO_KEYS.length;
                  break;
                case "Home":
                  next = 0;
                  break;
                case "End":
                  next = HERO_DEMO_KEYS.length - 1;
                  break;
                default:
                  return;
              }
              event.preventDefault();
              select(next, true);
            }}
          >
            {HERO_DEMOS[key].label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-caption text-muted-foreground">
        <span>Ejemplo ficticio</span>
        {!reducedMotion && (
          <button
            type="button"
            className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-hairline px-3 text-brand transition-colors hover:bg-brand-soft motion-reduce:transition-none ${FOCUS_RING}`}
            aria-label={
              userPaused
                ? "Reanudar el cambio automático de ejemplos"
                : "Pausar el cambio automático de ejemplos"
            }
            onClick={() => setUserPaused((value) => !value)}
          >
            {userPaused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
            {userPaused ? "Reanudar" : "Pausar"}
          </button>
        )}
      </div>
      <div className="window">
        <div className="bar" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="url">{data.domain}</span>
        </div>
        <div className="screen">
          {HERO_DEMO_KEYS.map((key, index) => {
            const demo = HERO_DEMOS[key];
            const Demo = DEMO_COMPONENTS[index];
            const Logo = demo.logo;
            const visible = index === active;
            return (
              <div
                key={key}
                className={`view${visible ? " on" : ""}`}
                role="tabpanel"
                id={`${id}-panel-${key}`}
                aria-labelledby={`${id}-tab-${key}`}
                aria-hidden={!visible}
                inert={!visible}
                tabIndex={visible ? 0 : -1}
                onFocus={() => setFocusInside(true)}
                onBlur={handleFocusOut}
              >
                <div className="nav">
                  <span className="logo">
                    <Logo />
                    {demo.name}
                  </span>
                  <span className="links">
                    {demo.navigation.map((text) => (
                      <span key={text}>{text}</span>
                    ))}
                  </span>
                </div>
                <Demo />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p
          className="max-w-[22rem] text-ui leading-[1.45] text-foreground"
          role="status"
          aria-live={rotating && !reducedMotion ? "off" : "polite"}
        >
          {data.benefit}
        </p>
        <a
          className={`inline-flex min-h-11 items-center rounded-md bg-cta px-[18px] py-2.5 text-ui font-semibold text-white transition-colors hover:bg-cta-hover motion-reduce:transition-none ${FOCUS_RING}`}
          href={`/para/${HERO_DEMO_KEYS[active]}`}
          onClick={() => trackEvent("hero_business_cta", { vertical: HERO_DEMO_KEYS[active] })}
        >
          Quiero una web así →
        </a>
      </div>
    </div>
  );
}
