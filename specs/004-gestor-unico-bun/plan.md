# Implementation Plan: Gestor único: Bun

**Branch**: `chore/gestor-unico-bun` | **Date**: 2026-11-10 | **Spec**: parte A de riesgo medio aprobada sin spec adicional; parte B aplazada exige su propia spec.

**Input**: decisión del responsable comunicada por el Director: plan aprobado con división A/B. Parte A autorizada en el árbol de trabajo, riesgo medio: retirar el lockfile npm, añadir su ignore y alinear constitución y documentación. Parte B aplazada, riesgo alto: campo `packageManager`, con spec propia y evidencia de Lovable antes de implementarse. No se autoriza git add, commit, merge, push ni publicación. Redacción manual siguiendo `.specify/templates/plan-template.md`, sin invocar skills de Spec Kit.

## Summary

Parte A: conservar `bun.lock` como única resolución, retirar `package-lock.json` y alinear verificaciones y documentación con Bun. Producción compila con Bun 1.4.4 (Cloudflare Workers Builds). Parte B: declarar `"packageManager": "bun@1.4.4"` queda fuera de alcance; no editar `package.json`. No actualizar dependencias ni regenerar `bun.lock`. Paso 6 autoriza únicamente la parte A y la actualización de este plan, sin preparar ni registrar cambios en Git.

### Problema y evidencia

- El Director inspeccionó directamente el panel de Cloudflare: compilación `b5012933` del commit `478fff2`, Bun 1.4.4, `bun install --frozen-lockfile`, `bun run build` y `npx wrangler deploy`, sobre el Worker `quimoratech`. La inspección directa fue del Director; el implementador recibe esa evidencia.
- Base verificada: `main` y `origin/main` en `478fff2`, sin divergencia tras `git fetch origin main`; árbol limpio antes de crear la rama.
- `package.json:6-13` define scripts Vite, ESLint y Prettier, pero no declara `packageManager`. La constitución usa comandos npm en V1-V5 y P3 (`.specify/memory/constitution.md:231-235,247`).
- `docs/ESTRUCTURA.md:160-161` mantiene dos lockfiles y pide comprobar qué gestor construye Cloudflare. `README.md:110-120` recomienda npm. Esas instrucciones ya no representan el flujo de producción confirmado.
- `git log -1 -- package-lock.json` devuelve `799ac59`, de 2026-08-12. El Director confirma que ese lockfile no interviene en producción.

| Paquete                     | `bun.lock` (línea) | `package-lock.json` (línea de versión) |
| --------------------------- | ------------------ | -------------------------------------- |
| Prettier                    | 3.8.3 (859)        | 3.9.5 (6941)                           |
| eslint-plugin-prettier      | 5.5.5 (621)        | 5.5.6 (4564)                           |
| @tanstack/react-start       | 1.168.26 (445)     | 1.168.27 (2993)                        |
| @tanstack/start-server-core | 1.169.15 (469)     | 1.169.16 (3371)                        |
| seroval                     | 1.5.4 (897)        | 1.5.5 (7190)                           |
| Vite                        | 8.0.16 (975)       | 8.1.4 (7735)                           |

El falso fallo de formato bajo npm motivó una corrección que el responsable rechazó: validaba otro árbol. Ese cambio ya se restauró; no forma parte de esta propuesta. En el Paso 3 Bun local era 1.3.14 y la instalación falló con `EPERM` en la caché de `fastq`; eso dejó herramientas parciales utilizables, pero no una instalación válida. En Paso 6.1 el responsable había eliminado node_modules; se verificó su ausencia, Bun local devolvió 1.4.4 y el primer intento `bun install --frozen-lockfile` terminó con código 0 (378 paquetes). No se actualizó Bun durante la ejecución del implementador.

### Alternativas consideradas

| Alternativa    | Decisión y motivo                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bun único      | Elegida por el responsable: conserva el lockfile desplegado y el gestor que ya usa Cloudflare y, según la documentación, Lovable. Evita cambiar versiones de dependencias. |
| npm único      | Descartada: exigiría cambiar el pipeline de producción y adoptar o reconstruir un árbol distinto; añade riesgo sin resolver una necesidad comercial.                       |
| Mantener ambos | Descartada: permite instalaciones y resultados de formato distintos; obligaría a sincronizar dos resoluciones sin una fuente única.                                        |
| No hacer nada  | Descartada: conserva verificaciones que pueden fallar o pasar con versiones diferentes de las desplegadas.                                                                 |

## Technical Context

**Language/Version**: TypeScript y React existentes; Bun objetivo 1.4.4. Bun local 1.4.4, equivalente a la versión de producción; Node local v24.18.0. No se sustituye el runtime del Worker ni se añade `--bun` a herramientas.

**Primary Dependencies**: TanStack Start, Vite, Tailwind y Nitro existentes, exactamente desde `bun.lock`; sin cambios de rangos, versiones, scripts o dependencias.

**Storage**: no aplica; solo manifiesto, lockfile y documentación del toolchain.

**Testing**: V1-V4 con Bun 1.4.4 e instalación congelada, comprobación de versiones efectivas, diff y estado de Git; V9 tras un despliegue autorizado. No se añade ejecutor de tests.

