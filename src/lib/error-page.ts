/**
 * Página de error 500 renderizada por el servidor cuando falla el SSR.
 *
 * Es HTML autónomo a propósito: si el SSR falló, no se puede depender de React
 * ni de la hoja de estilos de la app. Por eso lleva su propio <style> y NO usa
 * JavaScript ni atributos de evento (`onclick`): "Intentar de nuevo" es un
 * enlace a la misma URL, que recarga la página sin ejecutar código. Así
 * tampoco se rompe si algún día se activa una CSP sin `unsafe-inline` para
 * scripts (el <style> sí requeriría un hash o `style-src 'unsafe-inline'`).
 */
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Esta página no cargó · Quimora Tech</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a { display: inline-flex; align-items: center; justify-content: center; min-height: 2.75rem; padding: 0 1rem; border-radius: 0.375rem; font: inherit; text-decoration: none; border: 1px solid transparent; box-sizing: border-box; }
      a:focus-visible { outline: 2px solid #111; outline-offset: 2px; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Esta página no cargó</h1>
      <p>Algo falló de nuestro lado. Puedes intentarlo de nuevo o volver al inicio.</p>
      <div class="actions">
        <a class="primary" href="">Intentar de nuevo</a>
        <a class="secondary" href="/">Volver al inicio</a>
      </div>
    </main>
  </body>
</html>`;
}
