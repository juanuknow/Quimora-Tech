import { WindowBar } from "./BrowserChrome";

/**
 * Marco para capturas reales de una aplicación de escritorio, sin insinuar una URL pública.
 * Dibuja una ventana ajena, igual que `BrowserChrome`: mide en porcentajes y no usa tokens.
 */
export function DesktopAppChrome({ title }: { title: string }) {
  return (
    <WindowBar>
      <span className="ml-[2.5%] truncate text-[0.5rem] font-medium text-zinc-600">{title}</span>
    </WindowBar>
  );
}
