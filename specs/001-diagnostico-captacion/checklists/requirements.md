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
- **Iteración 5 (2026-11-07), decisiones D1–D4 del plan técnico**:
  - D1: FR-003 (escritorio, contenido completo), nuevos FR-003a (tarjeta móvil reducida) y FR-003b (párrafo de apoyo sobre la pregunta 1, sin pasos extra); FR-007b con cinco condiciones simultáneas y sin excepciones (25 %, 44 px, áreas seguras, sin tapar navegación ni WhatsApp, sin bloqueo); nuevo FR-007c (supresión si no se cumplen, sin estado ni evento; ocultación al girar sin contar como descarte). Actualizados US3 (relato, prueba independiente, escenarios 3, 10 y 11), casos límite, SC-001 y SC-010 (matriz de pantallas y dispositivos reales).
  - D2: FR-025 conserva `generate_lead`; nuevo FR-025a (un clic, un evento de cada; intención, nunca envío ni lead recibido). Supuesto nuevo sobre el doble significado actual de `generate_lead` y verificación pendiente en GA4.
  - D3: FR-013a fija la etiqueta «Comenzar diagnóstico gratuito» en la sección.
  - D4: diferida; alternativas documentadas en el plan.
  - Incoherencia previa corregida: FR-026 no permitía el parámetro `format` de `diagnosis_popup_view` que usaba el contrato de analítica; ahora lo incluye.
  - Revalidación: 47 requisitos, 0 marcadores, todas las referencias FR/SC de los documentos de planificación existen en la spec, parámetros de GA4 coherentes entre spec y contrato; matriz de 6 300 combinaciones sin cambios en sus reglas y con 0 errores.
- **Iteración 6 (2026-11-07), cierre de la documentación antes de `/speckit-tasks`**:
  - Matriz de trazabilidad en `quickstart.md` §8: los 47 requisitos y los 11 criterios de éxito tienen al menos una verificación; todas las verificaciones citadas existen.
  - Escenarios nuevos E25–E32: zoom y texto ampliado, tecnologías de apoyo en la tarjeta, orígenes de red, elementos retirados, revisión estática, prueba cronometrada con una persona real (SC-002), auditoría de GA4 en solo lectura antes de producción y comprobación del embudo tras el despliegue (SC-008).
  - Garantía "Sin escalado" (FR-015c) añadida al contrato del motor y comprobada en las 6 300 combinaciones: 0 infracciones.
  - `plan.md`: condiciones del responsable para la lista de tareas (analítica, invitación móvil, restricciones de implementación e integración).
  - Revalidación: 0 marcadores, 0 referencias a requisitos inexistentes, sin restos de decisiones sustituidas, matriz con 0 errores.
- **Iteración 7 (2026-11-07), correcciones de la auditoría `/speckit-analyze`** (3 críticos, 4 altos y 15 adicionales):
  - Spec: FR-001 (no mostrar fuera de los 2–3 s), FR-007/FR-007a (ventana solo con ≥ 768 × 640 px; tarjeta en el resto), FR-022 (13 elementos: añade beneficios, motivos de los complementos y próximo paso), nuevos FR-022b (máximo 2 000 caracteres y reducción determinista) y FR-025b (publicación bloqueada si `generate_lead` es evento clave hasta decidir); US2 y US3, SC-004 y SC-010 alineados. Total: 49 requisitos funcionales y 11 criterios.
  - Plan: MVP publicable = Fase 1 + Fase 2 + US1 + US2; 7 commits alineados con tasks; V5 y V8 en cada propuesta de commit; retirada rápida de la invitación; bloqueo de publicación por GA4.
  - Contratos y modelo: `shortExplanation`, `reduced`, opciones del motor sin iconos (`UiAnswerOption` en la interfaz), acciones de la invitación, `id="diagnosis-dialog"`, alternativas de GA4 y diferencia entre `diagnosis_complete` y `diagnosis_result_view`.
  - Quickstart: matriz E20 de 17 pantallas (añade 768 × 1024, 1024 × 768 y 1024 × 600), E33 (carga tardía) y E34 (`/#diagnostico` desde `/para/*`); 34 escenarios.
  - Tasks: 52 tareas; `generate_lead` en la tarea del botón (T022); etiquetas de CTA en su tarea (T017, T022); revisión de textos (T011); migración de las siete pruebas del radiogroup (T019); `diagnosis_popup_view` en US3 (T031); tareas [P] sin archivos compartidos.
  - Nuevo `validation.md` con las evidencias de finalización (V5/V8 por commit, aprobación de textos, auditoría de GA4, dispositivos reales, matriz de pantallas, accesibilidad, prueba con una persona, pruebas migradas, capturas y rendimiento, supervisión).
  - Revalidación: 0 marcadores; 0 referencias a requisitos inexistentes; los 49 requisitos y 11 criterios tienen fila en la matriz y tarea; los 34 escenarios tienen tarea; 52 tareas con formato correcto y numeración correlativa; 12 tareas [P] sin conflictos; commits idénticos en plan y tasks; matriz de 6 300 combinaciones con 0 errores y 0 infracciones de FR-015c.
- La descripción original en "Input" se conserva tal como se recibió; las decisiones posteriores, registradas en "Clarifications", prevalecen sobre ella (incluida la mención a rangos de inversión).
- Las referencias a `CLAUDE.md` (FR-030) y al "catálogo de servicios publicado" son fuentes documentales del proyecto, no detalles de implementación.
