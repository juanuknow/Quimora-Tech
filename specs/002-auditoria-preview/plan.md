# Plan y verificación

Riesgo medio: sección y layout nuevos. Reversión: retirar el componente de `index.tsx` y eliminar su archivo. Señal de fallo si algún día se publica: caída visible de rendimiento, solapamiento móvil o contactos que confundan la auditoría con el diagnóstico gratuito; verificar página y enlace tras despliegue.

Constitution Check: conserva arquitectura, tokens, CTA y formulario existente. No añade ruta, origen externo, dependencia, pago, dato de cliente ni afirmación de caso real. No requiere cambio de sitemap o privacidad para esta vista local.

Implementar componente de sección, insertarlo después del diagnóstico gratuito, ejecutar build y revisar la vista local. El responsable pidió el commit local el 9 de noviembre de 2026. No hacer push ni despliegue.
