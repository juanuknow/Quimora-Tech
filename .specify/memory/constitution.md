# Constitución de QuimoraTech.com

## Alcance y relación con otros documentos

Esta constitución define las reglas obligatorias para todo cambio en QuimoraTech.com,
lo haga una persona, Claude, Lovable u otro agente. Contiene principios y
procedimientos verificables; **no** contiene valores concretos.

| Documento | Responde a | Ejemplos |
|---|---|---|
| Esta constitución | **Qué** debe cumplirse y **cómo se verifica** | Autorizaciones, revisión arquitectónica, verificaciones, restricciones |
| `CLAUDE.md` | **Con qué valores** | Paleta, tokens, escala tipográfica, tabla de CTAs, breakpoints |
| Código (`src/styles.css`, `src/lib/site.ts`, `wrangler.jsonc`, `package.json`) | **Valor efectivo** en producción | Hex de cada token, endpoints, versiones, nombre del Worker |
| `docs/ESTRUCTURA.md` | **Dónde** está cada cosa y **cuál es** la arquitectura vigente | Mapa de carpetas, stack, despliegue |

Reglas de conflicto:
1. Entre la constitución y otro documento, prevalece la constitución, y el otro se
   corrige en el mismo cambio.
2. Entre `CLAUDE.md` y el código, el código describe la realidad; se decide en una
   revisión cuál se corrige.
3. Una instrucción expresa del responsable prevalece puntualmente; si debe perdurar,
   se convierte en enmienda.

"DEBE" es obligatorio. "DEBERÍA" se puede omitir justificándolo por escrito en el plan.
"El responsable" es el responsable del proyecto que figura en `CLAUDE.md`.

---

## Parte I — Principios permanentes

### I. Producción protegida
- `main` es producción y está protegida de forma absoluta. Todo push a `main`
  despliega mediante Cloudflare Workers Builds y se sincroniza con Lovable.
- No se hacen commits directamente en `main`. `main` solo avanza integrando una
  rama local temporal autorizada (Principio XII). Esta prohibición aplica a las
  operaciones manuales y al trabajo realizado mediante Claude Code u otros agentes
  bajo control del proyecto.
- Lovable puede actualmente sincronizar cambios directamente con `main`. Ese
  mecanismo existente no queda cubierto por la prohibición anterior y se evaluará
  y gobernará por separado.
- Esta protección es normativa. Mientras no se configure protección de rama en
  GitHub, no existe protección técnica de `main`, y ningún documento ni informe
  DEBE afirmar que existe.
- Requieren **autorización expresa del responsable, para ese cambio concreto**:
  todo commit, merge, push, publicación de ramas, despliegue (incluido
  `wrangler deploy`) y cambio en Cloudflare, Lovable o DNS. Una autorización no se
  extiende a otros cambios ni a otras fases.
- Está prohibido reescribir historia publicada: force push, o rebase/amend/squash
  de commits ya publicados.
- `main` DEBE quedar siempre construible y funcional.

### II. Arquitectura preservada, evolución gobernada
- La arquitectura vigente es la documentada en `docs/ESTRUCTURA.md`: hoy, TanStack
  Start, React, Vite, Tailwind CSS v4 y Nitro sobre Cloudflare Workers, con
  renderizado en servidor, una sección por componente, rutas que solo componen y
  fuentes de datos únicas. Se preserva por defecto.
- **Actualizaciones habituales** (versiones de parche o menores, versiones mayores
  de la misma herramienta sin cambio de modelo, ajustes de configuración): no
  requieren enmienda ni revisión formal. Siguen el flujo normal de cambios según su
  riesgo (Principio IV) y respetan el bloqueo de 24 h de `bunfig.toml`.
- **Sustituciones arquitectónicas significativas** requieren una **revisión
  arquitectónica formal** aprobada por el responsable antes de implementarse. Son:
  reemplazar el framework, el router, el sistema de estilos, la herramienta de build,
  el hosting o el runtime; cambiar el modelo de renderizado; añadir persistencia,
  backend propio o autenticación; o romper la compatibilidad con Lovable.
