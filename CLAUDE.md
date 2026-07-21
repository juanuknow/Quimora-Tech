# CLAUDE.md — Quimora Tech Landing Page

**Versión:** 1.3  
**Estado:** Landing completa en producción (Hero, Diagnóstico, Problema, Beneficios, Showcase, Stats, Timeline, Precios, FAQ, Contacto, CTA) + páginas legales  
**Responsable:** Juan Pablo Toquica López (founder & Lead Developer)  
**Última actualización:** 17 de julio de 2026  

---

## 📋 Contexto del Proyecto

**Empresa:** Quimora Tech  
**Tipo:** Agencia de Diseño y Desarrollo Web (Cali, Colombia)  
**Misión:** Convertir visitantes en clientes reales a través de sitios web rápidos, seguros y optimizados  
**Eslogan:** Páginas web que convierten visitantes en clientes reales  

**Público objetivo:**
- Tiendas físicas y virtuales
- Restaurantes, cafeterías, bares
- Empresas de mediano tamaño
- Emprendedores individuales
- Profesionales independientes
- Clínicas, consultorios, academias
- Hoteles, inmobiliarias, talleres
- Negocios locales de Cali y Valle del Cauca

---

## 🎨 Identidad Visual

### Paleta de Colores (monocromática "zinc")

> ⚠️ El plan original era azul `#3350e0`, pero el sitio implementado es **monocromático** (negro/gris/blanco), estilo Stripe/Linear. Esta es la paleta **real** en producción. Los valores viven como CSS custom properties en `src/styles.css` (`:root`).

```
--brand:             #18181b  (zinc-900 — títulos / tinta primaria)
--brand-dark:        #09090b  (zinc-950 — footer / fondos oscuros)
--brand-soft:        #f4f4f5  (zinc-100 — fondos suaves / iconos)
--foreground:        #27272a  (zinc-800 — texto de cuerpo)
--muted-foreground:  #71717a  (zinc-500 — texto secundario)
--accent-strong:     #3f3f46  (zinc-700 — acento secundario, carbón)
--cta:               #18181b  (CTA principal; hover → #000000)
--hairline:          #e4e4e7  (zinc-200 — bordes finos)
--background:        #ffffff  (blanco puro)
```

**Nombres de tokens:** usar `bg-cta` / `hover:bg-cta-hover`, `text-accent-strong`, `bg-accent-strong-soft`, `text-brand`, `border-hairline`, etc. (Antes se llamaban `cta-orange` / `accent-orange` — nombres que mentían sobre su valor; renombrados.)

**Principio:** Sin dark mode activo, sin neon. Light-mode. Gradientes solo sutiles (glows radiales de baja opacidad en fondos), nunca de color.

### Tipografía

**Font de cuerpo:** Inter (variable, self-hosted en `public/fonts/inter-variable.woff2`)
- Weights: 400 (regular), 600 (semibold)

**Font de display (títulos + `.font-display`):** Space Grotesk (variable, self-hosted en `public/fonts/space-grotesk-variable.woff2`)
- Se aplica a `h1, h2, h3` y a la clase utilitaria `font-display`
- (El plan mencionaba Montserrat; **no se usa** — la font de display real es Space Grotesk.)

**Jerarquía:**
- H1 (Hero): 48-56px, weight 600
- H2 (Secciones): 32-40px, weight 600
- H3 (Subtítulos): 24-28px, weight 600
- Body: 16-18px, weight 400
- Small: 13-14px, weight 400
- Note: 11-12px, weight 400

### Espaciado

- Mínimo entre secciones: 60px
- Padding interno (cards): 32px
- Gap entre elementos: 24px
- Border radius: 6px (botones), 12px (cards)

---

## 🎯 Rol del Asistente (Instrucciones de Desarrollo)

Actúas como **Staff Engineer + Arquitecto de Software + UX Engineer + Code Reviewer**.

### Antes de cada cambio:

1. **Analiza el contexto** — comprende la arquitectura existente
2. **Evita duplicación** — reutiliza componentes, no repitas código
3. **Mantén coherencia** — respeta identidad visual y UX establecidas
4. **Escala sin refactor** — cada componente debe permitir extensión futura
5. **Prioriza correctitud → seguridad → rendimiento → escalabilidad → mantenibilidad**

### Estándares de código obligatorios:

- **Clean Code** + **SOLID** + **DRY** + **KISS** + **YAGNI**
- Componentes reutilizables, naming descriptivo
- Tipado estricto (TypeScript)
- Manejo de errores explícito
- Sin "soluciones temporales" — todo listo para producción

### Respuestas:

- Concisas y técnicas
- No repitas conceptos básicos sin razón
- Si hay múltiples soluciones, recomienda la más apropiada para producción
- Indica si detectas mejoras, aunque no las haya solicitado

