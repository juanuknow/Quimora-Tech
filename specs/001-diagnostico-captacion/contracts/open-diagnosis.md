# Contrato: apertura del diagnóstico e invitación por sesión

## Evento de ventana `diagnosis:start`

Mecanismo existente en `src/lib/diagnosis.ts` (`DIAGNOSIS_START_EVENT`), ampliado. Es la única forma de abrir la ventana del diagnóstico (FR-013a).

```ts
export interface DiagnosisStartDetail {
  source: "invitacion" | "seccion" | "atajo";
  business?: BusinessId; // solo desde un atajo
}

export function requestDiagnosis(detail: DiagnosisStartDetail): void;
```

| Quién lo emite                                                             | `source`     | `business` |
| -------------------------------------------------------------------------- | ------------ | ---------- |
| Botón "Comenzar diagnóstico gratuito" de la invitación (ventana o tarjeta) | `invitacion` | —          |
| Botón "Comenzar diagnóstico gratuito" de la sección `#diagnostico`         | `seccion`    | —          |
| Atajos "¿Cuál es tu caso?" (`DiagnosisShortcuts`)                          | `atajo`      | El elegido |

**Cambio de comportamiento**: `requestDiagnosis` deja de desplazar la página hasta `#diagnostico`; solo abre la ventana. Quien lo escucha es una única `DiagnosisDialog` montada en la home.

**Enlaces existentes que no cambian**: los enlaces `/#diagnostico` de `VerticalDetail` siguen llevando a la sección, que conserva su presentación y su botón.

## Clave `sessionStorage` `qt:diagnosis-invite`

| Valor       | Lo escribe                                             | Efecto                             |
| ----------- | ------------------------------------------------------ | ---------------------------------- |
| `shown`     | La invitación, al mostrarse                            | No vuelve a mostrarse en la sesión |
| `dismissed` | "Ahora no", el botón de cierre o Escape                | Ídem                               |
| `completed` | La ventana, al mostrar el resultado (cualquier origen) | Ídem                               |

- Se lee y escribe solo en efectos del cliente, nunca durante el render (sin diferencias de hidratación).
- Todo acceso va en `try/catch`; si falla, se usa un estado en memoria (como máximo una invitación por carga de página).
- Ningún otro componente lee ni escribe esta clave.
- Si la tarjeta móvil se suprime porque no cumple FR-007b (FR-007c), no se escribe ningún valor.

## Acciones de la invitación (U2)

| Control                         | Ventana (≥ 768 × 640 px)                                                          | Tarjeta (resto)                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| «Comenzar diagnóstico gratuito» | Cierra la invitación y llama a `requestDiagnosis({ source: "invitacion" })`       | Oculta la tarjeta y llama a `requestDiagnosis({ source: "invitacion" })`         |
| «Ahora no»                      | `markInvite("dismissed")` y cierre; el foco vuelve al elemento previo o a `#main` | `markInvite("dismissed")` y ocultación; si el foco estaba dentro, pasa a `#main` |
| Botón de cierre (×)             | Igual que «Ahora no»                                                              | Igual que «Ahora no»                                                             |
| Escape                          | Igual que «Ahora no» (evento `cancel`)                                            | Igual que «Ahora no», solo si el foco está dentro de la tarjeta                  |

En ambos casos el estado ya es `shown` desde que se mostró; «Comenzar…» no escribe `dismissed`.

## Detección de la ventana abierta (U3)

La ventana del diagnóstico es `<dialog id="diagnosis-dialog">`. La invitación no se muestra si `document.getElementById("diagnosis-dialog")?.open` es verdadero (FR-005).

## Botón de la sección

El botón de la sección `#diagnostico` se llama «Comenzar diagnóstico gratuito» (D3), igual que el de la invitación, y emite `requestDiagnosis({ source: "seccion" })`.
