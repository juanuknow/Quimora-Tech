/**
 * Barra superior de un navegador (tres puntos + dirección), compartida por todos los marcos
 * que muestran capturas de proyectos (laptop del caso destacado y galería).
 *
 * Excepción deliberada al sistema: esto no es UI nuestra, es el dibujo de un navegador ajeno.
 * Por eso mide en porcentajes (escala con el dispositivo) y no usa los tokens tipográficos de
 * la marca. Debe vivir dentro de un contenedor flex-col con altura definida.
 */
export function BrowserChrome({ domain }: { domain: string }) {
  return (
    <div className="flex h-[8%] shrink-0 items-center gap-[1%] bg-zinc-100 px-[2.5%]">
      <span className="aspect-square h-[20%] min-h-[4px] rounded-full bg-zinc-300" />
      <span className="aspect-square h-[20%] min-h-[4px] rounded-full bg-zinc-300" />
      <span className="aspect-square h-[20%] min-h-[4px] rounded-full bg-zinc-300" />
      <span className="ml-[2.5%] flex h-[55%] flex-1 items-center gap-[1.5%] truncate rounded-full bg-white px-[2.5%] text-[0.5rem] font-medium text-zinc-400">
        <span className="aspect-square h-[34%] min-h-[3px] shrink-0 animate-pulse rounded-full bg-success" />
        {domain}
      </span>
    </div>
  );
}
