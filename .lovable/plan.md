# Rediseño Landing Page — Quimora Tech

Reescribiré `src/routes/index.tsx`, `src/styles.css` y `src/routes/__root.tsx` para alinear la landing existente con el nuevo brief minimalista (azul + naranja, Space Grotesk + Inter, timeline de 4 semanas como pieza signature).

## Cambios de sistema de diseño

**`src/styles.css`** — actualizar tokens:
- `--brand: #4366F5` (azul), `--brand-dark` variante hover
- `--accent: #FF6B35` (naranja, uso restringido)
- `--foreground: #404040`, `--background: #FFFFFF`, `--muted: #F5F5F5`
- `--success: #10B981` (opcional para checkmarks)
- `--font-display: "Space Grotesk"`, `--font-sans: "Inter"`
- Eliminar sombras pesadas; solo borders `#F5F5F5`

**`src/routes/__root.tsx`** — cargar Space Grotesk + Inter vía `<link>` a Google Fonts (preconnect + stylesheet en `head.links`). Actualizar `<title>` y meta description a Quimora Tech.

## Estructura de secciones (8 bloques, orden exacto)

1. **Header/Nav** — logo "Q" azul + "Quimora Tech", nav: Inicio · Servicios · Nosotros · Contacto. NO sticky. Hamburguesa en mobile.
2. **Hero** — H1 56px Space Grotesk azul: "Páginas Web que Convierten tus Visitantes en Clientes Reales". Subheader gris. CTA naranja "Quiero Mi Web que Convierte" + secundario outline azul "Ver Cómo Funciona". Lado derecho: SVG minimal de línea ascendente/laptop.
3. **Beneficios (3 cards)** — Mobile-First (smartphone azul, "62% de usuarios"), Velocidad (rayo naranja, "-3s en carga"), Analytics (gráfica azul, "100% Medible"). Borders `#F5F5F5`, sin sombras, padding 30px.
4. **Timeline "Crecer es Simple" (JOYA VISUAL)** — copyline naranja arriba: "Tu web lista en 4 semanas. No 4 meses." Timeline horizontal 4 fases con etiquetas SEMANA 1-2 / 3-6 / 7 / 8+, iconos (chat, código, rocket naranja, gráfica), línea conectora azul rellena 100%. Versión vertical stack en mobile.
5. **Testimonios** — carousel con 3 testimonios realistas (roles genéricos como "Dueño de E-commerce de Moda, Cali"), avatares con inicial, 5 estrellas, fade suave, dots azules.
6. **FAQ** — accordion con las 4 preguntas exactas del brief, transición 0.3s, +/- icons.
7. **CTA Final** — fondo `#F5F5F5`, "No Dejes que tu Competencia te Pase Adelante" + subheader, CTA naranja + secundario azul outline, teléfono +57 312 456 7890, badge "Sin compromiso · Respuesta en menos de 24 horas".
8. **Footer** — logo, links (Inicio · Servicios · Testimonios · FAQ · Contacto · Política), redes sociales azul, copyright 2024.

## Reglas de estilo aplicadas

- Máx 3 colores por sección; naranja limitado a ~4 usos (CTAs hero, rocket timeline, CTA final, copyline timeline)
- 60-80px padding entre secciones
- Sin sombras (solo `border` gris claro)
- Botones: hover = cambio opacidad/color, sin escala
- Escala tipográfica agresiva: H1 56px / body 16px
- Responsive breakpoints: 320 / 768 / 1440 con grid limpio

## Notas técnicas

- Framework: TanStack Start (ya configurado), edición 100% frontend
- Iconos: `lucide-react` (ya instalado): Smartphone, Zap, BarChart3, MessageCircle, Code2, Rocket, TrendingUp, ChevronLeft/Right, Plus/Minus, Star, Phone, Linkedin, Instagram, Facebook
- Timeline: CSS grid horizontal desktop / flex-col mobile, línea con `::before` + barra rellena
- Carousel testimonios y FAQ accordion: `useState` local (sin librerías nuevas)
- Fuentes vía `<link>` en `__root.tsx` (no `@import` en CSS, per Tailwind v4)
- Head: title "Quimora Tech · Páginas Web que Convierten en Clientes Reales" + meta description del hero