- La revisión arquitectónica formal se registra en el `research.md` o `plan.md` de la
  funcionalidad e incluye: problema, alternativas (incluida "no hacer nada"), impacto
  en rendimiento, seguridad, privacidad, coste y Lovable, plan de migración y plan de
  reversión. Aprobada, se actualizan `docs/ESTRUCTURA.md` y `CLAUDE.md` en el mismo
  cambio. Solo se enmienda la constitución si la sustitución contradice un principio.
- **Dependencias nuevas:** la justificación escala con el riesgo:

  | Riesgo | Ejemplos | Justificación exigida |
  |---|---|---|
  | Bajo | Herramienta solo de desarrollo, sin efecto en el build de producción | Propósito y alternativa considerada |
  | Medio | Dependencia de runtime en el cliente | Además: impacto en el bundle, mantenimiento y licencia |
  | Alto | Afecta al build o al SSR, añade un origen de red externo, procesa datos de usuarios | Además: CSP, privacidad, plan de reversión y aprobación expresa antes de instalar |

### III. Especificación antes de implementación
- Ningún agente implementa una **funcionalidad importante** sin una spec y un plan
  **aprobados** por el responsable.
- Es funcionalidad importante: una sección o ruta nueva; una integración o servicio
  externo; un cambio en la captura de leads, la analítica o los textos legales; una
  sustitución arquitectónica (Principio II); o cualquier cambio de **riesgo alto**
  (Principio IV).
- Flujo: `/speckit-specify` → (`/speckit-clarify`) → `/speckit-plan` (con
  Constitution Check) → `/speckit-tasks` → (`/speckit-analyze`) → **aprobación** →
  `/speckit-implement`.
- Los cambios menores (texto, estilo local, corrección acotada de bajo riesgo)
  pueden ir sin spec, pero DEBEN pasar las verificaciones aplicables de la Parte III.
- Los skills de Spec Kit solo se invocan explícitamente por el usuario
  (`disable-model-invocation: true`).

### IV. Reversión proporcional al riesgo
Todo cambio declara su nivel de riesgo y cumple la reversión correspondiente:

| Riesgo | Ejemplos | Plan de reversión exigido |
|---|---|---|
| Bajo | Texto, documentación, estilos que no alteran el layout | `git revert` del commit |
| Medio | Componentes, rutas nuevas, dependencias de runtime, cambios de layout | `git revert` + señal de fallo definida (qué mirar en producción) + verificación posterior al despliegue |
| Alto | `src/server.ts`, cabeceras/CSP/HSTS, `wrangler.jsonc`, `vite.config.ts`, dependencias de build, formulario/Formspree, analítica, DNS/Cloudflare, sustituciones arquitectónicas | Plan escrito **antes** de implementar; versión previa de Cloudflare identificada para revertir; despliegue con supervisión inmediata; CSP siempre primero en `Report-Only` |

Cada entrega DEBE poder revertirse sin afectar otras: commits atómicos y sin mezclar
cambios no relacionados.

### V. Calidad de código
- TypeScript estricto; sin `any` ni `@ts-ignore` sin justificación en un comentario.
- Errores explícitos: no se tragan excepciones y todo flujo asíncrono tiene estados
  de carga, éxito y error.
- Sin `console.log` en el cliente; `console.error` solo en la capa de captura del servidor.
- Se aplican los estándares de código de `CLAUDE.md`. Nada provisional llega a `main`.

### VI. Rendimiento
- **Objetivo:** Lighthouse móvil ≥ 95 en Performance, Accessibility, Best Practices y
  SEO; Core Web Vitals al percentil 75: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- **Antes de exigir umbrales comparativos** DEBEN existir, documentados y aprobados:
  1. un **procedimiento reproducible** (entorno, cómo se sirve el build, versión de
     Lighthouse, dispositivo y throttling, rutas, número de ejecuciones, estadístico); y
  2. una **línea base** medida con ese procedimiento (fecha, commit, puntuaciones
     por ruta).
