"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { glass, selectedRing } from "~/components/landing/glass";
import { cn } from "~/lib/utils";

type Appearance = "light" | "dark" | "system";

const APPEARANCES: Appearance[] = ["light", "dark", "system"];

const subscribeToNothing = () => () => {};

/** A desktop with one window, painted in the light or the dark palette. */
function Desktop({ dark }: { dark: boolean }) {
  return (
    <span className={cn("absolute inset-0", dark ? "bg-[linear-gradient(160deg,#20365a,#0b1220)]" : "bg-[linear-gradient(160deg,#cddff6,#eef3fb)]")}>
      <span className={cn("absolute top-[24%] right-[-12%] bottom-[-12%] left-[14%] overflow-hidden rounded-tl-[7px] shadow-[0_4px_12px_rgb(0_0_0/0.25)]", dark ? "bg-[#1c1c1e]" : "bg-white")}>
        <span className="flex gap-[3px] p-[6px]">
          <span className="size-[5px] rounded-full bg-[#ff5f57]" />
          <span className="size-[5px] rounded-full bg-[#febc2e]" />
          <span className="size-[5px] rounded-full bg-[#28c840]" />
        </span>
        <span className={cn("absolute top-0 bottom-0 left-0 w-[30%]", dark ? "bg-[#2c2c2e]/70" : "bg-[#f2f2f7]")} />
        <span className={cn("absolute top-[38%] left-[38%] h-[7%] w-[40%] rounded-full", dark ? "bg-[#3a3a3c]" : "bg-[#e5e5ea]")} />
        <span className={cn("absolute top-[56%] left-[38%] h-[7%] w-[28%] rounded-full", dark ? "bg-[#3a3a3c]" : "bg-[#e5e5ea]")} />
      </span>
    </span>
  );
}

function Thumbnail({ appearance }: { appearance: Appearance }) {
  if (appearance !== "system") {
    return <Desktop dark={appearance === "dark"} />;
  }
  return (
    <>
      <Desktop dark={false} />
      <span className="absolute inset-0 [clip-path:polygon(62%_0,100%_0,100%_100%,38%_100%)]">
        <Desktop dark />
      </span>
    </>
  );
}

/** An appearance chooser with a desktop thumbnail per theme, wired to the site theme. */
export function AppearancePicker({ label, labels }: { label: string; labels: Record<Appearance, string> }) {
  const { theme, setTheme } = useTheme();
  // The stored theme is only known in the browser; render nothing selected on the server.
  const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false);

  return (
    <div className={cn(glass, "w-full max-w-[24rem] rounded-[22px] p-4 pb-3.5")}>
      <p className="px-0.5 text-[13px] font-semibold">{label}</p>
      <div role="radiogroup" aria-label={label} className="mt-3.5 grid grid-cols-3 gap-3.5">
        {APPEARANCES.map((appearance) => {
          const selected = hydrated && theme === appearance;
          return (
            <button
              key={appearance}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTheme(appearance)}
              className="group flex flex-col items-center gap-2.5 outline-none"
            >
              <span
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden rounded-[12px] shadow-[0_1px_2px_rgb(0_0_0/0.1),0_8px_20px_-8px_rgb(0_0_0/0.3)] transition duration-300 group-focus-visible:ring-2 group-focus-visible:ring-ring",
                  selected ? selectedRing : "group-hover:-translate-y-0.5",
                )}
              >
                <Thumbnail appearance={appearance} />
              </span>
              <span className={cn("text-[13px] font-medium transition-colors", selected ? "text-foreground" : "text-muted-foreground")}>
                {labels[appearance]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
