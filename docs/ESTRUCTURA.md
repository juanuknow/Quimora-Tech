# Estructura del repositorio

Mapa de cómo está distribuido todo en `quimoratech.com`. Para el "por qué" de las
decisiones de diseño y los estándares de código, ver [`CLAUDE.md`](../CLAUDE.md).

## 1. Flujo de trabajo y ramas

- **Una sola rama: `main`.** Es la rama de producción y la única que existe.
- El repositorio está conectado a **Lovable**: los commits a `main` se sincronizan
  con su editor. Por eso **no se reescribe historia** (sin `push --force`, ni
  `rebase`/`amend`/`squash` de commits ya publicados) y no se renombra la rama.
  Ver [`AGENTS.md`](../AGENTS.md).
- Convención de commits en el historial: prefijo en mayúsculas (`FIX:`, `FEAT:`)
  y mensaje en español que explica el porqué.

## 2. Árbol de carpetas

```
.
├── src/                      Código de la aplicación
│   ├── routes/               Páginas (enrutado por archivos de TanStack Start)
│   ├── components/           Componentes de React (una sección = un archivo)
│   ├── lib/                  Datos, hooks y utilidades compartidas
│   ├── router.tsx            Creación del router
│   ├── server.ts             Entrada SSR (envuelve errores; la usa Nitro)
│   ├── start.ts              Arranque de TanStack Start
│   ├── routeTree.gen.ts      ⚠ Generado automáticamente, no editar a mano
│   └── styles.css            Tailwind v4: tokens, tipografía, animaciones
├── public/                   Estáticos servidos tal cual
│   ├── _headers              Cabeceras de los ESTÁTICOS (caché y seguridad); no llegan al HTML SSR (ver §7)
│   ├── fonts/                Inter y Space Grotesk (variables, autoalojadas)
│   ├── images/               Capturas del showcase (webp) y logo
│   ├── videos/               soluciones.mp4 (carga diferida)
│   ├── og-image.png          Imagen Open Graph 1200×630
│   ├── favicon.ico · robots.txt · sitemap.xml
├── docs/                     Documentación del proyecto
│   ├── ESTRUCTURA.md         Este archivo
│   ├── PLANTILLA_CASO_DE_EXITO.md
│   └── assets/               Imágenes fuente (no se sirven en el sitio)
├── .claude/                  Configuración de Claude Code para este repo
│   ├── launch.json           Servidor de desarrollo (puerto 8080)
│   └── skills/               Guías de diseño y revisión usadas por el asistente
├── .lovable/                 Metadatos del proyecto en Lovable
├── CLAUDE.md                 Instrucciones y estándares del proyecto
├── AGENTS.md                 Aviso de integración con Lovable
├── wrangler.jsonc            Configuración del Worker en Cloudflare
├── vite.config.ts            Config vía @lovable.dev/vite-tanstack-config
├── package.json              Scripts y dependencias
├── bun.lock                  Lockfile único de Bun (ver sección 7)
├── tsconfig.json · eslint.config.js · .prettierrc · .prettierignore
└── .gitignore
```

No se versionan (están en `.gitignore`): `node_modules/`, `.output/`, `.tanstack/`,
`.wrangler/` y `graphify-out/` (caché generada de graphify; se regenera con `/graphify`).

## 3. Rutas (`src/routes/`)

| Archivo | URL | Contenido |
| --- | --- | --- |
| `__root.tsx` | (todas) | Layout raíz: `<head>`, meta, Open Graph, schema.org, 404 y página de error |
| `index.tsx` | `/` | Landing: solo compone las secciones (ver sección 4) |
| `privacidad.tsx` | `/privacidad` | Política de privacidad (Ley 1581) |
| `terminos.tsx` | `/terminos` | Términos y condiciones |
| `servicios/*.tsx` | `/servicios/<slug>` | 6 páginas de servicio: `desarrollo-web`, `landing-pages`, `tiendas-online`, `sistemas-de-inventario`, `sistemas-de-facturacion`, `automatizacion-de-procesos` |
| `para/*.tsx` | `/para/<rubro>` | 4 páginas por tipo de negocio: `tiendas`, `restaurantes`, `clinicas`, `inmobiliarias` |

Cada ruta de `servicios/` y `para/` es un archivo delgado: define el `<head>` (título,
descripción, canonical) y delega el cuerpo en una plantilla compartida
(`ServiceDetail` o `VerticalDetail`) alimentada por `src/lib/`.

> El slug `sistemas-de-facturacion` se conserva aunque el servicio se llama ahora
> "Control de ventas, caja y cotizaciones", para no romper el sitemap ni enlaces
> ya indexados.

## 4. Componentes (`src/components/`)

**Regla:** una sección = un archivo. `routes/index.tsx` solo las ordena.

### Orden de la landing (`/`)