- Mientras no existan, las mediciones son **informativas**: se registran con su
  método y no bloquean la integración. Una puntuación que empeore visiblemente se
  señala y se justifica.
- Cuando existan, la integración se bloquea si una categoría cae más de 3 puntos
  frente a la línea base, o si se cruza un umbral de Core Web Vitals, salvo
  justificación escrita aprobada. La línea base solo se actualiza con aprobación.
- Los presupuestos concretos (orígenes externos, fuentes, imágenes, animación) son
  los de `CLAUDE.md`.

### VII. Accesibilidad: WCAG 2.2 AA
- WCAG 2.2 nivel AA es el estándar mínimo. Las reglas más estrictas de `CLAUDE.md`
  (por ejemplo, objetivos de 44 px) prevalecen sobre el mínimo.
- Las herramientas automáticas (Lighthouse, axe) detectan solo una parte de los
  criterios. **No se declara conformidad WCAG 2.2 AA basándose solo en
  herramientas automáticas.**
- Declarar conformidad exige una **revisión manual documentada** que cubra al menos:
  operación completa con teclado y orden de foco (2.1.1, 2.4.3); foco visible y no
  tapado por elementos fijos (2.4.7, 2.4.11); contraste medido de texto y componentes
  (1.4.3, 1.4.11); zoom al 200 % y reflujo a 320 px (1.4.4, 1.4.10); tamaño de
  objetivo (2.5.8); formularios con etiquetas, errores en texto e instrucciones
  (1.3.1, 3.3.1, 3.3.2); movimiento reducido; y una prueba puntual con lector de
  pantalla (NVDA en Windows o VoiceOver).
- En un cambio individual se informa "sin fallos conocidos en los criterios
  revisados", indicando cuáles. La conformidad del sitio solo se declara tras una
  auditoría manual completa.

### VIII. Diseño responsive y sistema visual
- Mobile-first. Cada cambio visual se verifica en 375, 768 y 1440 px y en reflujo
  a 320 px.
- La identidad visual (paleta zinc monocromática, tipografías, escala, tokens,
  radios, movimiento) y el sistema de CTAs son **normativos tal como están en
  `CLAUDE.md` y en el código**.
- No se introducen valores fuera de los tokens. Un token o una etiqueta de CTA
  nuevos se documentan en `CLAUDE.md` en el mismo cambio.

### IX. SEO técnico
- Cada ruta indexable tiene `title` y `description` únicos, `canonical` absoluto,
  Open Graph completo y un único H1. El contenido principal se renderiza en el servidor.
- Toda ruta nueva se añade a `sitemap.xml`. Renombrar una ruta exige redirección 301.
  El JSON-LD se mantiene coherente con `src/lib/site.ts`.

### X. Secretos e información confidencial
- **El repositorio es público.** Nunca entran en git, ni en specs, planes o esta
  constitución: credenciales, tokens, claves, `.env*`, `.dev.vars`, datos de
  clientes o leads, precios o acuerdos confidenciales ni información interna no
  publicable.
- Solo se versionan identificadores públicos por diseño (endpoint de Formspree,
  ID de GA4). Los secretos de ejecución van en `wrangler secret` o en el panel;
  nunca en variables `VITE_*`.
- Antes de cada commit se revisa `git diff --cached`, incluido el contenido completo
  de los archivos nuevos preparados para Git (V8). Si se detecta información
  confidencial, el proceso se detiene antes de registrar el commit. Los informes
  nunca reproducen un secreto.
- Las cabeceras del Worker y las de `public/_headers` mantienen una sola política.
  Un origen externo nuevo implica actualizar la CSP y la política de privacidad en
  el mismo cambio.

