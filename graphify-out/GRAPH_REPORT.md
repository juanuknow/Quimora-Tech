# Graph Report - Quimora Tech  (2026-09-03)

## Corpus Check
- Corpus is ~47,936 words - fits in a single context window. You may not need a graph.

## Summary
- 411 nodes · 703 edges · 17 communities (14 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.82)
- Token cost: 184,862 input · 0 output

## Community Hubs (Navigation)
- Docs & Design Rationale
- Routing & Legal Pages
- Landing Page Core Sections
- Digital Diagnosis Wizard
- Marketing Content Components
- Build Tooling (devDependencies)
- Runtime Dependencies & Scripts
- Navigation & Vertical Pages
- TypeScript Config
- Service Detail Pages
- SSR Error Handling
- Web Vitals & Performance Stats
- Root Shell & Error Reporting
- Brand & Client Images
- Anti-AI-Slop Skill

## God Nodes (most connected - your core abstractions)
1. `whatsappHref()` - 19 edges
2. `compilerOptions` - 17 edges
3. `FileRoutesByPath` - 15 edges
4. `useInView()` - 14 edges
5. `FOCUS_RING` - 14 edges
6. `CLAUDE.md — Quimora Tech Landing Page` - 14 edges
7. `SITE_URL` - 13 edges
8. `trackEvent()` - 13 edges
9. `ServiceDetail()` - 11 edges
10. `VerticalDetail()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Diosa's Make Up Logo (public asset)` --semantically_similar_to--> `Quimora Tech Logo (source, img/)`  [AMBIGUOUS] [semantically similar]
  public/images/diosas-cosmeticos.webp → img/logomarca.jpeg
- `Beauty E-commerce Catalog Architect Skill (Diosas Cosméticos)` --semantically_similar_to--> `Regla de oro: solo cifras verificables, nunca prueba social inventada`  [INFERRED] [semantically similar]
  .claude/skills/beauty-catalog-architect.md → docs/PLANTILLA_CASO_DE_EXITO.md
- `Tailwind CSS utility-first styling layer` --semantically_similar_to--> `Paleta monocromática zinc (real en producción)`  [INFERRED] [semantically similar]
  .claude/skills/ui-styling/SKILL.md → CLAUDE.md
- `src/routes/__root.tsx (app shell)` --semantically_similar_to--> `src/routes/__root.tsx`  [INFERRED] [semantically similar]
  src/routes/README.md → .lovable/plan.md
- `Soporte nativo de Dark Mode (Tailwind dark:)` --conceptually_related_to--> `Paleta monocromática zinc (real en producción)`  [AMBIGUOUS]
  .claude/skills/ArquitectoComponentes.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Evolución de identidad visual: plan azul/naranja → paleta zinc real en producción** — lovable_plan, lovable_plan_paleta_azul_naranja, claude_md, claude_md_paleta_zinc, claude_md_tipografia_space_grotesk_inter [INFERRED 0.85]
- **Skills de revisión UX/Accesibilidad convergiendo en los mismos estándares del proyecto** — claude_skills_auditorux, claude_skills_ui_ux_review_skill, claude_skills_anti_ai_slop, claude_md_reglas_accesibilidad [INFERRED 0.75]
- **Flujo de captura de leads: Formspree + site.ts + Contact.tsx** — claude_md_formspree_contacto, claude_md_lib_site_ts, claude_md_component_contact [EXTRACTED 1.00]

## Communities (17 total, 1 thin omitted)

### Community 0 - "Docs & Design Rationale"
Cohesion: 0.05
Nodes (47): AGENTS.md — Lovable Connection Notice, Advertencia: no reescribir historial git publicado (sync con Lovable), CLAUDE.md — Quimora Tech Landing Page, Contact.tsx component, Curvas de animación (ease-out-strong, ease-in-out-strong), Tokens de escala tipográfica (@theme, text-note...text-display-xl), Estructura de directorios real del proyecto, Formulario de Contacto vía Formspree (sin backend propio) (+39 more)

### Community 1 - "Routing & Legal Pages"
Cohesion: 0.06
Nodes (40): LegalPage(), getRouter(), Route, Route, Route, Route, Route, Route (+32 more)

### Community 2 - "Landing Page Core Sections"
Cohesion: 0.11
Nodes (28): Contact(), ContactErrors, FAQ(), FAQ_JSON_LD, FAQS, FinalCTA(), FloatingWhatsApp(), Footer() (+20 more)