| Posición | Sección | Componente |
| --- | --- | --- |
| 1 | Presentación | `Hero` |
| 2 | Problema | `Problem` |
| 3 | Estándares | `Stats` |
| 4 | Beneficios | `Benefits` |
| 5 | Servicios | `SoftwareSolutions` |
| 6 | Proyectos | `Showcase3D` |
| 7 | Cómo trabajamos | `Timeline` |
| 8 | Atajos de diagnóstico | `DiagnosisShortcuts` |
| 9 | Diagnóstico | `DigitalDiagnosis` |
| 10 | Auditoría | `AuditOffer` |
| 11 | Precios | `Pricing` |
| 12 | Preguntas frecuentes | `FAQ` |
| 13 | Contacto | `Contact` |

Los fondos de secciones contiguas alternan (blanco, gris, oscuro) para que no se
fundan entre sí; al mover una sección, revisar sus vecinas. Las seis secciones
enlazadas en el navbar (`top`, `soluciones`, `showcase`, `nosotros`, `precios`,
`contacto`) deben conservar su orden relativo: el scroll-spy de `Nav` depende de él.

### Por función

| Grupo | Componentes |
| --- | --- |
| Estructura del sitio | `TopBar`, `Nav`, `Footer`, `FloatingWhatsApp`, `WhatsAppIcon`, `NewTabHint`, `ReadingProgress` |
| Secciones de la landing | `Hero`, `Problem`, `Stats`, `Benefits`, `SoftwareSolutions`, `Showcase3D`, `Timeline`, `DiagnosisShortcuts`, `DigitalDiagnosis`, `AuditOffer`, `Pricing`, `FAQ`, `Contact` |
| Diagnóstico (lead magnet) | `DigitalDiagnosis` (presentación de la sección `#diagnostico` y su botón), `DiagnosisDialog` (ventana única: 5 preguntas, resultado, WhatsApp y copiar), `DiagnosisInvite` (invitación de la home a los 2,5 s: ventana con ≥ 768 × 640 px o tarjeta inferior medida y suprimible), `DiagnosisShortcuts` (atajos que abren la ventana con el negocio ya elegido), `FloatingDiagnosis` (botón flotante de la home: comenzar o, tras terminar, ver el resultado y volver a empezar). Todos abren la misma ventana con `requestDiagnosis()` |
| Catálogo de soluciones | `SoftwareSolutions` (sección: cabecera, catálogo y CTA), `SolutionsCatalog` (3 pestañas con teclado), `SolutionCard` (tarjeta), `SolutionsVisual` (mockup y vídeo ambiental) |
| Portafolio | `Showcase3D` (caso destacado), `ShowcaseGallery` (capturas con pestañas), `BrowserChrome` (marco de navegador y barra de ventana), `DesktopAppChrome` (marco de aplicación de escritorio) |
| Plantillas de página | `ServiceDetail` (`/servicios/*`), `VerticalDetail` (`/para/*`), `LegalPage` (`/privacidad`, `/terminos`) |
| Movimiento reutilizable | `Reveal` (entrada escalonada al verse), `FlowConnector` (línea que se dibuja entre secciones) |

## 5. Datos y utilidades (`src/lib/`)

| Archivo | Responsabilidad |
| --- | --- |
| `site.ts` | **Fuente única** de contacto (WhatsApp, correo, teléfonos), `SITE_URL`, endpoint de Formspree, ID de Google Analytics, `trackEvent` y los anillos de foco `FOCUS_RING` / `LIGHT_RING`. No hardcodear estos valores en componentes. |
| `services-data.ts` | Catálogo de servicios y soluciones, y las 3 categorías del catálogo (`SERVICE_CATEGORIES`); cada servicio declara un `id` estable (`ServiceId`) y su `category` (alimenta `SolutionsCatalog`, `ServiceDetail`, `Nav`, `Footer` y el motor del diagnóstico) |
| `pricing-data.ts` | **Fuente única** de los planes de la sección Precios (`PLANS`, `PLAN_INCLUDES`); la usan `Pricing` y, sin precios, el motor del diagnóstico (componentes del plan Emprendedor) |
| `verticals-data.ts` | Contenido de las páginas por rubro `/para/*` (alimenta `VerticalDetail`) |
| `diagnosis.ts` | Tipos de negocio del Diagnóstico, texto de apoyo aprobado (`DIAGNOSIS_INTRO`) y `requestDiagnosis({ source, business? })`, el único punto de apertura de la ventana |
| `diagnosis-engine.ts` | Motor puro del Diagnóstico (sin React ni DOM): opciones de las preguntas 2–5, `recommend()` (reglas R-P, R-K, R-C y R-N de `specs/001-diagnostico-captacion/spec.md`) y `buildWhatsAppMessage()`. Sin precios ni plazos |
| `diagnosis-invite.ts` | Estado de la invitación en la sesión (`sessionStorage` `qt:diagnosis-invite`, con respaldo en memoria) |
| `diagnosis-result.ts` | Últimas respuestas terminadas en la visita (`sessionStorage` `qt:diagnosis-last-answers`, con respaldo en memoria); alimenta `FloatingDiagnosis` y `DiagnosisDialog` |
| `hooks.ts` | `useInView` (disparar al entrar en pantalla) y `useTilt` (inclinación 3D con el cursor) |
| `error-capture.ts`, `error-page.ts` | Captura de errores en SSR y página de error genérica |
| `lovable-error-reporting.ts` | Integración de reporte de errores de Lovable |