**Target Platform**: Cloudflare Workers Builds y desarrollo Windows; hosting y SSR preservados.

**Project Type**: sitio SSR existente; migración de convenciones de instalación y verificación.

**Performance Goals**: no cambiar los chunks ni el comportamiento respecto de un build base con el mismo Bun y lockfile. Comparar tamaños y avisos; Lighthouse continúa informativo según el Principio VI.

**Constraints**: Paso 5 solo creó este archivo; Paso 6 autoriza parte A y actualizar el plan. En la constitución solo se cambian seis comandos y metadatos. No tocar package.json, bun.lock, bunfig.toml, .prettierignore, wrangler.jsonc, vite.config.ts, src, public, specs/001, .claude ni el resto de .specify. El comando de deploy de Cloudflare no cambia.

**Scale/Scope**: parte A en seis archivos: eliminar `package-lock.json` y editar constitución, `docs/ESTRUCTURA.md`, `README.md`, `CLAUDE.md` y `.gitignore`; se actualiza además este plan. `.prettierignore` y `package.json` se conservan.

## Constitution Check

_GATE: revisión previa a implementación; este documento no declara aprobada la migración._

| Principio / parte                   | Cumplimiento propuesto y condición                                                                                                                                                     |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Producción protegida             | Rama local desde main actualizado; ningún commit, integración, publicación o cambio de Cloudflare sin autorización concreta.                                                           |
| II. Arquitectura preservada         | Se conserva Bun ya usado en producción, Vite, SSR, Nitro y hosting. No se instala una dependencia nueva ni se cambia el runtime. Validar compatibilidad con Lovable antes de integrar. |
| III. Especificación                 | El responsable aprobó la parte A como riesgo medio sin spec adicional. La parte B de riesgo alto sí requiere spec propia y evidencia de Lovable antes de implementarse.                |
| IV. Reversión                       | Parte A de riesgo medio: revertir el commit, señal de fallo y verificación posterior. La parte B conserva clasificación alta y no se implementa.                                       |
| V. Calidad                          | Sin cambios de lógica; comprobaciones con las herramientas fijadas en el lockfile desplegado. No aplicar correcciones de formato a src.                                                |
| VI. Rendimiento                     | Comparación con baseline Bun equivalente; sin imponer umbrales nuevos ni mezclar la línea base npm con la de Bun.                                                                      |
| VII-IX. Accesibilidad, diseño y SEO | No se tocan UI, contenido, rutas, metadatos o estilos; comprobar carga SSR tras despliegue.                                                                                            |
| X-XI. Secretos y veracidad          | No leer `.env*` ni `.dev.vars`; solo datos públicos. Distinguir hechos verificados, dato del Director y pruebas pendientes. V8 antes de cada commit autorizado.                        |
| XII. Ramas y commits                | `chore/gestor-unico-bun` local; diff revisable; mensajes en minúsculas con motivo, riesgo y verificación.                                                                              |
| Parte V. Enmiendas                  | Propuesta PATCH 1.0.1 por aclarar la ejecución de verificaciones existentes; enmienda y documentos afectados en un mismo commit, previa aprobación.                                    |

**Resultado**: parte A aprobada para implementar sin spec adicional; instalación Bun 1.4.4 válida obtenida antes de editar. Parte B bloqueada hasta spec propia, evidencia Lovable y autorización. Ninguna parte autoriza commit, integración o publicación.

## Project Structure

### Documentation (this feature)

```text
specs/004-gestor-unico-bun/
└── plan.md    # Único archivo creado en Paso 5
```

No se crean spec, tareas, research, contratos ni archivos de Spec Kit en este paso.

### Source Code (repository root)

```text
package-lock.json                  # Eliminación propuesta, todavía no realizada
package.json                       # Sin cambios: packageManager es parte B aplazada
.specify/memory/constitution.md     # Enmienda futura; no se toca en este paso
docs/ESTRUCTURA.md                  # Gestor, lockfile y comandos
README.md                          # Instalación y comandos
CLAUDE.md                          # Checklist y convención del gestor
.gitignore                         # Regla /package-lock.json
.prettierignore                    # Sin cambios; regla ya existente
bun.lock                           # Sin cambios
bunfig.toml                        # Sin cambios
src/                               # Sin cambios
wrangler.jsonc                     # Sin cambios
```

**Structure Decision**: mantener la estructura existente y una sola resolución de dependencias. Eliminar el lockfile npm no equivale a eliminar Node ni el comando de publicación externo.

## Inventario exacto de cambios propuestos

Las líneas se refieren a `478fff2`. Todas estas ediciones son futuras; ninguna se ejecuta al redactar el plan.

### 1. package-lock.json

**Actual**: archivo completo versionado, con una resolución distinta a `bun.lock`. **Propuesto**: eliminar el archivo completo, sin trasladar sus versiones a Bun. La preimagen íntegra queda en `478fff2:package-lock.json`; no se reproduce aquí por ser un archivo generado. No se elimina en Paso 5.

### 2. .specify/memory/constitution.md

