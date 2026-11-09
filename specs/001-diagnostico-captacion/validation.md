# Validation: Diagnóstico Digital Gratuito

Registro de evidencias de la implementación de [tasks.md](./tasks.md). Una tarea está **terminada** cuando su sección de aquí tiene la evidencia indicada, con fecha y resultado. Las secciones marcadas **Responsable** las completa o aprueba el responsable de Quimora Tech.

Las capturas no se versionan: se guardan en el scratchpad de la sesión (`…\scratchpad\captures-001\`) y aquí se lista su nombre.

## 1. Verificaciones por commit (V5 y V8, constitución)

Una fila por propuesta de commit. Sin las dos verificaciones en "Pasa", no se pide autorización.

| Commit | Fecha      | V5: recorridos críticos en `npm run dev`                                                                                                                                                             | V8: `git diff --cached` sin secretos                                  | Autorización                                                             |
| ------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1      | 2026-11-07 | Pasa: 9/9 (`v5-dev.cjs` contra `vite dev`, puerto 5181). Exclusión documentada: aviso de hidratación por `data-tsd-source`, que inyecta `@tanstack/devtools-vite` solo en desarrollo (0 en el build) | Pasa: 138 líneas añadidas revisadas, sin coincidencias (`v8-scan.sh`) | Pendiente: no hay autorización de commit                                 |
| 2      | 2026-11-07 | Pasa: 9/9 (`v5-dev.cjs`, US1 completa en `vite dev`)                                                                                                                                                 | Pasa: 1 325 líneas añadidas, sin coincidencias                        | Pendiente: sin autorización de commit y con §2 (textos) sin aprobar      |
| 3      | 2026-11-07 | Pasa: 9/9 (`v5-dev.cjs`, US1 completa en `vite dev`)                                                                                                                                                 | Pasa: 1 325 líneas añadidas, sin coincidencias                        | Pendiente: sin autorización de commit y con §2 (textos) sin aprobar      |
| 4      | 2026-11-07 | Pasa: 9/9 (`v5-dev.cjs`, MVP completo: US1 + US2)                                                                                                                                                    | Pasa: 1 463 líneas añadidas, sin coincidencias                        | Pendiente: sin autorización de commit; publicación bloqueada por §2 y §3 |
| 5      | 2026-11-07 | Pasa: 9/9 (`v5-dev.cjs` con la invitación activa)                                                                                                                                                    | Pasa: 1 804 líneas añadidas, sin coincidencias                        | Pendiente: sin autorización de commit                                    |
| 6      | 2026-11-07 | Pasa: 9/9 (`v5-dev.cjs`)                                                                                                                                                                             | Pasa: 1 830 líneas añadidas, sin coincidencias                        | Pendiente: sin autorización de commit                                    |
| 7      | 2026-11-07 | Pasa: 9/9 (`v5-dev.cjs`, verificación final con la invitación activa)                                                                                                                                | Pasa: 1 857 líneas añadidas, sin coincidencias                        | Pendiente: sin autorización de commit                                    |

V5 incluye: formulario de contacto con éxito y error, enlaces de WhatsApp, anclas en escritorio y móvil, páginas legales, 404 y consola sin errores, más lo que toque el commit.

## 2. Aprobación de textos comerciales (G1) — Responsable

Todos los textos redactados para el motor (`src/lib/diagnosis-engine.ts`) que no se copian literalmente del catálogo o de un plan. **Ninguno está aprobado todavía** (estado al 2026-11-07). Deben aprobarse antes de proponer el commit 2 y antes de cualquier publicación (FR-016b, Principio XI). Para cambiar un texto, basta indicarlo aquí; el motor y su verificación se ajustan después.

### 2.1 Resumen de la situación (bloque 2 del resultado)

Plantilla: `<frase de situación> Tu objetivo: <objetivo en minúscula>.` La frase usa el nombre del negocio según R-C5.

| Situación | Frase propuesta (ejemplo con "tu restaurante")                                   | Aprobado  |
| --------- | -------------------------------------------------------------------------------- | --------- |
| S1        | "Tu restaurante todavía no tiene página web propia."                             | Pendiente |
| S2        | "Tu restaurante se apoya solo en redes sociales o WhatsApp, sin una web propia." | Pendiente |
| S3        | "Tu restaurante ya tiene una página web, pero hoy no le está trayendo clientes." | Pendiente |
| S4        | "Tu restaurante ya tiene una página web y quieres renovarla."                    | Pendiente |
| S5        | "Tu restaurante ya vende por internet."                                          | Pendiente |

Nombre del negocio (R-C5): tienda física → "tu tienda"; tienda online → "tu tienda online"; restaurante → "tu restaurante"; cafetería → "tu cafetería"; clínica → "tu clínica"; abogado → "tu despacho"; inmobiliaria → "tu inmobiliaria"; empresa → "tu empresa"; otro → "tu negocio". **Pendiente**.

### 2.2 Explicación en pantalla y explicación breve del mensaje

| Regla              | Explicación en pantalla                                                                                                                                                            | Explicación breve (`shortExplanation`, mensaje de WhatsApp)                                   | Respaldo                                                                                 | Aprobado  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------- |
| R-P1 con S4        | "Como quieres renovar tu web, te recomendamos un sitio corporativo nuevo que reemplace al actual y presente tu negocio con claridad, con buenas prácticas de SEO desde el diseño." | "Un sitio corporativo nuevo reemplaza la web actual y presenta el negocio con claridad."      | Sitios web corporativos (beneficio "Buenas prácticas de SEO integradas desde el diseño") | Pendiente |
| R-P1 con O5        | "Como quieres fortalecer tu marca, un sitio corporativo presenta tu negocio de forma profesional y explica lo que haces sin que tengas que repetirlo."                             | "Un sitio corporativo presenta el negocio de forma profesional y fortalece la marca."         | Sitios web corporativos (descripción corta)                                              | Pendiente |
| R-P2 con S3        | "Tu web actual no te trae clientes: una landing page nueva, enfocada en una sola acción —que el visitante te escriba, agende o compre—, puede reemplazarla."                       | "Una landing page nueva, enfocada en una sola acción, reemplaza la web que no trae clientes." | Landing pages (descripción corta)                                                        | Pendiente |
| R-P2               | "Una landing page se enfoca en una sola acción: que el visitante te escriba, agende o compre, sin distracciones."                                                                  | "Una landing page se enfoca en una sola acción: que el visitante escriba, agende o compre."   | Landing pages                                                                            | Pendiente |
| R-P3 con S5 (R-C2) | "Ya vendes por internet; una tienda online propia te da un canal de venta tuyo, sin depender solo de las redes sociales o de terceros."                                            | "Una tienda propia da un canal de venta sin depender solo de redes sociales o terceros."      | Tiendas online (descripción corta)                                                       | Pendiente |
| R-P3               | "Una tienda online te permite vender las 24 horas con catálogo, carrito y pagos en línea, sin depender solo de las redes sociales."                                                | "Una tienda online permite vender las 24 horas con catálogo, carrito y pagos en línea."       | Tiendas online                                                                           | Pendiente |
| R-P4               | "Con un sistema de {reservas / citas / reservas o citas}, tus clientes agendan solos a cualquier hora: menos llamadas y menos cruces de horario."                                  | "Un sistema de {…} permite que los clientes agenden solos a cualquier hora."                  | Reservas y citas (descripción corta)                                                     | Pendiente |
| R-P5               | "Un sistema de inventario te muestra tus existencias y movimientos en tiempo real, sin hojas de cálculo sueltas."                                                                  | "Un sistema de inventario muestra existencias y movimientos en tiempo real."                  | Sistemas de inventario (beneficios)                                                      | Pendiente |
| R-P6               | "Un sistema de control de ventas, caja y cotizaciones reúne todo en un solo lugar y reduce el trabajo manual y el margen de error."                                                | "Un sistema de ventas, caja y cotizaciones reúne todo en un solo lugar."                      | Control de ventas, caja y cotizaciones (beneficios)                                      | Pendiente |
| R-P7               | "La automatización hace que las tareas repetitivas se hagan solas: menos errores manuales y más tiempo para vender."                                                               | "La automatización hace que las tareas repetitivas se hagan solas."                           | Automatización de procesos (descripción corta)                                           | Pendiente |
| R-P8               | "Un sitio corporativo a medida proyecta una imagen profesional y explica tu negocio sin que tengas que repetirlo."                                                                 | "Un sitio corporativo a medida proyecta una imagen profesional del negocio."                  | Sitios web corporativos (descripción corta)                                              | Pendiente |

### 2.3 Próximo paso (R-N) y nota de inversión (FR-018a)

| Regla                      | Texto                                                                                               | Aprobado  |
| -------------------------- | --------------------------------------------------------------------------------------------------- | --------- |
| R-N1 (P1)                  | "Hablar con un asesor para definir el alcance, la inversión y una fecha de inicio cercana."         | Pendiente |
| R-N2 (P2)                  | "Hablar con un asesor para definir el alcance y la inversión y planificar el inicio este mes."      | Pendiente |
| R-N3 (P3)                  | "Hablar con un asesor para definir el alcance y la inversión y preparar el proyecto con tiempo."    | Pendiente |
| R-N4 (P4)                  | "Resolver dudas con un asesor, sin compromiso, para comparar opciones antes de decidir."            | Pendiente |
| R-C3 (objetivo sin cubrir) | " En la asesoría revisaremos también tu objetivo: {objetivo en minúscula}."                         | Pendiente |
| Nota de inversión (todas)  | "La inversión se define con el asesor por WhatsApp, una vez conocido el alcance real del proyecto." | Pendiente |

### 2.4 Motivos de los complementos (R-K)

| Regla | Motivo                                                                                                           | Aprobado  |
| ----- | ---------------------------------------------------------------------------------------------------------------- | --------- |
| R-K1  | "Aún no tienes web y tu objetivo exige que los clientes te encuentren y te escriban"                             | Pendiente |
| R-K2  | "Quieres vender en línea; el catálogo con pedidos por WhatsApp es el primer paso sin montar una tienda completa" | Pendiente |
| R-K3  | "Tu objetivo es llenar tu agenda de {reservas / citas / reservas o citas}"                                       | Pendiente |
| R-K4  | "Ya vendes por internet: conectar lo que ya usas (pagos, envíos o tu sistema) evita duplicar trabajo"            | Pendiente |

### 2.5 Sección `#diagnostico` e invitación

| Texto                                                                                                                                                                                                       | Origen                            | Aprobado            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------- |
| Párrafo de la sección y de la pregunta 1: "Descubre qué oportunidades tiene tu negocio para crecer con tecnología. Responde unas preguntas y recibe una recomendación personalizada, completamente gratis." | FR-003 (aprobado en la spec)      | Aprobado en la spec |
| Tarjeta móvil: "Descubre qué necesita tu negocio" · "Gratis · Unos 2 minutos"                                                                                                                               | FR-003a (aprobado en la spec, D1) | Aprobado en la spec |

### 2.6 Observaciones sobre el contenido del catálogo que se muestra tal cual

- El texto "cómo trabajaría" usa la descripción larga publicada (`longDescription`), que está escrita con voseo ("sos", "tenés"), mientras que los textos del diagnóstico usan tuteo. Es contenido publicado y no se modifica; se señala por coherencia de tono.
- Landing pages publica "Es la opción más rápida de lanzar…" y el beneficio "Entrega rápida — ideal para lanzamientos puntuales". Son afirmaciones cualitativas, no plazos (FR-018b), pero aparecerán en el resultado.

## 3. Auditoría de GA4 en solo lectura (E31, FR-025b) — Responsable

| Pregunta                                                                               | Resultado |
| -------------------------------------------------------------------------------------- | --------- |
| ¿`generate_lead` está marcado como evento clave?                                       | —         |
| ¿Hay herramientas conectadas que importen esas conversiones (por ejemplo, Google Ads)? | —         |
| Alternativa elegida si es evento clave (A, B o C de `contracts/analytics-events.md`)   | —         |
| Fecha y firma                                                                          | —         |

**La publicación queda bloqueada hasta completar esta sección.** No se modifica GA4 sin autorización expresa.

## 4. Dispositivos reales (§4.1 de quickstart) — Responsable o con su autorización

| Dispositivo y navegador | Orientación | ¿Se mostró la tarjeta? | 25 % | Barra del navegador, header y WhatsApp sin tapar | Botones fuera del indicador de inicio | Lector de pantalla (TalkBack/VoiceOver) | Captura |
| ----------------------- | ----------- | ---------------------- | ---- | ------------------------------------------------ | ------------------------------------- | --------------------------------------- | ------- |
| iPhone (Safari)         | Vertical    | —                      | —    | —                                                | —                                     | —                                       | —       |
| iPhone (Safari)         | Horizontal  | —                      | —    | —                                                | —                                     | —                                       | —       |
| Android (Chrome)        | Vertical    | —                      | —    | —                                                | —                                     | —                                       | —       |
| Android (Chrome)        | Horizontal  | —                      | —    | —                                                | —                                     | —                                       | —       |

## 5. Matriz de pantallas (E20)

Tabla generada por el script de la invitación: por configuración, variante esperada, variante obtenida, mostrada o suprimida y las cinco condiciones medidas. La condición (3), áreas seguras, se mide en Playwright como "dentro del `visualViewport`"; la autoridad para las áreas seguras reales es la sección 4.

**Resultado del 2026-11-07** (`invite-e2e.cjs` contra el build local, analítica bloqueada): 17/17 pantallas correctas. La ventana solo aparece en las tabletas (≥ 768 × 640 px); ningún teléfono en horizontal la recibe. La tarjeta se suprime sin dejar estado en 320 × 568 y en todos los horizontales; en el resto cumple las cinco condiciones.

| Pantalla   | Tipo          | Variante esperada | Obtenida  | Alto / límite (25 %) | Condiciones 1–5 | Estado en sesión | Resultado |
| ---------- | ------------- | ----------------- | --------- | -------------------- | --------------- | ---------------- | --------- |
| 320 × 568  | vertical      | tarjeta (medida)  | suprimida | —                    | —               | (ninguno)        | Pasa      |
| 568 × 320  | horizontal    | tarjeta (medida)  | suprimida | —                    | —               | (ninguno)        | Pasa      |
| 360 × 640  | vertical      | tarjeta (medida)  | tarjeta   | 143 / 160 px         | ✓✓✓✓✓           | shown            | Pasa      |
| 640 × 360  | horizontal    | tarjeta (medida)  | suprimida | —                    | —               | (ninguno)        | Pasa      |
| 375 × 667  | vertical      | tarjeta (medida)  | tarjeta   | 124 / 167 px         | ✓✓✓✓✓           | shown            | Pasa      |
| 667 × 375  | horizontal    | tarjeta (medida)  | suprimida | —                    | —               | (ninguno)        | Pasa      |
| 375 × 812  | vertical      | tarjeta (medida)  | tarjeta   | 124 / 203 px         | ✓✓✓✓✓           | shown            | Pasa      |
| 812 × 375  | horizontal    | tarjeta (medida)  | suprimida | —                    | —               | (ninguno)        | Pasa      |
| 390 × 844  | vertical      | tarjeta (medida)  | tarjeta   | 124 / 211 px         | ✓✓✓✓✓           | shown            | Pasa      |
| 844 × 390  | horizontal    | tarjeta (medida)  | suprimida | —                    | —               | (ninguno)        | Pasa      |
| 414 × 896  | vertical      | tarjeta (medida)  | tarjeta   | 124 / 224 px         | ✓✓✓✓✓           | shown            | Pasa      |
| 896 × 414  | horizontal    | tarjeta (medida)  | suprimida | —                    | —               | (ninguno)        | Pasa      |
| 430 × 932  | vertical      | tarjeta (medida)  | tarjeta   | 124 / 233 px         | ✓✓✓✓✓           | shown            | Pasa      |
| 932 × 430  | horizontal    | tarjeta (medida)  | suprimida | —                    | —               | (ninguno)        | Pasa      |
| 768 × 1024 | tableta       | ventana           | ventana   | —                    | —               | shown            | Pasa      |
| 1024 × 768 | tableta       | ventana           | ventana   | —                    | —               | shown            | Pasa      |
| 1024 × 600 | pantalla baja | tarjeta (medida)  | tarjeta   | 124 / 150 px         | ✓✓✓✓✓           | shown            | Pasa      |

## 6. Accesibilidad manual (§6 de quickstart)

Revisión del 2026-11-07 sobre el build final (puerto 8807), en escritorio (1440 × 900) y móvil (375 × 812). Herramientas: Playwright (teclado, foco, geometría), axe-core en estados abiertos y lectura del código. **No se declara conformidad WCAG 2.2 AA del sitio** (Principio VII): solo "sin fallos conocidos en los criterios revisados".

| Criterio                                       | Cómo se revisó                                                                                                                                                                              | Resultado                                                                                                                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1.1 Teclado                                  | E9: diagnóstico completo solo con teclado; E26: tarjeta con Tab y Escape; radiogroup migrado (flechas, Inicio, Fin)                                                                         | Sin fallos                                                                                                                                                                                       |
| 2.4.3 Orden del foco                           | El foco va al encabezado de cada pantalla; Tab: opciones → "Atrás" → "Siguiente"; al cerrar vuelve al botón que abrió la ventana                                                            | Sin fallos                                                                                                                                                                                       |
| 2.4.7 Foco visible                             | E9 comprueba `:focus-visible` en las opciones; todos los controles usan `FOCUS_RING` o `LIGHT_RING` (E29)                                                                                   | Sin fallos                                                                                                                                                                                       |
| 2.4.11 Foco no tapado                          | `focus-obscured.cjs`: con la tarjeta visible se recorren 79 elementos con Tab                                                                                                               | **Fallo encontrado y corregido**: "Ver Casos de Éxito" quedaba tapado por la tarjeta; ahora la página se desplaza para dejarlo visible (0 de 79 tapados). Las ventanas no aplican (fondo inerte) |
| 1.4.3 / 1.4.11 Contraste                       | axe (`color-contrast`) en la invitación (ventana y tarjeta), una pregunta y el resultado                                                                                                    | 0 infracciones                                                                                                                                                                                   |
| 1.4.4 / 1.4.10 Zoom y reflujo                  | E25 (zoom al 200 % y texto al 130 % y 200 %), E17 (sin desplazamiento horizontal de 320 a 1440 px); la ventana del diagnóstico ocupa la pantalla completa en móvil y se desplaza por dentro | Sin fallos                                                                                                                                                                                       |
| 2.5.8 Tamaño de objetivo                       | Todos los controles ≥ 44 × 44 px (E2, condición 2); axe `target-size` sin infracciones                                                                                                      | Sin fallos                                                                                                                                                                                       |
| 1.3.1 / 3.3.2 Etiquetas e instrucciones        | Radiogroup con `aria-labelledby` al encabezado; error de validación en texto con `role="alert"` y `aria-describedby`; barra de progreso con `aria-valuetext`; ventanas con nombre accesible | Sin fallos                                                                                                                                                                                       |
| Movimiento reducido                            | E18 en la invitación y en las preguntas (sin animación)                                                                                                                                     | Sin fallos                                                                                                                                                                                       |
| FR-005 (relacionado)                           | E6                                                                                                                                                                                          | **Fallo encontrado y corregido**: la invitación podía aparecer con el desplegable "Servicios" abierto; ahora no aparece con el puntero o el foco en el header                                    |
| Lector de pantalla (NVDA, TalkBack, VoiceOver) | —                                                                                                                                                                                           | **Pendiente (Responsable)**                                                                                                                                                                      |

Conclusión: sin fallos conocidos en los criterios revisados, salvo la prueba con lector de pantalla, pendiente. Fuera de alcance: el botón flotante de WhatsApp (preexistente) no se evaluó contra 2.4.11.

## 7. Prueba con una persona real (E30, SC-002) — Responsable

| Persona (sin datos personales: solo un identificador) | Tiempo hasta el resultado | ¿Necesitó ayuda? | Observaciones |
| ----------------------------------------------------- | ------------------------- | ---------------- | ------------- |
| —                                                     | —                         | —                | —             |

## 8. Pruebas existentes migradas

Cambios en los scripts de `C:\tmp\pwenv\` necesarios por el nuevo flujo (por ejemplo, las siete pruebas del radiogroup), con la aserción original y la nueva.

| Script                                                                                                               | Cambio                                                                                                                                                                                                                                                                                                                                           | Aserción original                                                                                                             | Aserción nueva                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fase3-prod-interact.cjs` (bloque "RADIOGROUP DIAGNÓSTICO")                                                          | Apertura: pulsar «Comenzar diagnóstico gratuito» en `#diagnostico` en lugar de "Descubre qué solución necesita tu negocio"; el radiogroup se busca dentro de `#diagnosis-dialog`                                                                                                                                                                 | 7 aserciones del radiogroup (un tab-stop, → ← con vuelta, Home, End, el tab-stop sigue a la selección) y el botón "Siguiente" | Las mismas 8 aserciones, sin cambios. Total de la suite: 50/50 contra el build (T020). Copia del original: `fase3-prod-interact.cjs.bak-pre001`     |
| Todas las suites de regresión (`nav-verify`, `nav-diag`, `fase3-prod-interact`, `fase3-prod-axe`, `liveperf-height`) | Se ejecutan con la precarga `node -r ./no-invite.cjs`, que deja `qt:diagnosis-invite = dismissed` en cada contexto: simula a un visitante que ya vio la invitación. Sin ella, la ventana modal de la invitación (a los 2,5 s, por diseño) bloquea los clics de esas suites, que no prueban la invitación. Los scripts originales no se modifican | Las suites originales                                                                                                         | Las mismas aserciones; la invitación se prueba aparte en `invite-e2e.cjs` (79/79) y `diagnosis-e2e.cjs` se ejecuta con la invitación activa (60/60) |

## 9. Capturas y rendimiento

**Capturas** (2026-11-07, `captures-001.cjs`, en `…\scratchpad\captures-001\`; no se versionan):

- `antes-1440-seccion.png`
- `despues-1440-seccion.png`
- `despues-1440x900-invitacion-ventana.png`
- `despues-1440-resultado-0-complementos.png`
- `despues-1440-pregunta-1.png`
- `despues-1440-resultado-1-complemento.png`
- `despues-1440-resultado-2-complementos.png`
- `antes-768-seccion.png`
- `despues-768-seccion.png`
- `despues-768x1024-invitacion-ventana.png`
- `despues-768-resultado-0-complementos.png`
- `despues-768-pregunta-1.png`
- `despues-768-resultado-1-complemento.png`
- `despues-768-resultado-2-complementos.png`
- `antes-375-seccion.png`
- `despues-375-seccion.png`
- `despues-375x812-invitacion-tarjeta.png`
- `despues-375-resultado-0-complementos.png`
- `despues-375-pregunta-1.png`
- `despues-375-resultado-1-complemento.png`
- `despues-375-resultado-2-complementos.png`
- `antes-320-seccion.png`
- `despues-320-seccion.png`
- `despues-320x568-invitacion-suprimida.png`
- `despues-320-resultado-0-complementos.png`
- `despues-320-pregunta-1.png`
- `despues-320-resultado-1-complemento.png`
- `despues-320-resultado-2-complementos.png`

**Rendimiento** ([perf-001.md](./perf-001.md)): JS de la home de 482 521 a 492 697 bytes (+2,1 %); 0 cambios de diseño al aparecer y cerrarse la invitación.

## 10. Supervisión tras el despliegue — solo con despliegue autorizado

No aplica todavía: no hay despliegue autorizado (T052 pendiente).
