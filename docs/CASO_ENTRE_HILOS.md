# Entre Hilos — ficha pública del proyecto

**Tipo:** aplicación de escritorio Windows para la operación de un local de arreglos, lavandería y tintorería en Cali.

**Estado al 9 de noviembre de 2026:** el responsable informó que desplegó la versión 0.5.6 para que el personal del local la pruebe durante esta semana. El despliegue definitivo de la versión ajustada está previsto para el sábado 14 de noviembre. La validación en el local está en curso; aún no hay métricas de impacto comercial.

## Necesidad y solución

El local registra pedidos, prendas, trabajos, abonos y entregas. La aplicación organiza esas tareas en un solo equipo Windows y funciona sin internet. Distingue cada prenda, el avance del taller, los pagos y la entrega; incluye caja, historial y respaldos. Emite comprobantes internos, no factura electrónica.

## Evidencia visual

Las cuatro imágenes `public/images/entre-hilos-*.png` se tomaron del checkout disponible de la versión 0.5.4 en modo demostración con personas y pedidos ficticios. Muestran inicio, búsqueda de pedidos, detalle y caja; no son capturas de la versión 0.5.6 que se está probando en el local. El modo demo usa una carpeta de datos separada de la operación real. Las fotografías originales del cliente permanecen privadas y no se incorporaron al sitio.

El responsable del proyecto confirmó en la conversación que Entre Hilos otorgó permiso escrito para mostrar nombre, logo y capturas. Conservar esa autorización fuera del repositorio público.

## Límites de las afirmaciones

- La versión 0.5.6 se está probando en el local; el despliegue definitivo aún no se ha completado.
- La validación con impresora, escáner y caja física sigue en curso.
- No hay métricas verificadas de ahorro, ventas ni adopción.
- La facturación electrónica no forma parte de esta versión.

Fuentes internas de verificación: actualización del responsable del 9 de noviembre de 2026 sobre el despliegue de prueba de la versión 0.5.6; checkout privado disponible de Entre Hilos, `app/package.json` (versión 0.5.4), `app/src/main/demo.ts`, `app/README.md`, `docs/ESTADO_IMPLEMENTACION.md` y `docs/AUDITORIA_FINAL_0.5.4.md`.