Sustituir únicamente los comandos de estas seis filas; conservar criterios, obligatoriedad y momento de ejecución:

| Línea / ID | Texto actual                                                     | Texto propuesto                                                   |
| ---------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| 231 / V1   | `npx tsc --noEmit`                                               | `bunx tsc --noEmit`                                               |
| 232 / V2   | `npm run lint`                                                   | `bun run lint`                                                    |
| 233 / V3   | `npx prettier --check <archivos modificados>`; nunca `--write .` | `bunx prettier --check <archivos modificados>`; nunca `--write .` |
| 234 / V4   | `npm run build`                                                  | `bun run build`                                                   |
| 235 / V5   | Manual en `npm run dev`                                          | Manual en `bun run dev`                                           |
| 247 / P3   | Registrar la línea base de avisos actuales de `npm run build`    | Registrar la línea base de avisos actuales de `bun run build`     |

No hay otras menciones a npm en la constitución. P3 sigue pendiente: cambiar su comando no activa el gate.

**Metadatos actuales** (`:278`):

```text
**Versión:** 1.0.0 | **Ratificada:** 2026-11-06 | **Última enmienda:** 2026-11-06
```

**Propuestos**, si se aprueba la enmienda el 2026-11-10:

```text
**Versión:** 1.0.1 | **Ratificada:** 2026-11-06 | **Última enmienda:** 2026-11-10
```

Si la aprobación ocurre otro día, usar su fecha real. Se propone PATCH conforme a Parte V (`:267-272`): se aclara cómo ejecutar verificaciones existentes con el árbol vigente; no se añade un principio, sección ni restricción del MVP. Si el responsable decide añadir un principio nuevo obligatorio sobre el gestor, esa ampliación sería MINOR 1.1.0 y requeriría revisar este inventario; no se implementa implícitamente.

### 3. docs/ESTRUCTURA.md

| Línea   | Texto actual                                                                                                                                                    | Texto propuesto                                                             |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 49      | `├── bun.lock · package-lock.json   Lockfiles (ver sección 7)`                                                                                                  | `├── bun.lock                  Lockfile único de Bun (ver sección 7)`       |
| 160-161 | `- **Dos lockfiles:**` seguido de `bun.lock` (lo usa Lovable) y `package-lock.json` (npm). No borrar ninguno sin comprobar con qué gestor construye Cloudflare. | Sustituir el párrafo por el bloque siguiente.                               |
| 166     | `npm install        # instalar dependencias`                                                                                                                    | `bun install --frozen-lockfile # instalar las versiones fijadas`            |
| 167     | `npm run dev        # servidor de desarrollo (http://localhost:8080)`                                                                                           | `bun run dev        # servidor de desarrollo (http://localhost:8080)`       |
| 168     | `npm run build      # build de producción`                                                                                                                      | `bun run build      # build de producción`                                  |
| 169     | `npx tsc --noEmit   # comprobación de tipos`                                                                                                                    | `bunx tsc --noEmit   # comprobación de tipos`                               |
| 170     | `npm run lint       # ESLint`                                                                                                                                   | `bun run lint       # ESLint`                                               |
| 171     | `npm run format     # Prettier`                                                                                                                                 | `bunx prettier --check src # comprobar formato; no aplicar cambios masivos` |

Bloque propuesto para sustituir el párrafo de las líneas 160-161:

```markdown
- **Gestor único:** Bun; `bun.lock` es el único lockfile versionado.
  Producción compila con Bun 1.4.4 (Cloudflare Workers Builds). Desarrollo y verificación usan `bun install --frozen-lockfile`.
  Cloudflare Workers Builds instala con ese comando y construye con `bun run build`.
  Su comando de publicación existente, `npx wrangler deploy`, se conserva; no se
  ejecuta sin autorización. Lovable usa `bun.lock`.
  El campo `packageManager` no está declarado; fijarlo se evaluará por separado.
```

No se corrigen en esta entrega los apartados antiguos sobre ramas, cabeceras o nombre del Worker.

### 4. README.md

| Línea | Texto actual                                       | Texto propuesto                                       |
| ----- | -------------------------------------------------- | ----------------------------------------------------- |
| 110   | `npm install`                                      | `bun install --frozen-lockfile`                       |
| 111   | `npm run dev        # http://localhost:8080`       | `bun run dev        # http://localhost:8080`          |
| 116   | `npm run dev` / Servidor de desarrollo             | `bun run dev` / Servidor de desarrollo                |
| 117   | `npm run build` / Build de producción (`.output/`) | `bun run build` / Build de producción (`.output/`)    |
| 118   | `npx tsc --noEmit` / Comprobación de tipos         | `bunx tsc --noEmit` / Comprobación de tipos           |
| 119   | `npm run lint` / ESLint                            | `bun run lint` / ESLint                               |
| 120   | `npm run format` / Prettier                        | `bunx prettier --check src` / Comprobación de formato |

Insertar antes del bloque de instalación de `:109` este texto: «Requiere Bun (producción usa 1.4.4). El proyecto usa exclusivamente Bun para instalar y verificar dependencias; `bun.lock` es la fuente única de versiones. No generar ni versionar `package-lock.json`. Las verificaciones se ejecutan después de una instalación congelada completa.»

