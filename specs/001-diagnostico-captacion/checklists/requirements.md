# Specification Quality Checklist: Diagnóstico Digital Gratuito como herramienta de captación

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-11-06
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- **Iteración 1**: FR-031 tenía una negación mal construida ("no MUST"); corregida a "MUST NOT". Quedaron 2 marcadores (FR-007 y FR-018).
- **Iteración 2**: resueltos FR-007 (ventana desde 768 px, tarjeta inferior en móvil) y FR-018. Corregidas contradicciones sobre el foco, la retención de foco y el bloqueo del desplazamiento con la tarjeta móvil.
- **Iteración 3 (2026-11-06)**: decisiones comerciales definitivas del responsable:
  - **Recomendación integral**: FR-014 a FR-015c, FR-016 y FR-016a, y nueva sección "Reglas de recomendación" (R-P, R-K, R-C, R-N).
  - **Sin precios**: FR-018 prohíbe precios en todas las pantallas; FR-018a remite la inversión al asesor; FR-018b limita los plazos a publicados y confirmados; FR-020 retira toda estimación de inversión; SC-011 reescrito. Se elimina la entidad "Plan publicado" y se añade "Plazo publicado".
  - **WhatsApp completo**: FR-022 (11 elementos en orden), FR-022a (sin precios ni datos personales), FR-024 (copiar el mismo texto); SC-004 actualizado.
  - **Analítica**: FR-026 envía solo el identificador de la solución principal, nunca respuestas ni complementos; SC-007 actualizado.
- **Contradicciones eliminadas en la iteración 3**:
  - La decisión anterior de mostrar los precios de Precios queda sustituida y registrada en "Clarifications".
  - La necesidad "Ordenar ventas, inventario o caja" admitía dos servicios distintos y obligaba a añadir un complemento sin saber si se necesitaba. Se divide en N4 (inventario) y N5 (ventas, caja y cotizaciones).
  - El tipo de negocio ya no cambia la solución (evita encarecer la propuesta por el tipo de negocio); solo ajusta la redacción (R-C5).
- **Validación de la matriz**: se recorrieron las 6 300 combinaciones con un script de comprobación fuera del repositorio. Resultado: 0 errores; la principal siempre es del catálogo; como máximo 2 complementos, publicados y sin repetir; resultado determinista; sin precios. Distribución: 3 564 combinaciones sin complementos, 2 124 con uno y 612 con dos. Ninguna combinación activa más de dos reglas R-K (R-K2 y R-K3 se excluyen entre sí, igual que R-K1 y R-K4), así que R-C4 queda como salvaguarda.
- **Pendiente de confirmación (no bloquea el plan)**:
  - Ninguna correspondencia servicio–plazo aprobada: no se muestran plazos (decisión del 2026-11-07).
  - "Reservas y citas" e "Integraciones con APIs" solo tienen una descripción corta, sin lista de beneficios.
  - "Optimización de una web existente" y "Catálogo digital" como servicio independiente no están publicados.
- **Iteración 4 (2026-11-07), aprobación condicionada del responsable**:
  - Plazos: FR-018b pasa a "no mostrar plazos mientras no exista una correspondencia servicio–plazo aprobada"; hoy no hay ninguna, así que ningún resultado muestra plazo. Ajustados SC-011, el caso límite, la entidad "Plazo publicado" y la tabla de Assumptions.
  - Servicios: nuevo FR-016b (todo texto del resultado debe rastrearse hasta el catálogo o un plan publicado) y tabla "Respaldo de cada recomendación", con 3 puntos señalados para revisión.
  - Textos sin respaldo corregidos: R-C2 decía "mejorar el actual" (optimizar una tienda existente no está publicado) y el supuesto de S3/S4 decía "renuevan la web actual" (rediseñar no está publicado); ahora hablan de una tienda propia y de una web nueva que reemplaza a la actual.
  - Precios, modelo integral y contenido de WhatsApp: sin cambios, se confirman.
  - Revalidación: 0 marcadores; matriz de 6 300 combinaciones con 0 errores (las reglas no cambiaron); ningún requisito afirma mostrar precios ni plazos.
- La descripción original en "Input" se conserva tal como se recibió; las decisiones posteriores, registradas en "Clarifications", prevalecen sobre ella (incluida la mención a rangos de inversión).
- Las referencias a `CLAUDE.md` (FR-030) y al "catálogo de servicios publicado" son fuentes documentales del proyecto, no detalles de implementación.
