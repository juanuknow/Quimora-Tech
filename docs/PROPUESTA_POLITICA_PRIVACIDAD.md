# Propuesta de actualización de la Política de Privacidad

> **Estado: BORRADOR PARA REVISIÓN. No está aplicado.** `src/routes/privacidad.tsx` no se ha
> modificado. Este documento no es asesoría legal: antes de publicarlo debe revisarlo quien
> responda por el tratamiento de datos (y, idealmente, un abogado con experiencia en la Ley 1581
> de 2012). Los puntos marcados **[CONFIRMAR]** dependen de configuraciones que no están en el
> repositorio y que solo el titular del sitio puede verificar.

Origen: hallazgo PRIV-01 de la auditoría técnica (6-nov-2026).

---

## 1. Qué no coincide hoy entre la política y el sitio

| Texto vigente | Realidad verificada en el código |
|---|---|
| §2: "Recolectamos **únicamente** los datos que nos proporcionas de forma voluntaria…" | Google Analytics 4 (`G-42YGEBWHMT`, [`__root.tsx`](../src/routes/__root.tsx)) se carga en **todas** las páginas y recoge datos de navegación de forma automática, sin que el visitante envíe nada. |
| No menciona cookies. | GA4 instala cookies propias (primera parte). Ver §2 de este documento. |
| §3: "No … compartimos tus datos con terceros para fines publicitarios." | Los datos de analítica se envían a Google. Si la propiedad tiene activadas las **señales de Google** o la compartición de datos, esa frase podría no ser cierta. **[CONFIRMAR]** |
| §4: habla de "proveedores" de forma genérica. | Se pueden nombrar y describir (ver §2). |
| No menciona WhatsApp. | Hay enlaces `wa.me` en todo el sitio; el mensaje se redacta en WhatsApp, un servicio de Meta, con las condiciones de este. |

## 2. Inventario de tratamientos (lo que hace el sitio hoy)

| Tercero / mecanismo | Qué recibe | Cuándo | Evidencia |
|---|---|---|---|
| **Google Analytics 4** (Google) | Páginas vistas, dispositivo/navegador, ubicación aproximada, identificador de cookie y eventos (`generate_lead`, `contact`). Google recibe la IP; GA4 no la almacena. **[CONFIRMAR]** | Al cargar cualquier página, sin interacción previa | [`site.ts`](../src/lib/site.ts) `GA_MEASUREMENT_ID`, `trackEvent` |
| Cookies de GA4 (`_ga`, `_ga_<ID>`) | Identificador aleatorio de navegador | Al cargar `gtag.js` | Documentación de Google. **[CONFIRMAR]** en la propiedad |
| **Formspree** | Nombre, correo, teléfono (opcional) y mensaje | Solo al pulsar "Enviar consulta" | [`Contact.tsx`](../src/components/Contact.tsx), `FORMSPREE_ENDPOINT` |
| **Correo de recepción** (Gmail) | Lo que reenvía Formspree | Tras cada envío | `CONTACT_EMAIL` en `site.ts` |
| **WhatsApp / Meta** | Número y mensaje que la persona decide enviar; en el Diagnóstico, un resumen de sus respuestas pregenerado | Solo si la persona pulsa un enlace de WhatsApp y envía el mensaje | `whatsappHref` en `site.ts`; [`DigitalDiagnosis.tsx`](../src/components/DigitalDiagnosis.tsx) |
| **Cloudflare** (alojamiento y red) | Dirección IP y metadatos técnicos de cada solicitud; registros del Worker (`observability` activa y persistente en [`wrangler.jsonc`](../wrangler.jsonc)) | En cada visita | `wrangler.jsonc` |
| Almacenamiento de sesión del navegador | Posición de scroll (clave técnica `tsr-scroll-restoration-v1_3`); no es un dato personal | Durante la sesión | Script de restauración de TanStack Router |
| Diagnóstico Digital | Las respuestas **no salen del navegador** salvo que la persona las envíe por WhatsApp; las del último diagnóstico terminado se conservan en el almacenamiento de sesión para poder volver a verlo | Hasta cerrar la pestaña | `diagnosis-result.ts`; no hay `fetch`, `localStorage` ni cookies |

No hay fuentes de Google ni otros recursos de terceros: las tipografías están autoalojadas.

## 3. Decisiones que debe tomar el titular

1. **Aviso de cookies / consentimiento.** Hoy GA4 se activa sin pedir nada. Opciones:
   - **(a)** Mantener el comportamiento actual y solo informar en la política (la opción mínima).
   - **(b)** Banner de consentimiento con *Google Consent Mode v2*: GA solo mide tras aceptar (reduce datos, afecta KPIs).
   - **(c)** Cargar GA solo tras interacción o consentimiento.
   Ninguna se implementa en esta fase: las (b) y (c) cambian la analítica y están fuera del alcance autorizado. **[Decisión del titular y de su asesor legal]**