### 5. CLAUDE.md

| Línea | Texto actual                                      | Texto propuesto                                                                |
| ----- | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| 359   | ``- [ ] TypeScript sin errores (`tsc --noEmit`)`` | ``- [ ] TypeScript sin errores (`bunx tsc --noEmit`)``                         |
| 360   | ``- [ ] ESLint pasando (`npm run lint`)``         | ``- [ ] ESLint pasando (`bun run lint`)``                                      |
| 361   | ``- [ ] Prettier formateado (`npm run format`)``  | ``- [ ] Prettier comprobado (`bunx prettier --check <archivos modificados>`)`` |

Las dos últimas filas son todas sus menciones actuales a npm; no contiene menciones a los dos lockfiles. Se incluye la fila TypeScript contigua para que el checklist sea ejecutable de forma consistente.

Insertar al inicio de «Herramientas» (`CLAUDE.md`, bajo «Stack Tecnológico») este texto: «Gestor único: Bun. Producción compila con Bun 1.4.4 (Cloudflare Workers Builds). Instalar con `bun install --frozen-lockfile`; verificar con las herramientas locales fijadas en `bun.lock`. No usar otros gestores para instalar, actualizar o validar este proyecto. Los ejemplos genéricos de skills deben adaptarse a Bun y no autorizan instalar dependencias. La excepción operativa existente es `npx wrangler deploy` en Cloudflare Workers Builds; no se cambia ni se ejecuta sin autorización.»

### 6. .gitignore y .prettierignore

- `.gitignore` actual: no contiene una regla para el lockfile npm. Propuesto: añadir `/package-lock.json` junto al bloque de dependencias, sin otras modificaciones. Reduce su reaparición accidental tras retirar el archivo rastreado; no impide que una herramienta lo genere ni que alguien lo fuerce con Git. No se promete una protección técnica absoluta.
- `.prettierignore:6` actual: `package-lock.json`. Propuesto: conservar exactamente esa línea. Ya evita reformatear una copia accidental y no obliga a versionarla; no hay razón para cambiar este archivo.
- Mantener el resto de ignores, incluidos logs npm y otros lockfiles genéricos. El script existente `format` de `package.json` sigue fuera de alcance y no se recomienda ejecutar: contiene `prettier --write .`, contrario al límite de V3. Las nuevas instrucciones usan comprobación acotada.

### Búsqueda completa de referencias

Inventario previo a este plan: 42 líneas coincidentes en todos los archivos versionados, incluidos ocultos, con los patrones literales `npm `, `npx ` y `package-lock`. Se excluyen `node_modules`, `.output`, `bun.lock` y archivos de secretos, que no se leen. La búsqueda con `rg --hidden` se contrastó contra `git ls-files` para incluir archivos ignorados pero versionados. Las referencias nuevas dentro de este plan son citas y propuestas de migración; se conservan como evidencia, no son instrucciones vigentes de npm. «Cambia» significa en la futura implementación, nunca en Paso 5.