### XI. Veracidad del contenido
- No se publican testimonios, logos, cifras, reseñas ni casos inventados. Solo se
  publica lo verificable y con permiso escrito.

### XII. Ramas, commits y revisión
- **Metodología:** todo trabajo se hace en una **rama local temporal**
  `tipo/descripcion` creada desde `main` actualizada. Se integra en `main` con
  fast-forward o merge, con autorización expresa, y se elimina después de integrarse.
- Las ramas de trabajo no se publican en GitHub salvo autorización expresa. La
  autorización habitual es para obtener una **vista previa**: Cloudflare compila
  cada rama publicada y la sirve en
  `https://<rama>-quimoratech.<subdominio>.workers.dev`, con
  `X-Robots-Tag: noindex` y sin afectar a producción.
- La vista previa es pública para quien tenga la URL. No se publica una rama
  con contenido no publicable (Principio X).
- Todo cambio visible (UI, contenido, layout, movimiento) y todo cambio de
  riesgo alto se verifica en su vista previa antes de integrarse en `main`.
- La rama remota se elimina tras integrarse o descartarse. La rama local, también.
- Conventional Commits en minúscula (`feat`, `fix`, `docs`, `style`, `refactor`,
  `perf`, `test`, `chore`, `security`). Cada mensaje explica el porqué, el riesgo y
  cómo se verificó.
- Todo cambio se presenta como diff revisable antes de pedir la autorización del commit.

---

## Parte II — Restricciones temporales del MVP

Son restricciones de etapa, **no principios permanentes**.

| Restricción vigente | Alternativa vigente |
|---|---|
| Sin base de datos | Contenido en código (`src/lib/*-data.ts`) |
| Sin CMS ni blog | Contenido versionado en el repo |
| Sin backend propio más allá del Worker SSR | Formspree para formularios |
| Sin autenticación ni panel administrativo | — |
| Sin pagos, cotizador automático ni CRM | Cotización por formulario y WhatsApp |
| Sin selector de dark mode | Solo modo claro |
| Sin funcionalidades nuevas sin una necesidad demostrada | YAGNI |

**Revisión de una restricción:** se puede levantar o modificar cuando exista una
necesidad **comercial o técnica justificada**. La propuesta escrita DEBE incluir:
la necesidad y su evidencia (cliente, oportunidad, métrica o limitación técnica), por
qué no basta la alternativa vigente, el coste y el riesgo. Requiere **aprobación
expresa del responsable** y, si implica una sustitución arquitectónica, la revisión
formal del Principio II. Aprobada, se registra como enmienda MINOR.

Lo ya construido queda aceptado. La lista "NO hacer en MVP" de `CLAUDE.md` aplica
a funcionalidades nuevas.

---

## Parte III — Verificaciones

Una verificación solo es **obligatoria** si está **disponible**: con su comando o
procedimiento definido y ejecutable. Las **pendientes** pasan a ser obligatorias
cuando se documenta su procedimiento y lo aprueba el responsable (enmienda PATCH).

### III.a Disponibles (obligatorias)