---

## 🚀 Stack Tecnológico (MVP Phase 1)

### Frontend

- **TanStack Start** (`@tanstack/react-start` + `@tanstack/react-router`, file-based routing en `src/routes/`)
- **Vite 8** (build tool, config vía `@lovable.dev/vite-tanstack-config`)
- **TypeScript** (tipado estricto)
- **Tailwind CSS v4** (utility-first styling, plugin de Vite)
- **React 19** (componentes, hooks)
- **lucide-react** (iconos)

### Deployment

- **Cloudflare** (Nitro build target, vía Wrangler)
- **Dominio:** quimora.tech (ya registrado)
- Proyecto generado y gestionado con **Lovable** (`.lovable/`)

### Herramientas
- **Git/GitHub** — versionado, PRs, review
- **VS Code** — editor
- **Figma** — diseño (referencia visual)

### SIN esto en MVP:
- ❌ Base de datos
- ❌ CMS
- ❌ Backend propio
- ❌ Autenticación
- ❌ Blog
- ❌ Panel administrativo
- ❌ Pagos
- ❌ Sistema de cotizaciones

---

## 📄 Estructura de Landing (MVP Phase 1 — Mínimo Viable)

Solo 3 secciones + navbar + footer:

### 1. Hero (600-700px)
**Objetivo:** Impacto visual en <3 segundos