| Archivo                                         | Línea | Texto actual completo de la línea (espacios de alineación omitidos)                                                                                                                                                                                                                                   | ¿Cambia?                              |
| ----------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `.claude/skills/speckit-implement/SKILL.md`     | 145   | <code>- **Prettier**: `node_modules/`, `dist/`, `build/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`</code>                                                                                                                                                                      | No: plantilla gestionada de Spec Kit  |
| `.claude/skills/ui-styling/SKILL.md`            | 57    | <code>npx shadcn@latest init</code>                                                                                                                                                                                                                                                                   | No: ejemplo genérico; adaptar al usar |
| `.claude/skills/ui-styling/SKILL.md`            | 64    | <code>npx shadcn@latest add button card dialog form</code>                                                                                                                                                                                                                                            | No: ejemplo genérico; adaptar al usar |
| `.claude/skills/ui-styling/SKILL.md`            | 95    | <code>npm install -D tailwindcss @tailwindcss/vite</code>                                                                                                                                                                                                                                             | No: ejemplo genérico; adaptar al usar |
| `.prettierignore`                               | 6     | <code>package-lock.json</code>                                                                                                                                                                                                                                                                        | No: defensa existente                 |
| `.specify/memory/constitution.md`               | 231   | <code>&#124; V1 &#124; Tipos &#124; `npx tsc --noEmit` &#124; código de salida 0 &#124; Todo cambio de código &#124;</code>                                                                                                                                                                           | Sí: inventario anterior               |
| `.specify/memory/constitution.md`               | 232   | <code>&#124; V2 &#124; Lint &#124; `npm run lint` &#124; código de salida 0 &#124; Todo cambio de código &#124;</code>                                                                                                                                                                                | Sí: inventario anterior               |
| `.specify/memory/constitution.md`               | 233   | <code>&#124; V3 &#124; Formato &#124; `npx prettier --check &lt;archivos modificados&gt;`; nunca `--write .` &#124; código de salida 0 &#124; Todo cambio de código y todo documento nuevo &#124;</code>                                                                                              | Sí: inventario anterior               |
| `.specify/memory/constitution.md`               | 234   | <code>&#124; V4 &#124; Build &#124; `npm run build` &#124; código de salida 0 &#124; Riesgo medio y alto; siempre antes de integrar en `main` &#124;</code>                                                                                                                                           | Sí: inventario anterior               |
| `.specify/memory/constitution.md`               | 235   | <code>&#124; V5 &#124; Recorridos críticos &#124; Manual en `npm run dev`: formulario (éxito y error), enlaces de WhatsApp, anclas en escritorio y móvil, páginas legales, 404; consola sin errores &#124; Todos funcionan &#124; Si el cambio los toca &#124;</code>                                 | Sí: inventario anterior               |
| `.specify/memory/constitution.md`               | 247   | <code>&#124; P3 &#124; Avisos nuevos del build &#124; Registrar la línea base de avisos actuales de `npm run build` &#124;</code>                                                                                                                                                                     | Sí: inventario anterior               |
| `CLAUDE.md`                                     | 360   | <code>- [ ] ESLint pasando (`npm run lint`)</code>                                                                                                                                                                                                                                                    | Sí: inventario anterior               |
| `CLAUDE.md`                                     | 361   | <code>- [ ] Prettier formateado (`npm run format`)</code>                                                                                                                                                                                                                                             | Sí: inventario anterior               |
| `README.md`                                     | 110   | <code>npm install</code>                                                                                                                                                                                                                                                                              | Sí: inventario anterior               |
| `README.md`                                     | 111   | <code>npm run dev # http://localhost:8080</code>                                                                                                                                                                                                                                                      | Sí: inventario anterior               |
| `README.md`                                     | 116   | <code>&#124; `npm run dev` &#124; Servidor de desarrollo &#124;</code>                                                                                                                                                                                                                                | Sí: inventario anterior               |
| `README.md`                                     | 117   | <code>&#124; `npm run build` &#124; Build de producción (`.output/`) &#124;</code>                                                                                                                                                                                                                    | Sí: inventario anterior               |
| `README.md`                                     | 118   | <code>&#124; `npx tsc --noEmit` &#124; Comprobación de tipos &#124;</code>                                                                                                                                                                                                                            | Sí: inventario anterior               |
| `README.md`                                     | 119   | <code>&#124; `npm run lint` &#124; ESLint &#124;</code>                                                                                                                                                                                                                                               | Sí: inventario anterior               |
| `README.md`                                     | 120   | <code>&#124; `npm run format` &#124; Prettier &#124;</code>                                                                                                                                                                                                                                           | Sí: inventario anterior               |
| `docs/ESTRUCTURA.md`                            | 49    | <code>├── bun.lock · package-lock.json Lockfiles (ver sección 7)</code>                                                                                                                                                                                                                               | Sí: inventario anterior               |
| `docs/ESTRUCTURA.md`                            | 160   | <code>- **Dos lockfiles:** `bun.lock` (lo usa Lovable) y `package-lock.json` (npm). No borrar</code>                                                                                                                                                                                                  | Sí: inventario anterior               |
| `docs/ESTRUCTURA.md`                            | 166   | <code>npm install # instalar dependencias</code>                                                                                                                                                                                                                                                      | Sí: inventario anterior               |
| `docs/ESTRUCTURA.md`                            | 167   | <code>npm run dev # servidor de desarrollo (http://localhost:8080)</code>                                                                                                                                                                                                                             | Sí: inventario anterior               |
| `docs/ESTRUCTURA.md`                            | 168   | <code>npm run build # build de producción</code>                                                                                                                                                                                                                                                      | Sí: inventario anterior               |
| `docs/ESTRUCTURA.md`                            | 169   | <code>npx tsc --noEmit # comprobación de tipos</code>                                                                                                                                                                                                                                                 | Sí: inventario anterior               |
| `docs/ESTRUCTURA.md`                            | 170   | <code>npm run lint # ESLint</code>                                                                                                                                                                                                                                                                    | Sí: inventario anterior               |
| `docs/ESTRUCTURA.md`                            | 171   | <code>npm run format # Prettier</code>                                                                                                                                                                                                                                                                | Sí: inventario anterior               |
| `specs/001-diagnostico-captacion/baseline.md`   | 9     | <code>&#124; `npm run build` &#124; Código 0; **1 aviso** (`inlineDynamicImports option is ignored because the codeSplitting option is specified`) &#124;</code>                                                                                                                                      | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/plan.md`       | 142   | <code>- **V5**: recorridos críticos a mano en `npm run dev` (formulario de contacto con éxito y error, enlaces de WhatsApp, anclas en escritorio y móvil, páginas legales, 404 y consola sin errores), además de lo que el cambio toque.</code>                                                       | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/quickstart.md` | 15    | <code>npx tsc --noEmit</code>                                                                                                                                                                                                                                                                         | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/quickstart.md` | 16    | <code>npm run lint</code>                                                                                                                                                                                                                                                                             | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/quickstart.md` | 17    | <code>npx prettier --check &lt;archivos modificados&gt;</code>                                                                                                                                                                                                                                        | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/quickstart.md` | 18    | <code>npm run build</code>                                                                                                                                                                                                                                                                            | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/tasks.md`      | 18    | <code>- **Ningún commit, merge, push ni despliegue sin autorización expresa** para cada uno (Principio I). Antes de **cada** propuesta de commit: **V5** (recorridos críticos a mano en `npm run dev`) y **V8** (revisión de secretos en `git diff --cached`), anotados en `validation.md` §1.</code> | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/tasks.md`      | 39    | <code>- [x] T002 Compilar la línea base con `npm run build`, copiar `.output` a `…\scratchpad\baseline-001\`, fijar `"compatibility_date": "2026-07-21"` en `server/wrangler.json` de la copia y servirla con `npx wrangler dev --local --port 8801 --ip 127.0.0.1 -c wrangler.json`.</code>          | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/tasks.md`      | 46    | <code>- número de avisos de `npm run build`;</code>                                                                                                                                                                                                                                                   | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/tasks.md`      | 74    | <code>- `npx tsc --noEmit`, `npm run lint`, `npx prettier --check` de los tres archivos y `npm run build`, todos con código 0;</code>                                                                                                                                                                 | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/tasks.md`      | 152   | <code>- **Estáticas:** `npx tsc --noEmit`, `npm run lint`, `npx prettier --check` de los archivos tocados, `npm run build` y `node C:\tmp\pwenv\engine-check.mjs`.</code>                                                                                                                             | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/tasks.md`      | 295   | <code>- [x] T042 Verificaciones V1–V4: `npx tsc --noEmit`, `npm run lint`, `npx prettier --check &lt;archivos modificados&gt;` y `npm run build`, con código 0 y el mismo número de avisos de build que en `baseline.md`.</code>                                                                      | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/tasks.md`      | 298   | <code>- `git diff --stat main..HEAD -- src/components/Nav.tsx src/components/Footer.tsx src/server.ts src/lib/security-headers.ts public wrangler.jsonc vite.config.ts src/styles.css package.json package-lock.json` vacío.</code>                                                                   | No: registro histórico de 001         |
| `specs/001-diagnostico-captacion/validation.md` | 11    | <code>&#124; Commit &#124; Fecha &#124; V5: recorridos críticos en `npm run dev` &#124; V8: `git diff --cached` sin secretos &#124; Autorización &#124;</code>                                                                                                                                        | No: registro histórico de 001         |