### Community 3 - "Digital Diagnosis Wizard"
Cohesion: 0.06
Nodes (32): Answers, BUDGET_OPTIONS, BUDGET_RANK, BudgetId, buildDiagnosis(), bumpComplexity(), BUSINESS_OPTIONS, BusinessId (+24 more)

### Community 4 - "Marketing Content Components"
Cohesion: 0.08
Nodes (28): BenefitCard(), Benefits, PLAN_INCLUDES, PLANS, Pricing(), PricingCard(), PAINS, Problem() (+20 more)

### Community 5 - "Build Tooling (devDependencies)"
Cohesion: 0.05
Nodes (37): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @lovable.dev/vite-tanstack-config (+29 more)

### Community 6 - "Runtime Dependencies & Scripts"
Cohesion: 0.06
Nodes (34): lucide-react, dependencies, lucide-react, react, react-dom, tailwindcss, @tailwindcss/vite, @tanstack/react-router (+26 more)

### Community 7 - "Navigation & Vertical Pages"
Cohesion: 0.12
Nodes (18): IndicatorBox, Nav(), NAV_LINKS, NAV_SECTION_IDS, useActiveIndicator(), useScrolled(), useScrollSpy(), TopBar() (+10 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.07
Nodes (26): DOM, DOM.Iterable, ES2022, eslint.config.js, src/**/*.ts, src/**/*.tsx, vite/client, vite.config.ts (+18 more)

### Community 9 - "Service Detail Pages"
Cohesion: 0.29
Nodes (10): breadcrumbJsonLd(), ServiceDetail(), getServiceBySlug(), SITE_URL, service, service, service, service (+2 more)

### Community 10 - "SSR Error Handling"
Cohesion: 0.25
Nodes (8): consumeLastCapturedError(), renderErrorPage(), fetch(), getServerEntry(), isH3SwallowedErrorBody(), normalizeCatastrophicSsrResponse(), ServerEntry, errorMiddleware

### Community 11 - "Web Vitals & Performance Stats"
Cohesion: 0.21
Nodes (10): LivePerformance(), RATING_CLASS, RATING_LABEL, StatItem(), Stats, useCountUp(), useWebVitals(), VitalRating (+2 more)

### Community 12 - "Root Shell & Error Reporting"
Cohesion: 0.20
Nodes (7): LovableErrorOptions, LovableEvents, reportLovableError(), Window, GA_MEASUREMENT_ID, ErrorComponent(), STRUCTURED_DATA

### Community 13 - "Brand & Client Images"
Cohesion: 0.40
Nodes (6): Diosa's Make Up Logo (source, img/), Quimora Tech Logo (source, img/), Diosa's Make Up Logo (public asset), Diosa's Make Up Store Full Screenshot, Quimora Tech Logo Mark (favicon/icon), Quimora Tech Open Graph Image

## Ambiguous Edges - Review These
- `Soporte nativo de Dark Mode (Tailwind dark:)` → `Paleta monocromática zinc (real en producción)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to
- `Quimora Tech Logo (source, img/)` → `Diosa's Make Up Logo (public asset)`  [AMBIGUOUS]
  img/logomarca.jpeg · relation: semantically_similar_to

## Knowledge Gaps
- **161 isolated node(s):** `name`, `private`, `sideEffects`, `type`, `dev` (+156 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 192 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Soporte nativo de Dark Mode (Tailwind dark:)` and `Paleta monocromática zinc (real en producción)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Quimora Tech Logo (source, img/)` and `Diosa's Make Up Logo (public asset)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `devDependencies` connect `Build Tooling (devDependencies)` to `Runtime Dependencies & Scripts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `FOCUS_RING` connect `Landing Page Core Sections` to `Routing & Legal Pages`, `Digital Diagnosis Wizard`, `Marketing Content Components`, `Navigation & Vertical Pages`, `Service Detail Pages`, `Root Shell & Error Reporting`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `name`, `private`, `sideEffects` to the rest of the system?**
  _161 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Docs & Design Rationale` be split into smaller, more focused modules?**
  _Cohesion score 0.04902867715078631 - nodes in this community are weakly interconnected._
- **Should `Routing & Legal Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06475485661424607 - nodes in this community are weakly interconnected._