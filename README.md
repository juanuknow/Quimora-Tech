# Quimora Tech

Sitio web de **Quimora Tech**, agencia de diseño y desarrollo web de Cali, Colombia
([quimoratech.com](https://quimoratech.com)). Una landing que convierte visitantes en
clientes, más páginas de servicio, páginas por tipo de negocio y páginas legales.

## Stack

TanStack Start (React 19) · Vite · TypeScript · Tailwind CSS v4 · Nitro · Cloudflare Workers

## Empezar

```bash
npm install
npm run dev        # http://localhost:8080
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (`.output/`) |
| `npx tsc --noEmit` | Comprobación de tipos |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Documentación

- [`docs/ESTRUCTURA.md`](docs/ESTRUCTURA.md) — cómo está distribuido el repositorio:
  carpetas, rutas, componentes, datos, despliegue y dónde cambiar cada cosa.
- [`CLAUDE.md`](CLAUDE.md) — identidad visual, estándares de código y principios del proyecto.
- [`docs/PLANTILLA_CASO_DE_EXITO.md`](docs/PLANTILLA_CASO_DE_EXITO.md) — plantilla para
  documentar proyectos reales (solo cifras verificables).

## Ramas

Una sola rama, **`main`**, que es producción. El repositorio está conectado a Lovable:
no se fuerza el push ni se reescribe el historial publicado.