`npx wrangler deploy` no aparece en esas 42 líneas: es configuración externa confirmada por el Director y se conserva. Las filas históricas contienen todos sus comandos, también cuando hay varias coincidencias por línea.

## Impacto y compatibilidad

### Cloudflare Workers Builds

Parte A conserva la configuración inspeccionada por el Director: instalación congelada y build Bun, y `npx wrangler deploy` sin cambios. Eliminar el lockfile no utilizado por producción no debe alterar el artefacto; comprobarlo contra la línea base. No se añade `packageManager`, por lo que no se atribuye a la parte A un efecto de ese campo.

Parte B aplazada: [Cloudflare documenta](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/#package-manager-versions) que `packageManager` fija la versión del gestor y el lockfile determina qué gestor instala. Ese efecto, sus overrides y su compatibilidad con Lovable requieren una revisión independiente. No cambiar el panel ni ejecutar deploy en este paso.

### Lovable

`docs/ESTRUCTURA.md:160` identifica Bun como gestor de Lovable; `AGENTS.md:3-9` advierte sobre sincronización e historia. Parte A conserva bun.lock y no modifica el campo packageManager, dependencias ni configuración de Lovable. Las referencias históricas y ejemplos genéricos se conservan por decisión expresa. Parte B requiere evidencia de compatibilidad con `packageManager: bun@1.4.4`; no se presume ni se prueba sincronizando una rama sin autorización.

### bunfig.toml y Windows

Mantener intacto `bunfig.toml:3` (`minimumReleaseAge = 86400`) y su lista existente de excepciones (`:6`). La [documentación de Bun](https://bun.com/docs/pm/cli/install#minimum-release-age) describe la barrera temporal; no ampliar excepciones ni usar opciones que la desactiven. Las nuevas resoluciones, si alguna vez se autorizan, respetarán las 24 h; aquí no se resuelve ni actualiza ninguna versión.

En Windows se trabaja fuera de OneDrive. En Paso 6.1 Bun local es 1.4.4 y la instalación congelada a) funcionó; no se necesitaron la caché alternativa b) ni el backend copyfile c). El EPERM anterior queda como antecedente resuelto para esta ejecución, sin cambios de permisos ni instalación de Bun por el implementador. Confirmar versiones locales antes de validar; no descargar herramientas ausentes como sustitución de una instalación fallida. No se añade `.gitattributes` ni se normalizan finales de línea.

## Riesgo y plan de reversión

**Plan documental: bajo. Parte A: medio, aprobado por el responsable. Parte B: alto, aplazado.** Parte A retira un lockfile no usado por producción y cambia documentación/verificaciones, sin cambiar selección de versión mediante packageManager, rangos ni bun.lock. Debe conservar los artefactos del build base.