| ID | Verificación | Comando / procedimiento | Pasa si | Cuándo |
|---|---|---|---|---|
| V1 | Tipos | `bunx tsc --noEmit` | código de salida 0 | Todo cambio de código |
| V2 | Lint | `bun run lint` | código de salida 0 | Todo cambio de código |
| V3 | Formato | `bunx prettier --check <archivos modificados>`; nunca `--write .` | código de salida 0 | Todo cambio de código y todo documento nuevo |
| V4 | Build | `bun run build` | código de salida 0 | Riesgo medio y alto; siempre antes de integrar en `main` |
| V5 | Recorridos críticos | Manual en `bun run dev` o en la vista previa de la rama: formulario (éxito y error), enlaces de WhatsApp, anclas en escritorio y móvil, páginas legales, 404; consola sin errores | Todos funcionan | Si el cambio los toca |
| V6 | Responsive | DevTools en 375 / 768 / 1440 px y 320 px, en `bun run dev` o en la vista previa de la rama | Sin desbordes, solapamientos ni scroll horizontal | Cambios visuales |
| V7 | Accesibilidad del cambio | Revisión manual de los criterios del Principio VII que el cambio afecta | Sin fallos en los criterios revisados, listados | Cambios de UI o contenido |
| V8 | Secretos | Revisión de `git diff --cached` antes de cada commit, incluido el contenido completo de los archivos nuevos preparados | Sin datos de la lista del Principio X; si aparecen, se detiene antes del commit sin reproducirlos en el informe | Todo commit |
| V9 | Después del despliegue | Confirmar en el historial de compilaciones que existe una compilación de `main` para el commit publicado; check de GitHub "Workers Builds" en verde + `curl -I https://quimoratech.com/` (cabeceras) + carga de `/` y de una ruta de servicio; si no existe, no dar la entrega por publicada y avisar al responsable | Todo correcto | Después de cada push a `main` |
| V10 | Vista previa | Publicar la rama, esperar el check "Workers Builds" en verde y revisar la URL de vista previa: consola sin errores, cabeceras de seguridad presentes y los recorridos que el cambio toca | Todo correcto | Cambios visibles y cambios de riesgo alto, antes de integrar en `main` |

### III.b Pendientes (no bloquean hasta estar disponibles)

| ID | Verificación | Qué falta para activarla |
|---|---|---|
| P1 | Lighthouse con umbral comparativo | Procedimiento reproducible y línea base (Principio VI); confirmar cómo servir el build de producción en local |
| P2 | Core Web Vitals de campo | Confirmar adónde envía datos `use-web-vitals.ts` y cómo se consultan al percentil 75 |
| P3 | Avisos nuevos del build | Registrar la línea base de avisos actuales de `bun run build` |
| P4 | Formato del repositorio completo | Normalizar en una fase aparte los documentos con formato pendiente; hasta entonces V3 no se aplica a ellos |
| P5 | Pruebas automatizadas | Decisión sobre un ejecutor de pruebas (por ejemplo, Vitest para `src/lib/`) |
| P6 | Escáner automático de secretos | Decisión sobre la herramienta (por ejemplo, gitleaks) |
| P7 | Auditoría WCAG 2.2 AA completa | Revisión manual de todo el sitio (Principio VII) |

Si una verificación disponible no se puede ejecutar en un cambio concreto, se declara
con el motivo; nunca se omite en silencio.

## Parte IV — Definición de terminado

Un cambio está terminado cuando: cumple sus criterios de aceptación (Dado/Cuando/
Entonces medibles en la spec si la hay); pasa las verificaciones **disponibles** que
le aplican, con evidencia registrada; declara su nivel de riesgo y su plan de
reversión; actualiza `CLAUDE.md` o `docs/` si cambió una convención; y tiene
autorización expresa antes de integrarse. Una entrega en producción se cierra cuando
V9 está en verde.

## Parte V — Gobernanza

- **Enmiendas:** propuesta escrita → aprobación del responsable → en el mismo commit
  se actualizan la constitución y los documentos afectados → se sube la versión.
- **Versionado de la constitución:** MAJOR al eliminar o redefinir de forma
  incompatible un principio. MINOR al añadir un principio o sección, o modificar una
  restricción del MVP. PATCH para redacción, aclaraciones o activar una verificación
  pendiente. Las actualizaciones habituales del stack no cambian la versión.
- **Cumplimiento:** `/speckit-plan` evalúa el Constitution Check. Cada excepción se
  registra en "Complexity Tracking" con justificación y fecha de caducidad.
- **Revisión completa:** ante una sustitución arquitectónica significativa, al
  levantar una restricción del MVP, o a petición del responsable.

**Versión:** 1.1.2 | **Ratificada:** 2026-11-06 | **Última enmienda:** 2026-11-10
