# Feature Specification: Diagnóstico Digital Gratuito como herramienta de captación

**Feature Branch**: `feat/diagnostico-captacion`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Convertir el Diagnóstico Digital Gratuito de Quimora Tech en una herramienta de captación comercial: popup de invitación (2–3 s, una vez por sesión, cierre con botón y Escape, reabrible desde #diagnostico); cuestionario de una pregunta por pantalla con progreso, navegación adelante/atrás y validación (tipo de negocio, situación digital actual, necesidad principal, objetivo comercial, prioridad); recomendación determinista limitada a servicios reales, sin puntuación de madurez ni cifras inventadas, con plazo y rango orientativo de inversión solo si existen datos comerciales aprobados; resultado con 'Continuar por WhatsApp' (mensaje personalizado y codificado, número existente, opción de copiar); eventos de analítica diagnosis_popup_view, diagnosis_start, diagnosis_question_answered, diagnosis_complete, diagnosis_result_view y diagnosis_whatsapp_click sin datos personales; identidad monocromática zinc sin azul, WCAG 2.2 AA, movimiento reducido y sin CLS; se retiran la puntuación de madurez, la pregunta de presupuesto y la calculadora CostEstimator; reutilizar el modelo de diagnóstico, el enlace de WhatsApp y el envío de eventos existentes."

## Clarifications

### Session 2026-11-06

- Q: ¿Qué formato tiene la invitación en móviles? → A: Ventana centrada en escritorio; en móviles, tarjeta flotante inferior que no bloquea ni cubre el contenido principal (FR-007, FR-007a, FR-007b).
- Q: ¿Se retira la pregunta de funcionalidades deseadas? → A: Sí, definitivamente; el cuestionario tiene exactamente cinco preguntas (FR-008, FR-020).
- Q: ¿Una experiencia o varias según el punto de entrada? → A: Una única experiencia compartida por la invitación, la sección #diagnostico y los atajos (FR-013a).
- Q: ¿Recomendación de una sola solución o integral? → A: Integral: una solución principal más los componentes complementarios que estén justificados por las respuestas, sin convertir una necesidad en una propuesta más costosa (FR-014 a FR-015c y "Reglas de recomendación").
- Q: ¿Se muestran precios o inversión en el resultado? → A: No. Ningún precio, rango, valor mínimo, costo ni presupuesto; la inversión se conversa por WhatsApp con el asesor. Sustituye la decisión anterior de mostrar los precios de la sección Precios (FR-018, FR-018a).
- Q: ¿Se muestran plazos? → A: Solo cuando exista un plazo publicado y confirmado como aplicable a la solución principal; si no, se omite (FR-018b). Precisada el 2026-11-07: hoy no hay ninguna correspondencia aprobada.
- Q: ¿Qué incluye el mensaje de WhatsApp? → A: Las cinco respuestas, la solución principal, los complementos, una explicación breve y la solicitud de asesoría (FR-022).

### Session 2026-11-07 (aprobación condicionada del responsable)

- Plazos: no se muestra ningún plazo mientras no exista una correspondencia servicio–plazo aprobada expresamente; hoy no existe ninguna, así que ningún resultado muestra plazo (FR-018b, SC-011).
- Servicios: Reservas y citas e Integraciones con APIs se describen solo con lo que respalda el catálogo actual, sin funcionalidades ni beneficios propios; toda recomendación sin respaldo suficiente se señala para revisión (FR-016b, tabla "Respaldo de cada recomendación").
- Precios: se mantiene la prohibición de precios, rangos y presupuestos; la inversión se conversa por WhatsApp (FR-018, FR-018a).
- Recomendaciones: se mantiene el modelo integral, determinista y basado en necesidades, sin recomendar automáticamente la solución más costosa (FR-014 a FR-015c).
- WhatsApp: se mantienen las cinco respuestas y la recomendación completa en el mensaje (FR-022).

### Session 2026-11-07 (decisiones D1–D4 del plan técnico)

- D1 — Invitación móvil: contenido reducido («Descubre qué necesita tu negocio», «Gratis · Unos 2 minutos», «Comenzar diagnóstico gratuito», «Ahora no» y cierre accesible). El límite del 25 % se mantiene sin excepciones; si la tarjeta no puede cumplir todas las condiciones en una pantalla, la invitación automática no se muestra en ella. El párrafo de apoyo completo se muestra al inicio del cuestionario, sin pantallas ni preguntas adicionales. Escritorio conserva el contenido completo (FR-003, FR-003a, FR-003b, FR-007b, FR-007c, SC-010).
- D2 — Analítica: se conserva `generate_lead` junto con `diagnosis_whatsapp_click`; ambos registran un clic (intención de contactar), nunca un mensaje enviado ni un lead recibido (FR-025, FR-025a).
- D3 — CTA: el botón de la sección #diagnostico pasa a «Comenzar diagnóstico gratuito» (FR-013a).
- D4 — Integración de Spec Kit en `main`: diferida; se documentan las alternativas en el plan técnico y cualquier integración requiere autorización independiente.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Obtener una recomendación integral (Priority: P1)

Un dueño de negocio sin conocimientos técnicos llega a la sección "Diagnóstico Digital Gratuito" de la página principal, inicia el diagnóstico y responde cinco preguntas sencillas, una por pantalla. Al terminar ve una recomendación integral: un resumen de su situación, la necesidad identificada, la solución principal de Quimora Tech, los componentes complementarios que realmente necesita y por qué, cómo trabajaría la solución, sus beneficios funcionales y el siguiente paso. No ve precios.

**Why this priority**: Es el núcleo de valor. Sin una recomendación útil, honesta y creíble no hay nada que llevar a WhatsApp ni motivo para invitar con un popup. Por sí sola ya mejora la sección actual: elimina la puntuación numérica, las cifras supuestas y los rangos de precio no respaldados.

**Independent Test**: Iniciar el diagnóstico desde la sección #diagnostico, responder las cinco preguntas y comprobar que el resultado muestra todos los bloques de FR-016, que la solución principal y cada complemento pertenecen a lo publicado por Quimora Tech, que cada complemento tiene su justificación y que no aparece ningún precio.

**Acceptance Scenarios**:

1. **Given** un visitante en la sección #diagnostico, **When** pulsa el botón de inicio, **Then** ve la primera pregunta (tipo de negocio), un indicador de progreso "1 de 5" y ninguna otra pregunta a la vez.
2. **Given** una pregunta sin responder, **When** el visitante intenta avanzar, **Then** no puede avanzar y se le indica, en texto, que debe elegir una opción.
3. **Given** el visitante en la pregunta 3, **When** pulsa "Atrás", modifica su respuesta de la pregunta 2 y vuelve a avanzar, **Then** se conserva el resto de respuestas y la recomendación final refleja la respuesta modificada.
4. **Given** las cinco preguntas respondidas, **When** el visitante llega al resultado, **Then** ve, en este orden: "¡Tu diagnóstico está listo!", el resumen de su situación, la necesidad identificada, la solución integral recomendada, los componentes complementarios con su motivo, cómo trabajaría la solución, los beneficios funcionales, el plazo (solo si corresponde según FR-018b), el próximo paso y los botones "Continuar por WhatsApp" y "Copiar mensaje".
5. **Given** cualquier combinación posible de respuestas, **When** se genera la recomendación, **Then** la solución principal es un servicio del catálogo publicado, cada complemento es un servicio del catálogo o un componente publicado en un plan, ninguno se repite, hay como máximo dos complementos y el resultado es idéntico cada vez que se repite la combinación.
6. **Given** un resultado cualquiera, **When** se inspecciona toda la pantalla, **Then** no aparece ningún precio, rango, valor mínimo, costo, presupuesto, puntuación ni porcentaje.
7. **Given** respuestas cuya necesidad no requiere complementos, **When** se muestra el resultado, **Then** se presenta solo la solución principal, sin añadir componentes para completar la lista.
8. **Given** el visitante llegó desde un atajo "¿Cuál es tu caso?", **When** se abre el diagnóstico, **Then** el tipo de negocio ya está seleccionado y empieza en la segunda pregunta.

---

### User Story 2 - Continuar la conversación por WhatsApp (Priority: P2)

Tras ver su recomendación, el visitante pulsa "Continuar por WhatsApp". Se abre WhatsApp con un mensaje ya redactado que incluye sus cinco respuestas y la recomendación integral completa. El visitante lo revisa y decide si enviarlo. Si WhatsApp no está disponible, puede copiar el mensaje y enviarlo por el medio que prefiera. La inversión se conversa después con el asesor.

**Why this priority**: Es la conversión comercial. Quimora Tech recibe conversaciones calificadas con el contexto completo del prospecto. Depende de que exista la recomendación (P1).

**Independent Test**: Completar un diagnóstico, pulsar "Continuar por WhatsApp" y comprobar que el enlace abre el número comercial existente con un mensaje que contiene los once elementos de FR-022, con tildes y caracteres especiales intactos. Probar también "Copiar mensaje".

**Acceptance Scenarios**:

1. **Given** la pantalla de resultado, **When** el visitante pulsa "Continuar por WhatsApp", **Then** se abre WhatsApp (aplicación o versión web) hacia el número comercial ya configurado en el sitio, con el mensaje prellenado y sin enviarlo automáticamente.
2. **Given** el mensaje generado, **When** se inspecciona, **Then** contiene, en este orden: saludo, mención del Diagnóstico Digital Gratuito, tipo de negocio, situación digital actual, necesidad principal, objetivo comercial, prioridad, solución integral recomendada, servicios y componentes complementarios (o "ninguno adicional"), explicación breve y solicitud de asesoría personalizada, con tildes, eñes y signos correctos.
3. **Given** el mensaje generado, **When** se inspecciona, **Then** no contiene precios, rangos ni presupuestos, ni datos personales que el visitante no haya escrito.
4. **Given** la pantalla de resultado, **When** el visitante pulsa "Copiar mensaje", **Then** el mensaje completo, idéntico al de WhatsApp, queda copiado y se le confirma con un aviso visible y anunciado a lectores de pantalla.
5. **Given** que el navegador no permite copiar automáticamente, **When** el visitante pulsa "Copiar mensaje", **Then** se le muestra el texto completo seleccionable para que lo copie manualmente.
6. **Given** la pantalla de resultado, **When** se muestra, **Then** aparece el texto: "Un asesor de Quimora Tech podrá revisar contigo esta recomendación y orientarte sobre la solución más adecuada para tu negocio." y no se pide nombre, correo ni teléfono.

---

### User Story 3 - Invitación amable al entrar en la página principal (Priority: P3)

Un visitante entra en la página principal. Entre 2 y 3 segundos después aparece una invitación discreta. En escritorio y tableta es una ventana centrada con el contenido completo: "¿Tu negocio está aprovechando todo su potencial digital?", el texto de apoyo, la indicación de que toma unos 2 minutos, el botón "Comenzar diagnóstico gratuito" y la opción "Ahora no". En móvil es una tarjeta reducida en el borde inferior ("Descubre qué necesita tu negocio", "Gratis · Unos 2 minutos", los mismos dos botones y un cierre) que no bloquea la lectura; si en esa pantalla la tarjeta no cabe cumpliendo todas sus condiciones, no aparece. Si la rechaza o la cierra, no vuelve a verla en esa sesión del navegador. Si acepta, entra directamente a la primera pregunta.

**Why this priority**: Aumenta el alcance del diagnóstico, pero el diagnóstico (P1) y la conversión (P2) ya aportan valor sin ella. Es además la parte con más riesgo para la experiencia, por lo que debe poder activarse o retirarse sin afectar a P1 y P2.

**Independent Test**: Abrir la página principal en una sesión nueva y medir el momento de aparición; cerrar, recargar y navegar dentro de la sesión para comprobar que no reaparece; abrir una sesión nueva y comprobar que vuelve a aparecer una vez. Repetirlo en escritorio y en una matriz de pantallas móviles, comprobando que en las pantallas donde la tarjeta no cabe no aparece y el diagnóstico sigue disponible desde la sección y los atajos.

**Acceptance Scenarios**:

1. **Given** una sesión nueva en la página principal, **When** transcurren entre 2 y 3 segundos desde la carga, **Then** aparece la invitación una sola vez.
2. **Given** la invitación visible, **When** el visitante pulsa "Ahora no", el botón de cierre o la tecla Escape, **Then** la invitación desaparece, el foco queda en un punto lógico de la página y no vuelve a aparecer en esa sesión, aunque recargue o navegue a otras páginas y regrese.
3. **Given** un visitante en móvil, **When** aparece la invitación, **Then** es una tarjeta en el borde inferior con "Descubre qué necesita tu negocio", "Gratis · Unos 2 minutos", "Comenzar diagnóstico gratuito", "Ahora no" y un botón de cierre; ocupa como máximo el 25 % de la altura visible, respeta las áreas seguras, no tapa la navegación ni el botón flotante de WhatsApp, y el visitante puede seguir desplazándose y leyendo sin cerrarla.
4. **Given** un visitante en escritorio o tableta, **When** aparece la invitación, **Then** es una ventana centrada y el foco permanece dentro de ella hasta que la cierra o la acepta.
5. **Given** la invitación visible, **When** el visitante pulsa "Comenzar diagnóstico gratuito", **Then** se abre la ventana del diagnóstico en la primera pregunta.
6. **Given** un visitante que ya completó el diagnóstico en esta sesión (desde la invitación o desde la sección), **When** vuelve a la página principal, **Then** la invitación no aparece.
7. **Given** que la invitación ya se descartó en esta sesión, **When** el visitante usa el botón de inicio de la sección #diagnostico, **Then** se abre la misma ventana del diagnóstico y puede hacerlo con normalidad.
8. **Given** un visitante que ya está interactuando con el diagnóstico, con el formulario de contacto o con el menú móvil cuando se cumple el tiempo, **When** llega el momento de mostrar la invitación, **Then** la invitación no aparece en esa visita.
9. **Given** un visitante en cualquier página que no sea la principal, **When** pasa el tiempo, **Then** no aparece ninguna invitación.
10. **Given** una pantalla móvil donde la tarjeta no puede cumplir todas las condiciones de FR-007b (por ejemplo, un teléfono en horizontal), **When** llega el momento de mostrarla, **Then** no aparece, no se registra como mostrada ni descartada, no se envía `diagnosis_popup_view`, y el diagnóstico sigue disponible desde la sección #diagnostico y los atajos.
11. **Given** la tarjeta visible, **When** el visitante gira el teléfono o cambia el tamaño de la ventana y la tarjeta deja de cumplir las condiciones, **Then** la tarjeta se oculta sin contar como descarte y no vuelve a aparecer en esa sesión.

---

### User Story 4 - Medir el embudo sin datos personales (Priority: P4)

El responsable de Quimora Tech consulta en su herramienta de analítica cuántas personas vieron la invitación, iniciaron el diagnóstico, respondieron cada pregunta, lo completaron, vieron el resultado y pulsaron "Continuar por WhatsApp", para conocer la conversión de cada paso. Ningún evento contiene respuestas individuales ni datos personales.

**Why this priority**: Permite optimizar la herramienta con datos, pero no cambia lo que vive el visitante.

**Independent Test**: Recorrer el embudo completo con la analítica observada (en pruebas, interceptada sin enviarse) y comprobar que cada uno de los seis eventos se registra exactamente una vez por acción y que ninguno incluye el contenido de las respuestas.

**Acceptance Scenarios**:

1. **Given** un recorrido completo desde la invitación hasta WhatsApp, **When** se observan los eventos, **Then** se registran, en este orden y una vez cada uno por acción: diagnosis_popup_view, diagnosis_start, cinco diagnosis_question_answered, diagnosis_complete, diagnosis_result_view y diagnosis_whatsapp_click.
2. **Given** cualquier evento del diagnóstico, **When** se inspeccionan sus datos, **Then** solo incluyen el origen (invitación, sección o atajo), el número de pregunta y el identificador de la solución principal recomendada; nunca el texto ni el identificador de una respuesta individual, ni los complementos.
3. **Given** que la pantalla se vuelve a dibujar sin acción del visitante, **When** se observan los eventos, **Then** no se registran eventos duplicados.

---

### Edge Cases

- **Almacenamiento de sesión no disponible** (navegación privada estricta, almacenamiento bloqueado): la invitación aparece como máximo una vez por carga de página, nunca en bucle, y el sitio no muestra errores.
- **El visitante sale de la página principal antes de los 2 segundos**: la invitación no aparece.
- **Pantalla móvil donde la tarjeta no cabe** (pantallas bajas, teléfono en horizontal, tamaño de letra del sistema ampliado, áreas seguras grandes): la invitación automática no aparece (FR-007c); el diagnóstico sigue disponible desde la sección y los atajos.
- **Giro del teléfono o cambio de tamaño con la tarjeta visible**: si deja de cumplir las condiciones, se oculta sin contar como descarte (FR-007c).
- **Dispositivos con áreas seguras** (muesca, isla o indicador de inicio): la tarjeta se mantiene dentro del área visible útil y sus controles no quedan bajo esas zonas.
- **La página llega con un ancla** (por ejemplo, un enlace a #contacto o #precios desde otra página): se respeta la navegación del visitante; la invitación sigue las mismas reglas de aparición y nunca desplaza la posición de lectura.
- **Recarga o "Atrás" del navegador a mitad del cuestionario**: el cuestionario vuelve a su inicio sin errores; no se conservan respuestas entre visitas.
- **Cambio de una respuesta anterior**: la recomendación (principal, complementos, explicación y próximo paso) se recalcula con la respuesta nueva.
- **Respuestas que parecen contradictorias** (por ejemplo, "Ya vendo por internet" y necesidad "Vender mis productos por internet"): se aplican las reglas R-C1 a R-C4; nunca se muestra un error ni un resultado vacío.
- **Necesidad y objetivo apuntan a capacidades distintas sin un servicio que las una**: se recomienda según la necesidad y el próximo paso indica que el objetivo se revisará en la asesoría (R-C3).
- **Tipo de negocio "Otro"**: el resultado usa una redacción genérica ("tu negocio", "reservas o citas") según R-C5; la recomendación es la misma que con cualquier otro tipo de negocio y las mismas respuestas.
- **Ningún complemento justificado**: el resultado muestra solo la solución principal.
- **Solución principal sin beneficios publicados** (servicios del catálogo que solo tienen descripción corta): el resultado usa únicamente la descripción publicada y no inventa beneficios.
- **Sin correspondencia servicio–plazo aprobada (hoy, en todos los casos)**: el bloque de plazo no aparece; no se muestra un hueco, un texto de relleno ni una estimación.
- **Sin JavaScript**: la sección #diagnostico sigue mostrando su presentación y un acceso alternativo de contacto por WhatsApp; no hay invitación.
- **WhatsApp no instalado en escritorio**: el enlace abre la versión web oficial; "Copiar mensaje" sigue disponible.
- **El navegador bloquea la apertura de una pestaña nueva**: el visitante sigue en la página y puede usar "Copiar mensaje".
- **Mensaje largo**: con dos complementos y la explicación, el mensaje se abre completo en WhatsApp y se copia completo.
- **Pantallas muy estrechas (320 px), zoom al 200 % o pantallas bajas**: invitación, cuestionario y resultado caben sin desplazamiento horizontal y con todos los controles alcanzables.
- **Movimiento reducido activado**: la invitación y las transiciones entre preguntas aparecen sin animaciones de desplazamiento.

## Requirements _(mandatory)_

### Functional Requirements

#### Invitación (popup)

- **FR-001**: El sistema MUST mostrar la invitación solo en la página principal, entre 2 y 3 segundos después de cargarla, y nunca de forma inmediata.
- **FR-002**: El sistema MUST mostrar la invitación como máximo una vez por sesión del navegador, recordándolo durante la sesión, y no mostrarla si el visitante la cerró o completó el diagnóstico en esa sesión.
- **FR-003**: La invitación de escritorio y tableta MUST incluir el título "¿Tu negocio está aprovechando todo su potencial digital?", el texto "Descubre qué oportunidades tiene tu negocio para crecer con tecnología. Responde unas preguntas y recibe una recomendación personalizada, completamente gratis.", la indicación de que toma unos 2 minutos, el botón principal "Comenzar diagnóstico gratuito", la acción secundaria "Ahora no" y un botón de cierre accesible.
- **FR-003a**: La tarjeta móvil MUST incluir exactamente: el título "Descubre qué necesita tu negocio", el texto secundario "Gratis · Unos 2 minutos", el botón principal "Comenzar diagnóstico gratuito", la acción secundaria "Ahora no" y un botón de cierre accesible. No incluye el párrafo de apoyo.
- **FR-003b**: La primera pregunta del cuestionario MUST mostrar sobre ella, como introducción breve, el párrafo de apoyo de FR-003, en la misma pantalla y sin añadir pantallas, pasos ni preguntas. Si el diagnóstico se abre desde un atajo (empieza en la pregunta 2), el párrafo no se muestra.
- **FR-004**: La invitación MUST poder cerrarse con un botón de cierre visible, con "Ahora no" y con la tecla Escape. Al cerrarse, el foco MUST quedar en el elemento que lo tenía antes de abrirse o, si estaba dentro de la invitación, en un punto lógico de la página, nunca perdido.
- **FR-005**: La invitación MUST NOT aparecer si el visitante está interactuando con el diagnóstico, con un formulario o con el menú de navegación en el momento previsto.
- **FR-006**: La invitación MUST NOT desplazar el contenido de la página ni provocar cambios de diseño, y al cerrarse la página debe quedar exactamente como estaba.
- **FR-007**: En pantallas de escritorio y tableta (768 px de ancho o más), la invitación MUST presentarse como una ventana centrada sobre la página, que mantiene el foco dentro de ella mientras está abierta.
- **FR-007a**: En móviles (menos de 768 px de ancho), la invitación MUST presentarse como una tarjeta flotante en el borde inferior que no bloquea la página: el visitante puede seguir leyendo, desplazándose y usando la navegación sin cerrarla; la tarjeta no captura el foco ni impide el desplazamiento.
- **FR-007b**: La tarjeta móvil MUST cumplir a la vez, sin excepciones: (1) ocupar como máximo el 25 % de la altura visible en ese momento; (2) mantener todos sus controles con un objetivo táctil de al menos 44 × 44 px; (3) quedar dentro de las áreas seguras del dispositivo; (4) no tapar la barra de navegación ni el botón flotante de WhatsApp; (5) no bloquear el desplazamiento ni capturar el foco.
- **FR-007c**: La tarjeta móvil MUST mostrarse solo si, en el momento de mostrarla, cumple todas las condiciones de FR-007b medidas en la pantalla real. Si no las cumple, la invitación automática no se muestra en esa carga de página, no se registra en el estado de la sesión y no se envía `diagnosis_popup_view`. Si deja de cumplirlas mientras está visible (giro o cambio de tamaño), se oculta sin contar como descarte y no vuelve a mostrarse en la sesión. En ningún caso se reduce el tamaño de los controles ni se amplía el límite del 25 % para que quepa.

#### Cuestionario

- **FR-008**: El cuestionario MUST presentar exactamente cinco preguntas, una por pantalla, en este orden: tipo de negocio, situación digital actual, necesidad principal, objetivo comercial y prioridad.
- **FR-009**: Cada pregunta MUST ofrecer respuestas como opciones seleccionables, redactadas sin jerga técnica, con el estado seleccionado visible y anunciado a tecnologías de apoyo.
- **FR-010**: El cuestionario MUST mostrar un indicador de progreso ("pregunta N de 5"), permitir volver a la pregunta anterior sin perder respuestas e impedir avanzar sin responder, explicándolo en texto.
- **FR-011**: Las opciones de tipo de negocio MUST ser las mismas que ya usa el sitio (incluidos los atajos "¿Cuál es tu caso?"), que MUST seguir abriendo el diagnóstico con el tipo de negocio preseleccionado.
- **FR-012**: Las opciones de las preguntas 2 a 5 MUST ser las de la tabla "Opciones de respuesta" (Reglas de recomendación); el plan puede ajustar su redacción sin cambiar su significado.
- **FR-013**: El diagnóstico MUST poder iniciarse en cualquier momento desde la sección #diagnostico, incluso si la invitación se descartó.
- **FR-013a**: Existe una única experiencia de diagnóstico: el cuestionario y el resultado se presentan en la misma ventana tanto si se inician desde la invitación (escritorio o tarjeta móvil), desde la sección #diagnostico o desde los atajos "¿Cuál es tu caso?". En móviles, esa ventana ocupa la pantalla completa, porque la abre el propio visitante. La sección #diagnostico conserva su presentación, y su botón de inicio pasa a llamarse "Comenzar diagnóstico gratuito", igual que en la invitación. Los atajos abren la misma ventana con el mismo mecanismo.

#### Recomendación integral

- **FR-014**: El sistema MUST generar una recomendación integral con reglas fijas a partir de las cinco respuestas: la misma combinación produce siempre la misma solución principal, los mismos complementos, la misma explicación y el mismo próximo paso.
- **FR-015**: La solución principal MUST ser un servicio del catálogo de servicios publicado en el sitio y MUST elegirse según la tabla R-P (necesidad principal, ajustada por situación digital y tipo de negocio).
- **FR-015a**: Cada complemento MUST ser un servicio del catálogo publicado o un componente publicado en un plan de la sección Precios, MUST activarse solo por una regla R-K de la tabla de complementos y MUST mostrarse con su motivo, expresado a partir de las respuestas del visitante.
- **FR-015b**: La recomendación MUST incluir como máximo dos complementos, sin repetir la solución principal ni repetirse entre sí. Si ninguna regla R-K se activa, no se muestra ningún complemento.
- **FR-015c**: Las reglas MUST NOT sustituir la solución principal por otra más amplia o costosa por efecto del objetivo, la situación o la prioridad: el objetivo solo puede añadir un complemento o cambiar la explicación, y la prioridad solo cambia el próximo paso.
- **FR-016**: El resultado MUST mostrar, en este orden: (1) "¡Tu diagnóstico está listo!"; (2) resumen de la situación del negocio; (3) necesidad principal identificada; (4) solución integral recomendada; (5) componentes y servicios complementarios con su motivo, si los hay; (6) cómo trabajaría la solución; (7) beneficios funcionales; (8) plazo, solo según FR-018b; (9) próximo paso: asesoría personalizada; (10) botón principal "Continuar por WhatsApp"; (11) botón secundario "Copiar mensaje". Incluye además un aviso de que es una orientación y no una auditoría técnica.
- **FR-016a**: "Cómo trabajaría la solución" y los "beneficios funcionales" MUST tomarse del contenido publicado de cada servicio del catálogo (descripción y lista de beneficios). Si un servicio no publica lista de beneficios, se usa solo su descripción publicada.
- **FR-016b**: Cada texto del resultado que describa una solución o un complemento (qué es, cómo trabajaría, beneficios y motivo) MUST poder rastrearse hasta el catálogo publicado o un plan publicado, según la tabla "Respaldo de cada recomendación". Un texto sin respaldo no se publica: se marca para revisión del responsable.
- **FR-017**: El resultado MUST NOT mostrar puntuaciones numéricas, porcentajes, estadísticas externas, diagnósticos de SEO o de seguridad, promesas de resultados comerciales (ventas, clientes o ingresos) ni funcionalidades, integraciones o capacidades que no estén publicadas.
- **FR-018**: Ninguna pantalla del diagnóstico (invitación, cuestionario ni resultado) MUST mostrar precios, rangos de inversión, valores mínimos, costos estimados ni presupuestos calculados.
- **FR-018a**: El próximo paso MUST indicar que la inversión se define con un asesor de Quimora Tech, por WhatsApp, después de conocer el alcance real del proyecto.
- **FR-018b**: El resultado MUST NOT mostrar plazos de entrega mientras no exista una correspondencia entre servicio y plazo aprobada expresamente por el responsable (ver "Plazos publicados" en Assumptions); a fecha de esta especificación no existe ninguna, por lo que ningún resultado muestra plazo y el bloque (8) de FR-016 se omite. El diagnóstico MUST NOT contener estimaciones de plazo propias. Cuando se apruebe una correspondencia, el plazo mostrado será exactamente el publicado.
- **FR-019**: El resultado MUST NOT exigir registro, correo ni teléfono para verse.
- **FR-020**: El sistema MUST retirar la puntuación de madurez, la pregunta de presupuesto, la pregunta de funcionalidades deseadas, la calculadora de coste por abandono y toda estimación de inversión del resultado actual.

#### WhatsApp

- **FR-021**: El botón principal del resultado MUST ser "Continuar por WhatsApp" y abrir una conversación con el número comercial ya configurado en el sitio, con un mensaje prellenado que el visitante revisa y envía él mismo; nunca se envía automáticamente.
- **FR-022**: El mensaje MUST construirse con las respuestas reales y la recomendación generada, e incluir en este orden: (1) saludo; (2) indicación de que completó el Diagnóstico Digital Gratuito; (3) tipo de negocio; (4) situación digital actual; (5) necesidad principal; (6) objetivo comercial; (7) prioridad; (8) solución integral recomendada; (9) servicios y componentes complementarios, o "ninguno adicional"; (10) explicación breve de por qué se recomienda; (11) solicitud de asesoría personalizada.
- **FR-022a**: El mensaje MUST NOT incluir precios, rangos, presupuestos ni datos personales, y MUST NOT pedir al visitante información adicional antes de abrirse.
- **FR-023**: El mensaje MUST llegar íntegro, con tildes, eñes, signos y saltos de línea correctos, en la aplicación y en la versión web de WhatsApp.
- **FR-024**: El resultado MUST ofrecer "Copiar mensaje", que copia exactamente el mismo texto del enlace de WhatsApp, con confirmación accesible, y una alternativa de texto seleccionable si el navegador no permite copiar.

#### Analítica

- **FR-025**: El sistema MUST registrar los eventos diagnosis_popup_view, diagnosis_start, diagnosis_question_answered, diagnosis_complete, diagnosis_result_view y diagnosis_whatsapp_click, una vez por acción del visitante y sin duplicados por redibujado. Además MUST conservar el evento existente `generate_lead` (con `method: "whatsapp"` y `source: "diagnostico"`) en el clic de "Continuar por WhatsApp".
- **FR-025a**: Un clic en "Continuar por WhatsApp" MUST producir exactamente un `diagnosis_whatsapp_click` y un `generate_lead`. Ambos registran la intención de contactar (el clic), nunca un mensaje enviado ni un lead recibido; ningún evento ni texto del sitio afirma que el mensaje se envió.
- **FR-026**: Los eventos MUST NOT contener datos personales, el contenido ni el identificador de respuestas individuales, ni los complementos; solo pueden incluir el formato de la invitación (ventana o tarjeta), el origen del inicio (invitación, sección o atajo), el número de pregunta y el identificador de la solución principal recomendada; `generate_lead` conserva sus parámetros actuales (`method`, `source`).
- **FR-027**: Los eventos MUST seguir el mismo mecanismo de envío y la misma configuración de privacidad que el resto del sitio, sin añadir orígenes externos nuevos.

#### Calidad

- **FR-028**: La invitación, el cuestionario y el resultado MUST cumplir WCAG 2.2 AA: operación completa con teclado, foco visible, nombres y roles accesibles, contraste AA y objetivos táctiles de al menos 44 × 44 px. Las ventanas (invitación de escritorio y ventana del diagnóstico) mantienen el foco dentro mientras están abiertas y lo devuelven al cerrarse; la tarjeta móvil, al no ser bloqueante, no retiene el foco, pero es alcanzable con teclado y lectores de pantalla y se anuncia al aparecer.
- **FR-029**: La invitación, el cuestionario y el resultado MUST respetar la preferencia de movimiento reducido.
- **FR-030**: La invitación, el cuestionario y el resultado MUST usar la identidad visual vigente (paleta monocromática zinc sin azul, tipografías, radios, botones e iconografía existentes) y el sistema de CTAs de `CLAUDE.md`; cualquier etiqueta nueva ("Continuar por WhatsApp", "Copiar mensaje", "Comenzar diagnóstico gratuito") se documenta allí.
- **FR-031**: La página MUST NOT bloquear el desplazamiento de forma permanente: solo las ventanas pueden bloquearlo mientras están abiertas, y al cerrarse vuelve a su estado previo. La tarjeta móvil nunca lo bloquea.
- **FR-032**: Ninguna pantalla del flujo MUST producir desplazamiento horizontal entre 320 y 1440 px.

### Reglas de recomendación (matriz de decisión)

Estas reglas definen qué se recomienda; el plan técnico decide cómo se implementan. Usan solo servicios del catálogo publicado (sección "Soluciones de software" y páginas `/servicios/*`) y componentes publicados en los planes de la sección Precios.

#### Opciones de respuesta

| Pregunta                    | Código | Opción                                      |
| --------------------------- | ------ | ------------------------------------------- |
| 1. Tipo de negocio          | —      | Las nueve opciones actuales del sitio       |
| 2. Situación digital actual | S1     | No tengo página web                         |
|                             | S2     | Solo uso redes sociales o WhatsApp          |
|                             | S3     | Tengo una web, pero no me trae clientes     |
|                             | S4     | Tengo una web y quiero renovarla            |
|                             | S5     | Ya vendo por internet                       |
| 3. Necesidad principal      | N1     | Que más clientes me encuentren              |
|                             | N2     | Vender mis productos por internet           |
|                             | N3     | Recibir reservas o citas sin hacerlo a mano |
|                             | N4     | Controlar mi inventario o existencias       |
|                             | N5     | Ordenar mis ventas, caja y cotizaciones     |
|                             | N6     | Ahorrar tiempo automatizando tareas         |
|                             | N7     | Dar una imagen más profesional              |
| 4. Objetivo comercial       | O1     | Conseguir más clientes o contactos          |
|                             | O2     | Vender en línea                             |
|                             | O3     | Llenar mi agenda de reservas o citas        |
|                             | O4     | Operar con más orden y menos trabajo manual |
|                             | O5     | Fortalecer mi marca                         |
| 5. Prioridad                | P1     | Lo antes posible                            |
|                             | P2     | Este mes                                    |
|                             | P3     | En los próximos 2 meses                     |
|                             | P4     | Solo estoy investigando                     |

La necesidad "Ordenar ventas, inventario o caja" se divide en N4 y N5 para que cada opción corresponda a un único servicio publicado y no haya que añadir un módulo sin saber si el visitante lo necesita. El tipo de negocio no cambia la solución ni los complementos (no encarece la propuesta); solo ajusta la redacción según R-C5.

#### R-P: solución principal (la decide la necesidad)

| Regla | Necesidad | Ajuste                                    | Solución principal (catálogo)          |
| ----- | --------- | ----------------------------------------- | -------------------------------------- |
| R-P1  | N1        | Si la situación es S4 o el objetivo es O5 | Sitios web corporativos                |
| R-P2  | N1        | En cualquier otro caso                    | Landing pages                          |
| R-P3  | N2        | —                                         | Tiendas online (eCommerce)             |
| R-P4  | N3        | —                                         | Reservas y citas                       |
| R-P5  | N4        | —                                         | Sistemas de inventario                 |
| R-P6  | N5        | —                                         | Control de ventas, caja y cotizaciones |
| R-P7  | N6        | —                                         | Automatización de procesos             |
| R-P8  | N7        | —                                         | Sitios web corporativos                |

#### R-K: complementos (máximo dos, en este orden de prioridad)

| Regla | Se activa cuando                                                                                                                                                                                   | Complemento                                                                                                   | Motivo que se muestra                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| R-K1  | La principal es Reservas y citas, Sistemas de inventario, Control de ventas, caja y cotizaciones o Automatización de procesos (R-P4 a R-P7); la situación es S1 o S2, y el objetivo es O1, O2 u O3 | Landing pages                                                                                                 | Aún no tienes web y tu objetivo exige que los clientes te encuentren y te escriban                             |
| R-K2  | El objetivo es O2, la principal no es Tiendas online y la situación no es S5                                                                                                                       | Catálogo de productos o servicios con enlace directo a WhatsApp (componentes publicados del plan Emprendedor) | Quieres vender en línea; el catálogo con pedidos por WhatsApp es el primer paso sin montar una tienda completa |
| R-K3  | El objetivo es O3 y la principal no es Reservas y citas                                                                                                                                            | Reservas y citas                                                                                              | Tu objetivo es llenar tu agenda de reservas o citas                                                            |
| R-K4  | La situación es S5 y la principal es Tiendas online, Sistemas de inventario o Control de ventas, caja y cotizaciones                                                                               | Integraciones con APIs                                                                                        | Ya vendes por internet: conectar lo que ya usas (pagos, envíos o tu sistema) evita duplicar trabajo            |

Ningún otro servicio del catálogo se recomienda de forma automática; ver "Servicios fuera del diagnóstico" en Assumptions.

#### R-C: respuestas contradictorias, desempates y casos sin coincidencia clara

- **R-C1 (orden de decisión)**: la necesidad decide la solución principal; la situación y el objetivo solo la ajustan dentro de la misma necesidad (R-P1/R-P2); el objetivo y la situación solo añaden complementos (R-K); la prioridad solo cambia el próximo paso (R-N).
- **R-C2 (necesidad ya cubierta)**: si la situación es S5 ("Ya vendo por internet") y la necesidad es N2, la principal sigue siendo Tiendas online y la explicación indica que se trata de tener una tienda propia, sin depender solo de redes sociales o de terceros (respaldado por la descripción publicada del servicio); no se ofrece optimizar la tienda actual, porque ese servicio no está publicado. Nunca se omite la recomendación.
- **R-C3 (sin coincidencia clara)**: si el objetivo apunta a una capacidad distinta de la necesidad y ninguna regla R-K la cubre (por ejemplo, N4 o N5 con O5, o cualquier necesidad con O4), no se añade complemento y el próximo paso indica que ese objetivo se revisará en la asesoría.
- **R-C4 (desempate de complementos)**: si se activan más de dos reglas R-K, se toman las dos primeras en el orden de la tabla. Un complemento igual a la principal o a otro complemento ya elegido se descarta y se pasa a la siguiente regla.
- **R-C5 (tipo de negocio)**: el tipo de negocio solo ajusta la redacción: el resumen nombra el negocio ("tu restaurante", "tu clínica"); en N3 y R-K3 se habla de "reservas" para restaurante y cafetería, de "citas" para clínica, abogado e inmobiliaria, y de "reservas o citas" para los demás; con "Otro" se usa "tu negocio".

#### R-N: próximo paso según la prioridad

| Regla | Prioridad | Próximo paso                                                                                  |
| ----- | --------- | --------------------------------------------------------------------------------------------- |
| R-N1  | P1        | Hablar con un asesor para definir el alcance, la inversión y una fecha de inicio cercana      |
| R-N2  | P2        | Hablar con un asesor para definir el alcance y la inversión y planificar el inicio este mes   |
| R-N3  | P3        | Hablar con un asesor para definir el alcance y la inversión y preparar el proyecto con tiempo |
| R-N4  | P4        | Resolver dudas con un asesor, sin compromiso, para comparar opciones antes de decidir         |

Todos los próximos pasos remiten a "Continuar por WhatsApp" e indican que la inversión se define con el asesor (FR-018a).

#### Respaldo de cada recomendación

| Recomendación                                                   | Usada en   | Respaldo publicado                                                                                 | Estado                                                                             |
| --------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Landing pages                                                   | R-P2, R-K1 | Catálogo con página propia (`/servicios/landing-pages`) y lista de beneficios                      | Respaldada                                                                         |
| Sitios web corporativos                                         | R-P1, R-P8 | Catálogo con página propia (`/servicios/desarrollo-web`) y lista de beneficios                     | Respaldada como web nueva; no como rediseño (ver Assumptions)                      |
| Tiendas online (eCommerce)                                      | R-P3       | Catálogo con página propia (`/servicios/tiendas-online`) y lista de beneficios                     | Respaldada como tienda propia; no como optimización de una tienda existente (R-C2) |
| Reservas y citas                                                | R-P4, R-K3 | Solo descripción corta del catálogo                                                                | Respaldada solo con su descripción corta                                           |
| Sistemas de inventario                                          | R-P5       | Catálogo con página propia (`/servicios/sistemas-de-inventario`) y lista de beneficios             | Respaldada                                                                         |
| Control de ventas, caja y cotizaciones                          | R-P6       | Catálogo con página propia (`/servicios/sistemas-de-facturacion`) y lista de beneficios            | Respaldada                                                                         |
| Automatización de procesos                                      | R-P7       | Catálogo con página propia (`/servicios/automatizacion-de-procesos`) y lista de beneficios         | Respaldada                                                                         |
| Catálogo de productos o servicios con enlace directo a WhatsApp | R-K2       | Componentes "Catálogo de productos o servicios" y "Enlace directo a WhatsApp" del plan Emprendedor | Respaldada como componente de plan, no como servicio independiente                 |
| Integraciones con APIs                                          | R-K4       | Solo descripción corta del catálogo ("pagos, envíos, WhatsApp o el sistema que ya usas")           | Respaldada solo con su descripción corta                                           |

**Señaladas para revisión del responsable** (no bloquean el plan; el resultado ya se limita a lo publicado):

1. Reservas y citas e Integraciones con APIs: sin lista de beneficios publicada; el bloque "beneficios funcionales" de FR-016 mostrará solo su descripción.
2. Situación S4 ("Tengo una web y quiero renovarla"): el catálogo respalda construir una web nueva, no rediseñar la existente; la explicación lo dirá así.
3. Situación S5 con necesidad N2 (R-C2): el catálogo respalda una tienda propia, no optimizar la actual.

### Key Entities

- **Respuestas del diagnóstico**: las cinco elecciones del visitante (tipo de negocio, situación digital, necesidad principal, objetivo, prioridad). Viven solo durante la visita; no se guardan ni se envían a ningún servidor.
- **Recomendación integral**: solución principal, de cero a dos complementos con su motivo, resumen de situación, necesidad identificada, cómo trabajaría, beneficios funcionales, plazo opcional y próximo paso. Se deriva de forma determinista de las respuestas con las reglas R-P, R-K, R-C y R-N.
- **Complemento**: servicio del catálogo o componente publicado en un plan de Precios, añadido por una regla R-K con un motivo explícito.
- **Mensaje de WhatsApp**: texto compuesto a partir de las respuestas y la recomendación integral, que el visitante revisa y envía; es el mismo texto que se copia con "Copiar mensaje".
- **Estado de la invitación en la sesión**: si la invitación ya se mostró, se descartó o el diagnóstico se completó en la sesión actual del navegador.
- **Catálogo de servicios**: la lista de servicios que Quimora Tech publica en el sitio, con su descripción y, cuando existen, sus beneficios; es la única fuente de soluciones principales y del contenido "cómo trabajaría" y "beneficios".
- **Plazo publicado**: un plazo de entrega que figura en el sitio y cuya correspondencia con una solución concreta ha aprobado expresamente el responsable. Hoy no hay ninguno aprobado.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: En el 100 % de las sesiones nuevas de prueba en escritorio, tableta y pantallas móviles donde la tarjeta cumple FR-007b, la invitación aparece entre 2,0 y 3,0 segundos después de cargar la página principal, y en ninguna sesión aparece más de una vez.
- **SC-002**: Un visitante sin conocimientos técnicos completa las cinco preguntas y llega al resultado en menos de 2 minutos.
- **SC-003**: En el 100 % de las combinaciones posibles de respuestas (6 300), la recomendación tiene una solución principal del catálogo, como máximo dos complementos publicados y distintos entre sí y de la principal, cada complemento con su motivo, y repetir una combinación produce exactamente el mismo resultado.
- **SC-004**: El 100 % de los mensajes de WhatsApp generados contiene los once elementos de FR-022, con todos los caracteres especiales intactos, y coincide exactamente con el texto de "Copiar mensaje".
- **SC-005**: Abrir y cerrar la invitación no cambia la altura del documento ni la posición de lectura (0 px de desplazamiento) y no hay desplazamiento horizontal entre 320 y 1440 px.
- **SC-006**: Todo el flujo (invitación, cinco preguntas, resultado, WhatsApp y copiar) se completa solo con teclado, y la revisión automática de accesibilidad no muestra infracciones nuevas respecto a la línea base.
- **SC-007**: En un recorrido completo se registran exactamente los eventos esperados, una vez cada uno por acción, y ninguno contiene datos personales, respuestas individuales ni complementos.
- **SC-008**: Desde la publicación, el responsable puede calcular con la analítica la conversión de cada paso del embudo (invitación → inicio → finalización → clic en WhatsApp).
- **SC-009**: Las verificaciones existentes del sitio (navegación, menú móvil, formulario de contacto, rutas secundarias) siguen pasando sin cambios.
- **SC-010**: En el 100 % de las pantallas móviles probadas (matriz de anchos de 320 a 767 px, alturas bajas y altas, vertical y horizontal, y al menos un iPhone y un Android reales), la tarjeta o bien cumple las cinco condiciones de FR-007b (25 %, controles de 44 px, áreas seguras, sin tapar navegación ni WhatsApp, sin bloquear el desplazamiento), o bien no se muestra; nunca se muestra incumpliendo alguna.
- **SC-011**: En el 100 % de las combinaciones de respuestas, ni el resultado ni el mensaje de WhatsApp contienen precios, rangos, valores mínimos, costos o presupuestos, y ningún resultado muestra plazo mientras no exista una correspondencia servicio–plazo aprobada.

## Assumptions

- El tipo de negocio reutiliza las nueve opciones actuales del sitio.
- "Móvil" significa menos de 768 px de ancho, el mismo punto de corte que ya usa el sitio para su menú; desde 768 px (tabletas y escritorio) la invitación es una ventana centrada.
- **Plazos publicados — sin correspondencia aprobada (decisión del responsable, 2026-11-07)**: el sitio publica tres plazos, pero ninguno está asociado a un servicio concreto del catálogo y el responsable no ha aprobado ninguna correspondencia:

  | Dónde se publica          | Plazo publicado             | ¿A qué solución se aplica?   |
  | ------------------------- | --------------------------- | ---------------------------- |
  | Precios, plan Emprendedor | Entrega en 2-3 semanas      | Sin correspondencia aprobada |
  | Precios, plan Crecimiento | Entrega en 2-4 semanas      | Sin correspondencia aprobada |
  | Sección "Cómo trabajamos" | "Tu web lista en 4 semanas" | Sin correspondencia aprobada |

  Por FR-018b, ningún resultado muestra plazo. Añadir plazos exige una aprobación expresa del responsable y una actualización de esta especificación.

- **Servicios fuera del diagnóstico**: Sistemas administrativos, Paneles de gestión, Plataformas web personalizadas, Portales para clientes, Soluciones con inteligencia artificial y Aplicaciones web escalables están en el catálogo, pero no se recomiendan de forma automática: su alcance depende de cada negocio y recomendarlos desde cinco respuestas sería convertir una necesidad en una propuesta más amplia (FR-015c). Se tratan en la asesoría.
- **Reservas y citas e Integraciones con APIs (decisión del responsable, 2026-11-07)**: solo publican una descripción corta, sin página propia ni lista de beneficios. Según FR-016a y FR-016b, el resultado se limita a esa descripción y no les atribuye funcionalidades ni beneficios propios (por ejemplo, recordatorios, pagos anticipados o sincronización de calendarios). Ampliarlo exige publicar antes ese contenido en el catálogo.
- **Servicios no publicados**: "Optimización o rediseño de una web existente" y "Catálogo digital" como servicio independiente no figuran en el catálogo. Para las situaciones S3 y S4 se recomiendan servicios publicados (Landing pages o Sitios web corporativos) y la explicación indica que se construye una web nueva que reemplaza a la actual; nunca que se optimiza o rediseña la existente. El catálogo solo aparece como complemento, porque está publicado como componente del plan Emprendedor.
- La "sesión" es la sesión del navegador: termina al cerrar la pestaña o la ventana.
- Las respuestas no se guardan ni se envían a ningún servidor; solo viajan en el mensaje que el visitante decide enviar por WhatsApp.
- No existe hoy gestión de consentimiento de cookies; la analítica sigue funcionando como el resto del sitio. Añadir un banner de consentimiento queda fuera del alcance.
- El identificador de la solución principal no se considera dato personal y puede enviarse a la analítica (FR-026); los complementos no se envían.
- El número comercial es el ya configurado en el sitio como número principal de WhatsApp.
- La pregunta de funcionalidades deseadas se retira definitivamente (confirmado por el responsable).
- **Significado de `generate_lead`**: hoy se emite en dos lugares con significados distintos: el formulario de contacto la envía tras confirmarse el envío (lead recibido, `method: "contact_form"`) y el diagnóstico al hacer clic en WhatsApp (intención, `method: "whatsapp"`). Se conserva sin cambios (D2); los informes que cuenten leads recibidos deben filtrar `method: "contact_form"`. **Pendiente de verificar por el responsable** (sin acceso desde este entorno): si `generate_lead` está marcado como evento clave en GA4, los clics de WhatsApp ya cuentan hoy como conversiones.
- **Áreas seguras**: el sitio declara hoy `viewport` sin `viewport-fit=cover`, así que el navegador mantiene el contenido dentro del área segura y las variables de área segura valen 0; la tarjeta se diseña para respetarlas igualmente. Como no se cambia la configuración global del viewport, el comportamiento se comprueba en dispositivos reales (SC-010).
- Por el Principio IV de la constitución, el cambio es de riesgo alto (toca la captación de leads y la analítica): el plan debe incluir reversión escrita y supervisión tras el despliegue.
- La política de privacidad no requiere cambios por esta funcionalidad, porque no añade orígenes externos ni datos personales; su actualización pendiente se gestiona aparte.