2. **Configuración de la propiedad GA4** **[CONFIRMAR]**: señales de Google (sí/no), compartición de datos con Google, retención de datos de eventos (2 o 14 meses), si se vincula a Google Ads.
3. **Formspree** **[CONFIRMAR]**: plan contratado, país de almacenamiento y tiempo de retención de los envíos.
4. **Buzón de recepción** **[CONFIRMAR]**: hoy es una cuenta Gmail personal/operativa; conviene reflejar que es el correo donde se reciben los mensajes.
5. **Transferencia internacional**: Google, Formspree, Cloudflare y Meta pueden tratar datos fuera de Colombia. Debe verificarse con asesoría legal si la redacción actual ("estándares adecuados de seguridad") es suficiente para la Ley 1581.

## 4. Texto propuesto

Reemplazaría o ampliaría las secciones 2, 3 y 4 vigentes y añadiría una sección de cookies. Las secciones 1 y 5 a 10 se conservan, con la fecha de actualización modificada.

### 2. Datos que recolectamos

Recolectamos datos de dos maneras:

**a) Datos que nos entregas voluntariamente**, a través de nuestro formulario de contacto, WhatsApp o correo electrónico:

- Nombre completo.
- Correo electrónico.
- Número de teléfono (opcional).
- El mensaje o la información sobre tu proyecto que decidas compartir.

**b) Datos de navegación que se recogen automáticamente** al visitar el sitio, mediante Google Analytics 4: páginas visitadas, tipo de dispositivo y navegador, ubicación aproximada, origen de la visita, interacciones con botones y formularios, y un identificador aleatorio almacenado en una cookie. Estos datos no nos permiten identificarte por tu nombre, y los usamos de forma agregada.

No recolectamos datos sensibles ni información de menores de edad de forma intencional.

### 3. Finalidad del tratamiento

Usamos los datos que nos entregas para:

- Responder a tu consulta y ponernos en contacto contigo.
- Elaborar una propuesta o cotización de nuestros servicios.
- Dar seguimiento comercial a la solicitud que iniciaste.

Usamos los datos de navegación para entender cómo se usa el sitio y mejorarlo (por ejemplo, qué secciones se consultan más y si el formulario funciona correctamente).

No vendemos ni alquilamos tus datos. **[CONFIRMAR antes de afirmar: "No los compartimos con terceros para fines publicitarios", según la configuración de GA4.]**

### 4. Terceros que intervienen en el tratamiento

Para operar el sitio nos apoyamos en proveedores que actúan como encargados del tratamiento y solo procesan los datos para prestarnos su servicio:

| Proveedor | Para qué lo usamos | Datos que recibe |
|---|---|---|
| Google (Google Analytics 4) | Medir el uso del sitio | Datos de navegación y cookie de analítica |
| Formspree | Recibir los mensajes del formulario de contacto | Los datos que escribes en el formulario, solo cuando lo envías |
| Cloudflare | Alojar el sitio y entregarlo de forma segura | Dirección IP y datos técnicos de cada solicitud |
| WhatsApp (Meta) | Atender tu consulta por chat, **solo si eliges escribirnos por ahí** | El número y el mensaje que decidas enviar |

Algunos de estos proveedores pueden almacenar o tratar información en servidores ubicados fuera de Colombia. **[CONFIRMAR con asesoría legal la fórmula exigida para transferencias internacionales.]**

### 4-bis. Cookies y tecnologías similares

Nuestro sitio **no instala cookies propias**. Google Analytics instala las siguientes cookies de analítica en tu navegador:

| Cookie | Finalidad | Duración |
|---|---|---|
| `_ga` | Distinguir visitantes de forma anónima | Hasta 2 años **[CONFIRMAR]** |
| `_ga_<identificador>` | Mantener el estado de la sesión de medición | Hasta 2 años **[CONFIRMAR]** |

Además, el navegador guarda temporalmente, durante la sesión, la posición de desplazamiento de la página para que puedas volver donde estabas. No contiene datos personales.

Puedes **bloquear o eliminar estas cookies** desde la configuración de tu navegador, o instalar el complemento de inhabilitación de Google Analytics ([tools.google.com/dlpage/gaoptout](https://tools.google.com/dlpage/gaoptout)). El sitio funciona con normalidad sin ellas.

### 7. Conservación de los datos (añadir)

Los datos de analítica se conservan en Google Analytics durante **[2 / 14 meses — CONFIRMAR]**. Los mensajes del formulario se conservan mientras sean necesarios para atender tu solicitud y gestionar la relación comercial.

---

## 5. Pasos para aplicarlo (cuando se apruebe)

1. Resolver los puntos **[CONFIRMAR]** de la sección 3.
2. Actualizar `src/routes/privacidad.tsx` (secciones 2, 3, 4, 4-bis y 7) y su `updated="…"`.
3. Actualizar `lastmod` de `/privacidad` en `public/sitemap.xml`.
4. Revisar el texto del formulario en [`Contact.tsx`](../src/components/Contact.tsx) ("Nunca compartimos tus datos"): hoy es absoluto y, con proveedores, conviene matizarlo.
5. Si se elige un banner de consentimiento, tratarlo como una fase aparte con su propio plan de pruebas de analítica.