**Elementos:**
- Navbar fija (logo + enlaces básicos + CTA)
- Título: "Páginas Web que Convierten tus Visitantes en Clientes Reales"
- Subtítulo explicativo (2-3 líneas, elimina jerga técnica)
- CTA primario: "Quiero Mi Web que Convierte" (azul #3350e0)
- Elemento visual minimalista (ilustración o patrón geométrico, bajo en opacidad)

**Responsividad:**
- Desktop: layout horizontal con elemento visual a la derecha
- Móvil: stack vertical, elemento visual hidden

---

### 2. Servicios (400-450px)
**Objetivo:** Mostrar qué vendes sin complejidad

**Elementos:**
- Encabezado: "¿Qué Ofrecemos?"
- 3-4 cards (máximo) con:
  - Icono simple (minimalista)
  - Nombre del servicio
  - Descripción breve (1-2 líneas)
  - Badge con beneficio clave

**Cards:**
- Fondo blanco, borde #e0e0e0
- Hover: sombra sutil + elevación 4px
- Padding: 32px

**Servicios iniciales (aquí puedes adicionar, pero estas 3 son el MVP):**
1. Diseño Web → "Mobile-first, conversión optimizada"
2. Desarrollo Web → "Ultra-rápido, seguro, escalable"
3. Optimización SEO → "Posicionamiento en Google"

---

### 3. Formulario de Contacto / CTA Final (360-400px)
**Objetivo:** Capturar leads

**Elementos:**
- Encabezado: "¿Listo para Crecer?"
- Subtítulo: "Agenda una consulta gratuita, sin compromiso"
- Formulario inline (máximo 3 campos):
  - Nombre completo
  - Correo electrónico
  - Teléfono (opcional)
- Botón: "Contactarme"
- Checkbox: "Acuerdo términos"

**Botón CTA (real):**
- Fondo `bg-cta` (#18181b, negro), texto blanco
- Hover: `bg-cta-hover` (#000000)
- (El plan mencionaba azul #3350e0; el CTA real es negro sobre blanco, máximo contraste.)

**Manejo de datos (implementado):**
- **Formspree** (`https://formspree.io/f/mzdnenqv`), sin backend propio. Endpoint en `src/lib/site.ts` como `FORMSPREE_ENDPOINT`.
- Envío vía `fetch` POST (JSON) con estados de carga / éxito / error en el componente `Contact`.
- Validación en cliente (campos requeridos + regex de email).
- Los correos llegan a `devopsconsultoring@gmail.com` (correo operativo actual; migrar a `hola@quimora.tech` cuando esté el buzón).

**Alternativa siempre visible:** botón flotante y enlaces directos de WhatsApp (`wa.me/573244577198`) — helper `whatsappHref()` en `src/lib/site.ts`.

---

### 4. Footer (180px)
**Elementos:**
- Logo pequeño + copyright
- 2-3 enlaces (Inicio, Servicios, Contacto, Política Privacidad)
- Ícono de email / teléfono
- Ubicación: Cali, Colombia

---

## 🎮 Funcionalidades MVP

| Feature | Prioridad | Estado | Descripción |
|---------|-----------|--------|-------------|
| Navbar responsive | Alta | TODO | Menú hamburger en móvil |
| Scroll suave | Media | TODO | `scroll-behavior: smooth` |
| Lazy loading imágenes | Alta | TODO | `next/image` con `loading="lazy"` |
| Formulario validado | Alta | TODO | Cliente: regex email + required fields |
| Responsive design | Alta | TODO | Mobile-first, breakpoints: 480px, 768px, 1024px |
| Focus visible | Alta | TODO | Accesibilidad WCAG 2.2 |
| Meta tags SEO | Alta | TODO | Title, description, OG tags |
| Google Analytics | Media | TODO | Tracking de conversiones |
| Mobile viewport | Alta | TODO | `<meta name="viewport">` correcto |

**NO hacer en MVP:**
- Dark mode toggle
- Scroll reveal (Framer Motion)
- Carrusel de testimonios
- FAQ con acordeón
- Timeline animado
- Integración con CRM

---

## ⚡ Arquitectura & Componentes

### Estructura de directorios (real)

```
conversion-craft-96/
├── .gitignore
├── vite.config.ts             # Config vía @lovable.dev/vite-tanstack-config
├── tsconfig.json
├── package.json
├── public/                    # Assets estáticos
│   ├── fonts/                 # Inter + Space Grotesk (variable woff2, self-hosted)
│   ├── images/                # Imágenes del showcase (webp)
│   ├── og-image.png           # Open Graph 1200×630
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── routes/
│   │   ├── __root.tsx         # Root layout + <head> (meta, OG, schema.org)
│   │   ├── index.tsx          # Landing (secciones inline — todavía monolítica)
│   │   ├── privacidad.tsx     # Política de Privacidad (Ley 1581)
│   │   └── terminos.tsx       # Términos y Condiciones
│   ├── components/
│   │   ├── DigitalDiagnosis.tsx  # Wizard de diagnóstico (lead magnet)
│   │   ├── Showcase3D.tsx        # Portafolio 3D (dispositivos + lightbox)
│   │   └── LegalPage.tsx         # Layout compartido de páginas legales
│   ├── lib/
│   │   ├── site.ts            # Fuente única: contacto, WhatsApp, Formspree, FOCUS_RING
│   │   ├── hooks.ts           # useInView (hook compartido)
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   └── lovable-error-reporting.ts
│   ├── router.tsx
│   ├── server.ts               # Entry SSR (Nitro/Cloudflare)
│   ├── start.ts
│   └── styles.css
├── .lovable/                   # Metadata del proyecto Lovable
└── CLAUDE.md                   # Este archivo
```

**⚠️ Deuda técnica actual:** la landing (`src/routes/index.tsx`) sigue siendo un archivo grande con la mayoría de secciones inline (Hero, Problem, Benefits, Stats, Timeline, Pricing, FAQ, Contact, Footer, etc.). Ya se extrajeron los bloques más pesados a `src/components/` (`DigitalDiagnosis`, `Showcase3D`, `LegalPage`) y los helpers compartidos a `src/lib/` (`site.ts`, `hooks.ts`). Recomendado: seguir extrayendo secciones a `src/components/` a medida que se toquen, sin un refactor masivo. Los tokens de color, contacto y el endpoint de Formspree tienen **fuente única** en `src/lib/site.ts` — no hardcodear números/correos en los componentes.

---

## 📊 Métricas & Objetivos

### Lighthouse (Target: >95 en todas las métricas)

| Métrica | Target | Descripción |
|---------|--------|-------------|
| Performance | >95 | Velocidad, tiempo de carga |
| Accessibility | >95 | WCAG 2.2, navegación por teclado |
| Best Practices | >95 | Seguridad, HTTPS, errores console |
| SEO | >95 | Meta tags, mobile-friendly, robots.txt |

### Conversión (KPIs para MVP)

- Tasa de click en CTA Hero: >3%
- Tasa de envío de formulario: >1%
- Bounce rate: <60%
- Tiempo promedio en página: >2 min

---

## 🔒 Seguridad & Compliance

### Obligatorios en MVP:

- ✅ HTTPS (Vercel lo proporciona)
- ✅ Validación de emails en formulario
- ✅ Meta `viewport` para evitar zoom non-user-scalable
- ✅ CSP headers (Content-Security-Policy)
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ No exponer variables de entorno en cliente
- ✅ Sanitizar inputs (Formspree lo maneja)
- ✅ Términos de privacidad (enlace en footer)

### NO hacer en MVP:

- Autenticación
- Encriptación de datos
- Backup automatizado
- Rate limiting (Formspree lo maneja)

---

## 📱 Responsividad (Mobile-First)

### Breakpoints

```javascript
// tailwind.config.js
{
  screens: {
    'sm': '480px',   // Móvil pequeño
    'md': '768px',   // Tablet
    'lg': '1024px',  // Desktop pequeño
    'xl': '1280px',  // Desktop
  }
}
```

### Comportamiento por breakpoint:

| Elemento | <480px | 480-768px | >768px |
|----------|--------|-----------|--------|
| Navbar | Hamburger | Hamburger | Full links |
| Hero | Stack vertical | Stack vertical | Horizontal |
| Servicios | 1 columna | 1 columna | 3 columnas |
| Contacto | 100% ancho | 80% ancho | 50% ancho |
| Fuente H1 | 28px | 36px | 48px |

---

## ✅ Checklist Antes de Publicar

### Código

- [ ] TypeScript sin errores (`tsc --noEmit`)
- [ ] ESLint pasando (`npm run lint`)
- [ ] Prettier formateado (`npm run format`)
- [ ] Sin console.logs en producción
- [ ] Sin warnings en build

### Rendimiento

- [ ] Lighthouse Performance >95
- [ ] Lighthouse Accessibility >95
- [ ] Lighthouse Best Practices >95
- [ ] Lighthouse SEO >95
- [ ] Imágenes optimizadas (WebP, comprimidas)
- [ ] CSS crítico inlined
- [ ] Fonts de Google cacheadas
- [ ] No más de 3 requests externos

### UX/UI

- [ ] Responsivo en 375px, 768px, 1440px
- [ ] Hover states funcionales
- [ ] Focus visible en botones/inputs
- [ ] Sin content shifts (CLS < 0.1)
- [ ] Colores siguen paleta establecida
- [ ] Tipografía: Inter + Montserrat (firmas)
- [ ] Espaciado consistente (60px entre secciones)
- [ ] Sin typos en textos

### SEO

- [ ] `<title>` descriptivo (50-60 caracteres)
- [ ] `<meta description>` (150-160 caracteres)
- [ ] H1 único en la página
- [ ] Open Graph tags completos
- [ ] robots.txt presente
- [ ] Sitemap.xml
- [ ] Canonical tag

### Seguridad

- [ ] Variables sensibles en `.env.local`
- [ ] No hardcodear secrets
- [ ] HTTPS forzado
- [ ] CSP headers configurados
- [ ] Formulario validado en cliente + servidor
- [ ] Términos privacidad enlazados

### Analytics

- [ ] Google Analytics instalado
- [ ] Eventos de conversión definidos
- [ ] Meta pixel (si aplica)
- [ ] Tracking de formulario

---

## 🎬 Próximos Pasos (Fases 2-3)

### Fase 2 — Validación (después de 3-5 clientes reales)

- Agregar testimonios reales con fotos y empresa
- Sección "Proceso" con timeline y descripciones
- FAQ con acordeón (basado en preguntas reales)
- Integración con WhatsApp Direct
- Social proof: logos de clientes

### Fase 3 — Escalar

- Blog (Next.js + MDX)
- Panel administrativo (gestión de proyectos)
- Sistema de cotizaciones
- CRM integrado
- Pagos en línea (Stripe)
- Base de datos (PostgreSQL)

---

## 🚨 Principios No Negociables

1. **Cada línea de código debe estar lista para producción** — no hay "después lo refactorizo"
2. **Reutilizar, no duplicar** — si ves el mismo componente 2x, abstracto
3. **No agregar features sin validar con clientes reales** — YAGNI
4. **Performance por defecto** — Lighthouse >95 no es negociable
5. **Accesibilidad desde día 1** — WCAG 2.2 AA mínimo
6. **Documentar cambios relevantes** — PRs deben explicar el por qué
7. **No romper funcionalidades existentes** — testing es obligatorio

---

## 📞 Contacto & Referencias

**Responsable:** Juan Pablo Toquica López  
**Email:** toquicalopez10@gmail.com  
**Teléfono:** +57 324 457 7198  
**Sitio (futuro):** quimora.tech  
**Ubicación:** Cali, Colombia  

**Recursos:**
- Design tokens: Ver sección "Identidad Visual"
- Componentes Figma: (Figma link cuando esté listo)
- Datos del proyecto exportados: Quimora_Tech_Datos_Proyecto.xlsx

---

## 🔄 Versionado de este Documento

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Enero 2025 | Inicial — MVP Phase 1 estructura (asumía Next.js/Vercel) |
| 1.1 | 13 de julio de 2026 | Corrección de stack real (TanStack Start + Vite + Cloudflare) y estructura de directorios |
| 1.3 | 17 de julio de 2026 | Sincronización con producción: paleta monocromática real, Space Grotesk, tokens renombrados, `src/components` + `src/lib/site.ts`, formulario Formspree, páginas legales, og:image |
| 1.4 | — | Agregar Fase 2 detalles |
| 2.0 | — | Después Fase 2 validación |

---

**Última revisión:** 17 de julio de 2026  
**Próxima revisión:** Después de 5 clientes reales
