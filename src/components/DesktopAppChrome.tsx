/** Frame label for a real desktop app screenshot, without implying a public URL. */
export function DesktopAppChrome({ title }: { title: string }) {
  return (
    <div className="flex h-[8%] shrink-0 items-center gap-[1%] bg-zinc-100 px-[2.5%]">
      <span className="aspect-square h-[20%] min-h-[4px] rounded-full bg-zinc-300" />
      <span className="aspect-square h-[20%] min-h-[4px] rounded-full bg-zinc-300" />
      <span className="aspect-square h-[20%] min-h-[4px] rounded-full bg-zinc-300" />
      <span className="ml-[2.5%] truncate text-[0.5rem] font-medium text-zinc-600">{title}</span>
    </div>
  );
}
