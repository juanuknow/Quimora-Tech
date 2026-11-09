# Informe de integración: funcionalidad 001 (T050)

**Fecha**: 2026-11-07 · **Rama**: `feat/diagnostico-captacion` (local, no publicada) · **Estrategia preferida**: alternativa A del plan (Spec Kit primero, por separado).

> **Este informe no autoriza nada.** Ningún commit, merge, push ni despliegue se ejecuta sin una autorización independiente para cada uno (Principio I).

## 1. Estado actual de Git

- `main` = `origin/main` = `feca905` (producción).
- La rama lleva 5 commits sobre `main`:

  | Commit    | Contenido                                                                | Qué afecta                                   |
  | --------- | ------------------------------------------------------------------------ | -------------------------------------------- |
  | `759dacc` | Spec Kit 1.3.1 (28 archivos en `.claude/skills/speckit-*` y `.specify/`) | Configuración del agente; no cambia el sitio |
  | `183f9c4` | `.prettierignore`                                                        | Formato; no cambia el sitio                  |
  | `b036cee` | Constitución v1.0.0 (`.specify/memory/constitution.md`)                  | Gobierno; no cambia el sitio                 |
  | `df29bf8` | Spec de la funcionalidad 001                                             | Documentación                                |
  | `ce793c2` | Plan técnico de la funcionalidad 001                                     | Documentación                                |

- **La implementación está sin commit** en el árbol de trabajo (ningún commit estaba autorizado). Código: 8 archivos modificados y 5 nuevos (+141 / −1 117 líneas en los modificados). Documentación de la spec: 10 archivos modificados y 6 nuevos.

## 2. Commits propuestos para la implementación (pendientes de autorización)

| #   | Commit                                                             | Archivos                                                                                                                                                                                                                                                                                       | ¿Integrable solo?                                         |
| --- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | `refactor(data): add stable service ids and extract pricing plans` | `src/lib/services-data.ts`, `src/lib/pricing-data.ts`, `src/components/Pricing.tsx`                                                                                                                                                                                                            | Sí (sin cambio visible, verificado en T008)               |
| 2   | `feat(diagnosis): add deterministic recommendation engine`         | `src/lib/diagnosis-engine.ts`                                                                                                                                                                                                                                                                  | No: parte del MVP                                         |
| 3   | `feat(diagnosis): shared diagnosis dialog and section`             | `src/lib/diagnosis.ts`, `src/components/DiagnosisDialog.tsx` (partes de US1), `src/components/DigitalDiagnosis.tsx`, `src/components/DiagnosisShortcuts.tsx` (llamada), `src/routes/index.tsx` (montaje de la ventana y `tabIndex` de `<main>`), `CLAUDE.md` («Comenzar diagnóstico gratuito») | No: sin el 4 el diagnóstico perdería su salida a WhatsApp |
| 4   | `feat(diagnosis): whatsapp handoff with copy fallback`             | `DiagnosisDialog.tsx` (WhatsApp, copiar y `generate_lead`), `CLAUDE.md` («Continuar por WhatsApp», «Copiar mensaje»)                                                                                                                                                                           | Solo junto con 2 y 3 (**MVP**)                            |
| 5   | `feat(diagnosis): home invitation with mobile suppression`         | `src/lib/diagnosis-invite.ts`, `src/components/DiagnosisInvite.tsx`, `src/routes/index.tsx` (montaje de la invitación), `DiagnosisDialog.tsx` (`markInvite("completed")`)                                                                                                                      | Sí, sobre el MVP                                          |
| 6   | `feat(analytics): diagnosis funnel events without personal data`   | `DiagnosisDialog.tsx` (eventos `diagnosis_*`), `DiagnosisShortcuts.tsx` (retirada de `diagnosis_shortcut`)                                                                                                                                                                                     | Sí, sobre el MVP                                          |
| 7   | `docs: document diagnosis feature`                                 | `docs/ESTRUCTURA.md` y la documentación de `specs/001-diagnostico-captacion/`                                                                                                                                                                                                                  | Sí                                                        |

**Decisión necesaria**: `DiagnosisDialog.tsx`, `diagnosis-engine.ts`, `index.tsx` y `DiagnosisShortcuts.tsx` contienen cambios de varias historias. Para respetar los commits atómicos del plan hay que preparar en staging solo partes de esos archivos (con parches generados sin modo interactivo y revisados uno a uno). Alternativa más simple: fusionar los commits 2–6 en dos (MVP e invitación + analítica), perdiendo granularidad de reversión. Recomendación: mantener los 7 commits.

## 3. Qué se despliega y qué queda público

- **Se despliega** (push a `main` → Cloudflare Workers Builds): el diagnóstico nuevo, la invitación y los eventos de analítica. Sin cambios en cabeceras, CSP, `wrangler.jsonc`, dependencias ni rutas.
- **Queda público** (repositorio público): Spec Kit, la constitución y `specs/001-diagnostico-captacion/`, incluidas las líneas base y `validation.md`. Se revisaron con V8: sin secretos. Contienen rutas locales de prueba (`C:\tmp\pwenv\…`) y puertos locales, que no son sensibles.

## 4. Requisitos previos a la publicación (bloqueantes)

| Requisito                                                                                                    | Estado (2026-11-07)                                                                                                          |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Aprobación de los textos comerciales (`validation.md` §2)                                                    | **Pendiente**                                                                                                                |
| Auditoría de GA4 en solo lectura y decisión si `generate_lead` es evento clave (`validation.md` §3, FR-025b) | **Pendiente**                                                                                                                |
| Dispositivos reales (`validation.md` §4)                                                                     | Pendiente; recomendable antes de producción                                                                                  |
| NVDA (`validation.md` §6) y prueba con una persona (`validation.md` §7)                                      | Pendientes                                                                                                                   |
| Versión de Cloudflare vigente para revertir                                                                  | Última conocida: `4cde89d3-1dfa-43b4-8513-9956b7a6647e` (commit `feca905`); **volver a comprobarla** justo antes de integrar |

## 5. Procedimiento (alternativa A)

1. **Spec Kit en `main`** (autorización 1): fast-forward o merge de los commits `759dacc`, `183f9c4` y `b036cee`; push; V9. No cambia el sitio.
2. **Commits de la implementación** en la rama (autorizaciones 2–8): uno por fila de la tabla del §2, cada uno con V5 y V8 y su diff presentado.
3. **Integración del MVP y lo demás** (autorización de merge y push): solo con §4 resuelto. Push a `main`, Workers Builds en verde, V9 y supervisión de T052 (E1, E2, E14 y E16 contra producción; E32 en GA4, solo lectura).

## 6. Reversión

- **Retirada rápida de la invitación**: un commit que solo quite `<DiagnosisInvite />` de `src/routes/index.tsx`. El diagnóstico, WhatsApp y la analítica siguen intactos.
- **Revertir una parte**: `git revert` del commit afectado (nunca `reset --hard` ni `push --force`). El MVP (commits 2–4) se revierte junto.
- **Fallo grave**: volver a la versión anterior desde el panel de Cloudflare (la hace el responsable) mientras se prepara el revert.
