import { cn } from "~/lib/utils";

export interface StackApp {
  name: string;
  /** Iconify class of the logo mark, e.g. `i-[simple-icons--react]`. */
  icon: string;
  /** Gradient stops and glyph color of the icon surface. */
  surface: string;
}

/** A logo drawn as an app icon: squircle, lit brand gradient, soft shadow. */
export function AppIcon({ icon, surface, className }: Pick<StackApp, "icon" | "surface"> & { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[22.5%] bg-linear-to-b shadow-[0_1px_2px_rgb(0_0_0/0.14),0_8px_18px_-6px_rgb(0_0_0/0.35)]",
        surface,
        className,
      )}
    >
      <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_0%,rgb(255_255_255/0.32),transparent_60%)]" />
      <span className={cn(icon, "relative size-1/2 drop-shadow-[0_1px_1px_rgb(0_0_0/0.25)]")} />
    </span>
  );
}
