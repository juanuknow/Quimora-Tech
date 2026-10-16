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
│   ├── _headers              Cabeceras de seguridad y CSP (Cloudflare)
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
├── bun.lock · package-lock.json   Lockfiles (ver sección 7)
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

`Hero` → `Problem` → `Benefits` → `SoftwareSolutions` → `Showcase3D` → `Stats` →
`Timeline` → `Specialists` → `DiagnosisShortcuts` → `DigitalDiagnosis` → `Pricing` →
`FAQ` → `Contact` → `FinalCTA`

Los fondos de secciones contiguas alternan (blanco, gris, oscuro) para que no se
fundan entre sí; al mover una sección, revisar sus vecinas.

### Por función

| Grupo | Componentes |
| --- | --- |
| Estructura del sitio | `TopBar`, `Nav`, `Footer`, `FloatingWhatsApp`, `WhatsAppIcon`, `ReadingProgress` |
| Secciones de la landing | `Hero`, `Problem`, `Benefits`, `SoftwareSolutions`, `Showcase3D`, `Stats`, `Timeline`, `Specialists`, `Pricing`, `FAQ`, `Contact`, `FinalCTA` |
| Diagnóstico (lead magnet) | `DigitalDiagnosis` (wizard de 5 pasos), `DiagnosisShortcuts` (chips que lo abren con el negocio ya elegido) |
| Portafolio | `Showcase3D` (caso destacado), `ShowcaseGallery` (capturas con pestañas), `BrowserChrome` (marco de navegador), `LivePerformance` (métricas web reales) |
| Plantillas de página | `ServiceDetail` (`/servicios/*`), `VerticalDetail` (`/para/*`), `LegalPage` (`/privacidad`, `/terminos`) |
| Movimiento reutilizable | `Reveal` (entrada escalonada al verse), `FlowConnector` (línea que se dibuja entre secciones) |

## 5. Datos y utilidades (`src/lib/`)

| Archivo | Responsabilidad |
| --- | --- |
| `site.ts` | **Fuente única** de contacto (WhatsApp, correo, teléfonos), `SITE_URL`, endpoint de Formspree, ID de Google Analytics, `trackEvent` y los anillos de foco `FOCUS_RING` / `LIGHT_RING`. No hardcodear estos valores en componentes. |
| `services-data.ts` | Catálogo de servicios y soluciones (alimenta `SoftwareSolutions`, `ServiceDetail`, `Nav`, `Footer`) |
| `verticals-data.ts` | Contenido de las páginas por rubro `/para/*` (alimenta `VerticalDetail`) |
| `diagnosis.ts` | Tipos y opciones compartidos del Diagnóstico, y `requestDiagnosis()` para abrirlo desde otra sección |
| `hooks.ts` | `useInView` (disparar al entrar en pantalla) y `useTilt` (inclinación 3D con el cursor) |
| `use-web-vitals.ts` | Lectura de Core Web Vitals (la usa `LivePerformance`) |
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
- **Cabeceras de seguridad y CSP:** `public/_headers`. Al añadir un servicio externo
  (analítica, fuentes, formularios) hay que permitirlo ahí o el navegador lo bloqueará.
- **Dos lockfiles:** `bun.lock` (lo usa Lovable) y `package-lock.json` (npm). No borrar
  ninguno sin comprobar con qué gestor construye Cloudflare.

## 8. Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (http://localhost:8080)
npm run build      # build de producción
npx tsc --noEmit   # comprobación de tipos
npm run lint       # ESLint
npm run format     # Prettier
```

## 9. Dónde cambiar cada cosa

| Quiero… | Edito… |
| --- | --- |
| Cambiar teléfono, correo, WhatsApp o endpoint del formulario | `src/lib/site.ts` |
| Añadir o editar un servicio | `src/lib/services-data.ts` (+ una ruta en `src/routes/servicios/` si tiene página) |
| Añadir una página por rubro | `src/lib/verticals-data.ts` + una ruta en `src/routes/para/` |
| Reordenar la landing | `src/routes/index.tsx` |
| Cambiar colores, tipografía o curvas | `src/styles.css` (`@theme`) |
| Cambiar meta/SEO global o schema.org | `src/routes/__root.tsx` |
| Permitir un dominio externo | `public/_headers` |
| Registrar una página nueva en el buscador | `public/sitemap.xml` |
