import { createElement, useEffect, useId, useRef, useState } from "react";
import { trackEvent } from "../../lib/site";
import { HERO_DEMOS, HERO_DEMO_KEYS } from "../../lib/hero-demo-data";
import type { DemoLogoNode } from "../../lib/hero-demo-data";
import { RestaurantDemo } from "./RestaurantDemo";
import { StoreDemo } from "./StoreDemo";
import { ClinicDemo } from "./ClinicDemo";
import { RealEstateDemo } from "./RealEstateDemo";
import "./hero-demo.css";

const DEMO_COMPONENTS = [RestaurantDemo, StoreDemo, ClinicDemo, RealEstateDemo];

function renderLogo(node: DemoLogoNode, key = 0): React.ReactNode {
  return createElement(
    node.tag,
    { ...node.props, key, ...(node.tag === "svg" ? { "aria-hidden": true } : {}) },
    ...node.children.map((child, index) => renderLogo(child, index)),
  );
}

export function HeroDemo() {
  const id = useId();
  const [active, setActive] = useState(0);
  const [rotating, setRotating] = useState(true);
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
    if (!rotating || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % HERO_DEMO_KEYS.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [rotating, reducedMotion]);

  function select(index: number, focus = false) {
    setRotating(false);
    setActive(index);
    trackEvent("hero_business_select", { vertical: HERO_DEMO_KEYS[index] });
    if (focus) tabs.current[index]?.focus();
  }

  return (
    <div className="hero-demo min-w-0" onPointerEnter={() => setRotating(false)}>
      <p className="picker-label" id={`${id}-label`}>
        ¿Qué negocio tienes?
      </p>
      <div className="chips" role="tablist" aria-labelledby={`${id}-label`}>
        {HERO_DEMO_KEYS.map((key, index) => (
          <button
            key={key}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            type="button"
            className="chip"
            role="tab"
            id={`${id}-tab-${key}`}
            aria-controls={`${id}-panel-${key}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onFocus={() => setRotating(false)}
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
      <div className="demo-caption">
        <span>Ejemplo ficticio</span>
        {!reducedMotion && (
          <button type="button" onClick={() => setRotating((value) => !value)}>
            {rotating ? "Pausar ejemplos" : "Rotar ejemplos"}
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
                onFocus={() => setRotating(false)}
              >
                <div className="nav">
                  <span className="logo">
                    {renderLogo(demo.logo)}
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
      <div className="result">
        <p role="status" aria-live={rotating && !reducedMotion ? "off" : "polite"}>
          {data.benefit}
        </p>
        <a
          className="want"
          href={`/para/${HERO_DEMO_KEYS[active]}`}
          onClick={() => trackEvent("hero_business_cta", { vertical: HERO_DEMO_KEYS[active] })}
        >
          Quiero una web así →
        </a>
      </div>
    </div>
  );
}
