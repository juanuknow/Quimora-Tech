# Contrato: mensaje de WhatsApp

Lo produce `buildWhatsAppMessage` y lo consumen el enlace "Continuar por WhatsApp" (`whatsappHref`, número principal `WHATSAPP_NUMBER`) y el botón "Copiar mensaje". Ambos usan exactamente el mismo texto (FR-024).

## Plantilla

Las líneas entre `[ ]` se sustituyen; los saltos de línea forman parte del contrato. Los bloques marcados "solo si" se omiten enteros cuando no aplican.

```text
Hola, Quimora Tech. Acabo de completar el Diagnóstico Digital Gratuito en su página web.

Tipo de negocio: [etiqueta de la pregunta 1].
Situación digital actual: [etiqueta de la pregunta 2].
Principal necesidad: [etiqueta de la pregunta 3].      ← con varias: «Necesidades, en orden: a; b; c.»
Objetivo: [etiqueta de la pregunta 4].                 ← con varias: «Objetivos: a; b; c.»
Prioridad: [etiqueta de la pregunta 5].

Solución recomendada: [título del servicio principal].
Beneficios:                         ← solo si el servicio publica beneficios
- [beneficio publicado 1]
- [beneficio publicado N]
Complementos:
- [título del complemento]: [motivo].   ← uno por complemento (0–3); en R-KN, sin motivo
- ninguno adicional                      ← solo si no hay complementos
Por qué: [shortExplanation].
Próximo paso: [próximo paso de R-N].

Me gustaría recibir asesoría personalizada para implementar esta solución en mi negocio. ¡Gracias!
```

Corresponde a los 13 elementos de FR-022: (1) saludo y (2) mención del diagnóstico en la primera línea; (3)–(7) las cinco respuestas; (8) solución; (9) beneficios; (10) complementos con su motivo; (11) explicación breve; (12) próximo paso; (13) solicitud de asesoría.

## Reglas

- Las etiquetas, títulos, beneficios y motivos son los mismos que ve el visitante en pantalla, sin modificar.
- Los beneficios son los publicados del servicio principal (`benefits` del catálogo). Si el servicio no los publica, el bloque "Beneficios" se omite: nunca se inventan (FR-016a, FR-016b).
- Los complementos de tipo componente de plan (R-K2) se nombran "Catálogo de productos o servicios con enlace directo a WhatsApp".
- **Longitud (FR-022b)**: ni el texto ni el enlace codificado superan los 2 000 caracteres. Si el enlace los superase, se limita la lista de beneficios a los tres primeros publicados y, si aún no cabe, se retira; nada más se recorta. El motivo de R-KN no se escribe porque repetiría la línea de necesidades.
- El próximo paso no contiene cifras: dice que la inversión se define con el asesor (FR-018a).
- Prohibido: precios, rangos, presupuestos, plazos, datos personales y cualquier texto que no salga de las respuestas o de la recomendación (FR-022a).
- El mensaje nunca se envía solo: el enlace abre WhatsApp con el texto prellenado y el visitante decide (FR-021).

## Codificación

`whatsappHref` aplica `encodeURIComponent`: tildes, eñes, `¿`, `¡` y saltos de línea (`%0A`) quedan codificados. La verificación decodifica el `href` y lo compara con el texto original (SC-004).
