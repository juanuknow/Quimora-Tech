# Hero con selector de negocio — prototipo v2

Implementado el 11 de noviembre de 2026 a partir de `C:/Users/toqui/Downloads/hero-selector-negocio.html`.

- Cuatro negocios ficticios: Cazuela & Brasa, Almendra, Odontología Arce y Ceiba Inmobiliaria.
- Datos, logos y textos en `src/lib/hero-demo-data.ts`; cuatro componentes de miniatura en `src/components/hero-demo/`.
- Solo SVG inline decorativos con `aria-hidden`. El gradiente del restaurante usa `useId()`; no se incorporaron imágenes rasterizadas, recursos externos ni cambios a la CSP.
- Texto visible «Ejemplo ficticio» encima de la ventana.
- Solo el panel activo queda accesible: los otros tres tienen `aria-hidden="true"`, `inert` y `tabIndex=-1`.
- Tabs con flechas, Home/End y foco itinerante; CTA a la página del rubro seleccionado.
- Rotación cada 3,5 s, con control de pausa. Se detiene al entrar con puntero, enfocar o seleccionar; no avanza con la página oculta y respeta movimiento reducido.
- Se conserva el copy y los CTA comerciales del hero existente. Las miniaturas heredan el v2. La composición se apila bajo 1024 px para evitar compresión en tablet.

## Antes / después

Build de producción con `npm run build`, mismo entorno y dependencias, sin modificar el lockfile. Medición por archivo con `node:zlib.gzipSync` (nivel predeterminado), sumando los chunks cliente `index-*`, `routes-*` y el compartido `FloatingWhatsApp-*`. Incluye las cuatro demos, cargadas juntas; no se difirieron para ocultar su coste. Son bytes comprimidos de JS, excluyendo CSS, HTML, fuentes y cabeceras HTTP. Los hashes y tamaños exactos están en [bundle.json](bundle.json).

| JS comparado                          |     Antes |   Después | Diferencia |
| ------------------------------------- | --------: | --------: | ---------: |
| index                                 | 111.386 B | 111.402 B |      +16 B |
| routes (contiene hero y cuatro demos) |  33.270 B |  36.957 B |   +3.687 B |
| FloatingWhatsApp compartido           |   5.719 B |   5.719 B |        0 B |
| Total gzip                            | 150.375 B | 154.078 B |   +3.703 B |

Incremento: **3,703 kB gzip**, inferior al presupuesto de ~12 kB. kB decimal = 1000 bytes. El coste CSS se mantiene fuera del presupuesto JS solicitado.

## Verificación

- `npm run build`: pasa.
- `npx tsc --noEmit`: pasa.
- ESLint de los archivos TS/TSX cambiados: pasa.
- `git diff --check`: pasa.
- Detector de diseño: sin hallazgos mecánicos.
- Chromium/Playwright contra servidor de desarrollo: los cuatro estados a 320, 375, 768, 1024 y 1440 px caben dentro del viewport y contienen su acción completa. Cada cambio mantiene un panel accesible, tres paneles inertes, todos los SVG ocultos a lectores y el destino correcto del CTA. Sin errores de página.
- Flechas con retorno circular, Home/End y foco: pasan.
- Movimiento reducido sin rotación; rotación normal; parada al recibir foco: pasan.
- Capturas: [escritorio](desktop.png), [móvil](mobile.png). La captura móvil está desplazada para mostrar completa la demo.

| Revisión visual independiente                               | Estado                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| Contraste del texto del restaurante sobre el plato en móvil | Resuelto con fondo sólido; confirmado en ambas capturas |

Límite de la prueba: la inspección interactiva se hizo con Vite dev. `vite preview` falla por una ruta `dist/server/server.js` ausente, y el runtime local de Wrangler rechaza la fecha de compatibilidad generada (su binario admite hasta 2026-07-21). Estos impedimentos no se alteraron en esta tarea. El build de producción sí terminó correctamente. No se publicó el sitio.

## Cierre 30.1

Rama de trabajo: `feat/hero-selector-negocio`, creada desde `origin/main` actualizado (`f8469b4`). No incluye el commit de auditoría que estaba en la rama anterior. Se conservan los textos comerciales de esa base. Las capturas anteriores se entregan como evidencia del v2; sus textos comerciales corresponden a la base anterior.

Bun 1.4.4 es el único gestor utilizado en este cierre. `package-lock.json` no existe y está ignorado por `/package-lock.json`; `bun.lock` no se modifica. La medición del apartado anterior es histórica, anterior al cierre y a los eventos añadidos.

- Punto 7: `trackEvent("hero_business_select", { vertical: slug })` se dispara en selección manual por clic o teclado. `trackEvent("hero_business_cta", { vertical: slug })` se dispara al pulsar el CTA. Se reutiliza `trackEvent` de `src/lib/site.ts`, igual que Contact y FloatingWhatsApp; sin nuevas conexiones ni configuración de GA4. La rotación automática no emite selecciones.
- Punto 8: HeroVisual se elimina. En la base actualizada no hay consumidores de `animate-draw-stroke` ni `animate-float-3d`; se eliminan ambas clases, keyframes y reglas específicas de reduced-motion. Búsqueda de prueba: `rg -n 'HeroVisual|animate-draw-stroke|animate-float-3d|draw-stroke|float-3d' src` sin coincidencias.
- Reutilización: no se usa WindowBar/BrowserChrome. Su barra depende de una altura porcentual en un contenedor flex con altura definida e incorpora otro espaciado y un indicador animado; adaptarla cambiaría el diseño ya aceptado o la API compartida. La barra fija de 34 px preserva el prototipo. No se usa useInView: observa una sola entrada, no la visibilidad continua, y no se añade una nueva animación de entrada. Se mantiene la pausa de rotación cuando `document.hidden`.
- Pausa: botón nativo con nombre accesible «Pausar ejemplos» o «Rotar ejemplos» obtenido de su texto visible, foco visible y `min-height: 44px`; se oculta con movimiento reducido, cuando no hay rotación.

Riesgo alto por instrumentación de analítica. Solo envía el slug de una categoría ficticia; no datos personales. Reversión: `git revert` del commit de esta rama si aparecen errores del selector, navegación o eventos duplicados. Antes de integrar, exigir V10 sobre el commit publicado; después de una integración autorizada, verificar V9 y el comportamiento del selector y de los eventos. No se modifica configuración de Cloudflare ni se despliega a producción en este paso; la versión activa de producción no se cambia.

Las salidas reales de V1–V4 y el diff completo se entregan como archivos externos al repositorio para evitar versionar un diff de sí mismo. No se declara conformidad WCAG completa.