Señales de fallo de A: lint o build dejan de pasar respecto de la base, diferencias de chunks/avisos no explicadas, Workers Builds rojo, carga SSR o rutas de servicio rotas. Reversión: con autorización, `git revert` del commit completo de parte A en una rama local, restaurando juntos lockfile, ignores, constitución y documentos. Verificar instalación congelada, tipos, lint y build; si hubo publicación, V9 sobre `/` y una ruta de servicio. No reescribir historia.

Parte B, si se autoriza en el futuro, conserva el requisito de identificar antes de desplegar la versión activa estable del Worker quimoratech en Versions & Deployments: ID de versión, deployment, commit y fecha. No reutilizar IDs históricos ni implementar B sin su spec y evidencia de Lovable. No hay despliegue autorizado ahora.

## Verificación y aceptación antes de integrar

Procedimiento futuro, no ejecutado en Paso 5:

1. Comprobar ausencia de node_modules como indicó el Director y registrar `bun --version`, sin actualizar Bun. Si no coincide con 1.4.4, continuar con la anotación «no equivalente a producción». Instalar con los intentos autorizados a), b), c), deteniéndose en el primero que funcione o ante una instalación parcial fallida. En esta ejecución a) funcionó con Bun 1.4.4. Medir línea base sobre 478fff2 antes de editar y detenerse si lint falla.
2. Confirmar que existe el `bun.lock` esperado. Ejecutar `bun install --frozen-lockfile`; si falla, detenerse, sin fallback npm ni regeneración del lockfile. La [documentación oficial](https://bun.com/docs/pm/cli/install#production-mode) explica que la instalación congelada conserva las versiones fijadas.
3. Registrar versiones efectivas con `bunx prettier --version` (esperada 3.8.3), y las versiones de paquetes desde sus manifiestos instalados; contrastarlas con `bun.lock`. No invocar herramientas ausentes mediante descargas implícitas.
4. Ejecutar V1 `bunx tsc --noEmit`, V2 `bun run lint`, V3 `bunx prettier --check src` y comprobación acotada de los documentos modificados no ignorados, y V4 `bun run build`; registrar códigos y salida. La constitución se revisa a mano porque `.prettierignore` excluye `.specify/`; no quitar ese ignore ni reformatear todo el repositorio. Declarar por separado cualquier deuda previa de formato de documentos (P4), sin corregirla en este cambio.
5. Comparar chunks y avisos contra la base Bun equivalente; no actualizar automáticamente P3. Si se genera un diff inesperado, detenerse y reportarlo. V5 con `bun run dev` si el cambio afecta recorridos; después del build verificar al menos carga SSR y rutas como control del artefacto. V6/V7 no aplican sin cambios visuales; V8 antes del commit autorizado.
6. `git diff --exit-code -- bun.lock bunfig.toml src wrangler.jsonc vite.config.ts` debe quedar vacío; la única eliminación prevista es el lockfile npm. Revisar diff completo, lista exacta de archivos y versiones. Confirmar que no se incorpora otro lockfile ni artefactos.
7. Presentar diff y resultados de parte A; no integrar si los fallos impiden validar el artefacto. La implementación A está autorizada en el árbol de trabajo; git add, commit, merge, push y despliegue no lo están. Evidencia de Lovable y spec propia siguen siendo requisitos de B.

Tras una publicación autorizada, **V9**: check GitHub «Workers Builds» en verde, confirmar en logs Bun 1.4.4 e instalación congelada, comprobar `curl -I https://quimoratech.com/`, cargar `/` y `/servicios/desarrollo-web`, revisar SSR y cabeceras esperadas sin cambiarlas. Verificar que el deployment pertenece a `quimoratech`. Supervisión inmediata del responsable y disponibilidad de la versión previa para rollback.

## Estrategia de commits propuesta

Dos commits, solo si cada uno se autoriza por separado:

1. `docs: planificar la unificación del gestor en bun`
   Contenido: únicamente este plan. Cuerpo propuesto: «Documenta la divergencia de lockfiles y el procedimiento para validar el árbol de producción. Riesgo bajo: solo planificación. Verificación: inventario contra 478fff2, revisión de alcance y comprobación de formato disponible; declarar cualquier bloqueo.» No implica autorización de implementar.
2. `chore: retirar el lockfile npm y alinear las verificaciones con bun`
   Contenido indivisible de parte A: eliminación de `package-lock.json`, enmienda constitucional y sus metadatos, README, CLAUDE, ESTRUCTURA y regla de `.gitignore`. No incluye package.json ni el campo packageManager. Cuerpo propuesto: «Alinea las verificaciones con el lockfile desplegado para evitar resultados entre versiones distintas. Riesgo medio de parte A; reversión del commit completo ante fallo de build o regresión SSR, con verificación posterior. Verificación: instalación congelada y V1-V4 con Bun 1.4.4, lockfile estable y compatibilidad revisada; V9 pendiente de despliegue autorizado.» Solo registrar lo realmente ejecutado al redactar el mensaje definitivo.

La Parte V exige que la enmienda y los documentos afectados viajen en el segundo commit, nunca en commits independientes. Parte A no requiere spec adicional por decisión expresa; parte B sí requiere su propia spec y evidencias, y no está incluida en estos commits. Ningún commit se hace en main. No publicar ramas. Merge, push y despliegue requieren permisos concretos adicionales.

## Fuera de alcance

### Fuera de alcance (parte B): packageManager

**Actual** (`:4-5`):

```json
  "sideEffects": false,
  "type": "module",
```

**Propuesto**, sin tocar scripts ni dependencias:

```json
  "sideEffects": false,
  "packageManager": "bun@1.4.4",
  "type": "module",
```

La propuesta anterior pertenece exclusivamente a la parte B aplazada. No se aplica ni se añade a package.json en parte A. Requiere spec y evidencia de Lovable propias.

- Discrepancia del nombre del Worker: `wrangler.jsonc:16` declara `juanuknow-conversion-craft-96`; el responsable confirma que el real es `quimoratech`. No cambiar ese nombre ni la configuración de deploy en esta migración. Antes de publicar, el responsable debe confirmar que el comando existente sigue apuntando al Worker real; si no, bloquear publicación y resolver por separado.
- `.gitattributes`, normalización de finales de línea y correcciones de `routeTree.gen.ts`.
- Actualización o remediación de dependencias vulnerables, regeneración de `bun.lock`, cambios de rangos o de scripts de `package.json`.
- CSP/HSTS y otras cabeceras; configuración Cloudflare, DNS, secretos y observabilidad.
- Cambiar `npx wrangler deploy`, actualizar Wrangler o instalar herramientas globales.
- Actualizar Bun local, cambiar permisos o reparar cachés fuera de los intentos de instalación expresamente autorizados.
- Reescribir registros históricos de `specs/001-*`, guías genéricas de `.claude/skills` o archivos gestionados de Spec Kit.
- Activar P3, normalizar documentación antigua (P4), introducir CI/tests/hooks para prohibir otros gestores o asegurar una prohibición técnica absoluta.
- Cambios de producto, UI, SSR, formularios, analítica, datos, privacidad y SEO.

## Preguntas abiertas para el responsable

1. **Resuelta:** el responsable acepta la deuda previa P4 demostrada en las versiones HEAD, sin normalización masiva.
2. **Resuelta:** las tres referencias documentales nuevas quedan aprobadas como excepciones intencionales: advertencia de package-lock en README y npx wrangler deploy en CLAUDE y ESTRUCTURA.
3. Parte B permanece pendiente: ¿qué evidencia de Lovable y spec se solicitarán antes de una futura autorización del campo packageManager? No bloquea parte A.
4. Antes de publicar, confirmar destino real del deploy ante la discrepancia del nombre del Worker; no se cambia aquí. No se solicita autorización de publicación en este paso.

## Complexity Tracking

No se solicita una excepción a la constitución: parte A es de riesgo medio y tiene aprobación expresa sin spec adicional. Parte B conserva sus gates de riesgo alto. Ninguna aprobación concede permiso para preparar cambios, hacer commit, integrar o publicar.

## Registro de ejecución (parte A)

- **Fecha:** 2026-11-10. Instalación válida mediante `bun install --frozen-lockfile` con Bun 1.4.4, equivalente a producción. El Director verificó que los chunks de cliente coinciden en nombre y hash con los servidos por quimoratech.com. El implementador no realizó esa inspección de producción.
- **Verificaciones antes y después de parte A:** V1 `bunx tsc --noEmit`, V2 `bun run lint` y V4 `bun run build` finalizaron con código 0 en ambos estados.
- **Cliente:** chunks idénticos antes y después, comprobados mediante SHA-256; se conservaron los nombres y tamaños de los chunks de arranque de `/`.
- **Paso 7:** dos builds consecutivos del mismo árbol generaron 91 archivos cada uno; solo difirieron `nitro.json` (fecha) y `server/index.mjs` (mtime y orden de entradas de assets). Al excluir esos valores y ordenar las entradas, los contenidos coincidieron. Los módulos SSR y React Router fueron idénticos en esa pareja.
- **Paso 8:** builds con y sin `package-lock.json` generaron 91 archivos cada uno; 89 fueron idénticos. Los otros dos difirieron exclusivamente en el mismo ruido de fecha, mtime y orden. La presencia del lockfile npm no alteró el código del Worker en el experimento. El responsable consideró suficiente la evidencia y no requirió el experimento de caché.
- **Punto abierto de reproducibilidad:** el primer build tras la instalación limpia del Paso 6.1 difirió en el módulo SSR y en la librería de React Router. La causa no se determinó; el experimento del lockfile no reprodujo esas diferencias. El responsable las acepta como punto abierto no atribuible a la parte A ni al lockfile.
- **Deuda P4 demostrada y aceptada:** `CLAUDE.md` y `docs/ESTRUCTURA.md` fallaban el formato también al comprobar copias de HEAD fuera del repositorio con la misma configuración de Prettier; `src/routes/README.md` ya fallaba en la línea base sin cambios en src. No se corrigió esa deuda.