## 6. Estilos y animación (`src/styles.css`)

- **Tokens en `@theme`:** colores (paleta monocromática zinc), escala tipográfica
  (`text-note` … `text-display-xl`) y curvas (`ease-out-strong`, `ease-in-out-strong`).
- **Animaciones:** `@keyframes` nombrados (`rise-in`, `draw-stroke`, `reading-progress`…)
  y, al final, el bloque `prefers-reduced-motion` que las desactiva.
- Reglas de movimiento: solo `transform`/`opacity`, sin `transition-all`, interfaz
  por debajo de 300 ms, y siempre contemplar movimiento reducido.

## 7. Despliegue y build

- **Build:** `vite build` (Nitro, destino Cloudflare) genera `.output/`.
- **Hosting:** Cloudflare Workers. `wrangler.jsonc` es la fuente de verdad de la
  configuración del Worker (nombre, `compatibility_date`, observabilidad).
  El nombre del Worker (`juanuknow-conversion-craft-96`) viene del nombre antiguo
  del repositorio; **cambiarlo crea un Worker nuevo**, no renombra el existente.
- **Dominio:** `quimoratech.com`.
- **Cabeceras HTTP:** `public/_headers` solo se aplica a Static Assets; el HTML SSR,
  las redirecciones y los errores reciben sus cabeceras desde
  `src/lib/security-headers.ts`, mediante `src/server.ts` solo en producción.
  - El Worker añade las cuatro cabeceras previas, HSTS con el mismo valor que los
    estáticos y `Content-Security-Policy` activa, idéntica a la CSP de
    `public/_headers`.
  - Todo origen externo nuevo exige actualizar la política en
    `src/lib/security-headers.ts` y `public/_headers` en el mismo cambio; de lo
    contrario, el navegador lo bloqueará.
  - Se conservan `'unsafe-inline'` por compatibilidad. Nonces y un endpoint de
    reportes quedan como mejoras futuras. No se altera la vista previa de
    Lovable: el wrapper sigue desactivado en desarrollo.
  - Los archivos sin hash en el nombre (`/fonts`, `/images`, `/videos`, `favicon.ico`,
    `og-image.png`) llevan `Cache-Control: max-age=3600, stale-while-revalidate=86400`:
    si se reemplaza uno conservando el nombre, tarda como máximo ~1 h en verse (más una
    vista intermedia con la copia vieja, de ≤25 h). Solo `/assets/*` (con hash) es `immutable`.
- **Gestor único:** Bun; `bun.lock` es el único lockfile versionado.
  Producción compila con Bun 1.4.4 (Cloudflare Workers Builds).
  Desarrollo y verificación usan `bun install --frozen-lockfile`.
  Cloudflare Workers Builds instala con ese comando y construye con `bun run build`.
  Su comando de publicación existente, `npx wrangler deploy`, se conserva; no se
  ejecuta sin autorización. Lovable usa `bun.lock`.
  El campo `packageManager` no está declarado; fijarlo se evaluará por separado.

## 8. Comandos

```bash
bun install --frozen-lockfile # instalar las versiones fijadas
bun run dev                   # servidor de desarrollo (http://localhost:8080)
bun run build                 # build de producción
bunx tsc --noEmit             # comprobación de tipos
bun run lint                  # ESLint
bunx prettier --check src     # comprobar formato; no aplicar cambios masivos
```

## 9. Dónde cambiar cada cosa

| Quiero… | Edito… |
| --- | --- |
| Cambiar teléfono, correo, WhatsApp o endpoint del formulario | `src/lib/site.ts` |
| Añadir o editar un servicio | `src/lib/services-data.ts`, eligiendo su `category` (+ una ruta en `src/routes/servicios/` si tiene página) |
| Añadir una página por rubro | `src/lib/verticals-data.ts` + una ruta en `src/routes/para/` |
| Reordenar la landing | `src/routes/index.tsx` |
| Cambiar las preguntas o las reglas del Diagnóstico | `src/lib/diagnosis-engine.ts` (y su spec en `specs/001-diagnostico-captacion/`) |
| Retirar la invitación automática al Diagnóstico | Quitar `<DiagnosisInvite />` de `src/routes/index.tsx` (el Diagnóstico sigue disponible) |
| Cambiar colores, tipografía o curvas | `src/styles.css` (`@theme`) |
| Cambiar meta/SEO global o schema.org | `src/routes/__root.tsx` |
| Permitir un dominio externo en la CSP | Hoy no aplica al HTML (ver §7); pendiente de mover las cabeceras de seguridad al Worker |
| Cambiar la caché de un estático | `public/_headers` |
| Registrar una página nueva en el buscador | `public/sitemap.xml` |
