# Contrato: mensaje de WhatsApp

Lo produce `buildWhatsAppMessage` y lo consumen el enlace "Continuar por WhatsApp" (`whatsappHref`, número principal `WHATSAPP_NUMBER`) y el botón "Copiar mensaje". Ambos usan exactamente el mismo texto (FR-024).

## Plantilla

Las líneas entre `[ ]` se sustituyen; los saltos de línea forman parte del contrato.

```text
Hola, Quimora Tech. Acabo de completar el Diagnóstico Digital Gratuito en su página web.

Tipo de negocio: [etiqueta de la pregunta 1].
Situación digital actual: [etiqueta de la pregunta 2].
Principal necesidad: [etiqueta de la pregunta 3].
Objetivo: [etiqueta de la pregunta 4].
Prioridad: [etiqueta de la pregunta 5].

Solución recomendada: [título del servicio principal].
Complementos: [títulos de los complementos, separados por " y "] | ninguno adicional.
Por qué: [explicación breve de la recomendación].

Me gustaría recibir asesoría personalizada para implementar esta solución en mi negocio. ¡Gracias!
```

Corresponde a los 11 elementos de FR-022: (1) saludo y (2) mención del diagnóstico en la primera línea; (3)–(7) las cinco respuestas; (8) solución; (9) complementos; (10) explicación; (11) solicitud de asesoría.

## Reglas

- Las etiquetas son las mismas que ve el visitante en pantalla, sin modificar.
- Los complementos de tipo componente de plan (R-K2) se nombran "Catálogo de productos o servicios con enlace directo a WhatsApp".
- La explicación del mensaje es la versión breve (una frase). Si la URL codificada llegara a 2 000 caracteres, se acorta la explicación, nunca las respuestas.
- Prohibido: precios, rangos, presupuestos, plazos, datos personales y cualquier texto que no salga de las respuestas o de la recomendación (FR-022a).
- El mensaje nunca se envía solo: el enlace abre WhatsApp con el texto prellenado y el visitante decide (FR-021).

## Codificación

`whatsappHref` aplica `encodeURIComponent`: tildes, eñes, `¿`, `¡` y saltos de línea (`%0A`) quedan codificados. La verificación decodifica el `href` y lo compara con el texto original (SC-004).
