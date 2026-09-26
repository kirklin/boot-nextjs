"use client";

import type { StackApp } from "~/components/landing/tiles/app-icon";
import { useRef } from "react";
import { AppIcon } from "~/components/landing/tiles/app-icon";

const ICON = 52;
const GAP = 6;
// How much larger the icon right under the pointer gets, and how far the effect reaches.
const GROWTH = 0.75;
const REACH = 160;

/**
 * A desktop dock: every icon grows with its closeness to the pointer, the
 * shelf widens with them, and the icon under the pointer shows its name.
 */
export function AppDock({ apps }: { apps: StackApp[] }) {
  const listRef = useRef<HTMLUListElement>(null);

  function magnify(pointerX: number | null) {
    const list = listRef.current;
    if (!list) {
      return;
    }
    const items = [...list.children] as HTMLElement[];
    const { left, width } = list.getBoundingClientRect();
    // Distances are measured on the resting layout; the dock grows around its centre.
    const restingLeft = left + width / 2 - (items.length * (ICON + GAP) - GAP) / 2;
    let active = -1;
    let nearest = ICON / 2 + GAP;
    items.forEach((item, i) => {
      const distance = pointerX === null ? REACH : Math.abs(pointerX - (restingLeft + i * (ICON + GAP) + ICON / 2));
      const closeness = Math.cos((Math.min(distance / REACH, 1) * Math.PI) / 2);
      item.style.setProperty("--size", `${ICON * (1 + GROWTH * closeness)}px`);
      if (distance < nearest) {
        nearest = distance;
        active = i;
      }
    });
    items.forEach((item, i) => item.toggleAttribute("data-active", i === active));
  }

  return (
    <div className="relative" onPointerMove={event => magnify(event.clientX)} onPointerLeave={() => magnify(null)}>
      <div className="absolute inset-x-0 bottom-0 h-[71px] rounded-[22px] bg-white/45 shadow-[0_18px_40px_-22px_rgb(0_0_0/0.45)] backdrop-blur-2xl backdrop-saturate-150 dark:bg-white/[0.09]" />
      <ul ref={listRef} className="relative flex items-end gap-1.5 px-2 pt-2 pb-[11px]">
        {apps.map(({ name, icon, surface }) => (
          <li key={name} className="group/app relative size-[var(--size,52px)] shrink-0 transition-[width,height] duration-100 ease-out">
            <AppIcon icon={icon} surface={surface} className="size-full" />
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-zinc-900 opacity-0 shadow-lg backdrop-blur transition-opacity group-data-active/app:opacity-100 dark:bg-zinc-800/90 dark:text-white">
              {name}
            </span>
            <span className="absolute -bottom-[7px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground/45" />
          </li>
        ))}
      </ul>
    </div>
  );
}
