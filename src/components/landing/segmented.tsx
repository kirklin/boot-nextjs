"use client";

import type { ReactNode } from "react";
import { glass } from "~/components/landing/glass";
import { cn } from "~/lib/utils";

interface SegmentedProps<T extends string> {
  label: string;
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** A glass segmented control: one choice out of a few. */
export function Segmented<T extends string>({ label, options, value, onChange, className }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn(glass, "inline-flex rounded-full p-1", className)}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-200",
            option.value === value
              ? "bg-white text-zinc-900 shadow-[0_1px_3px_rgb(0_0_0/0.12)] dark:bg-white/20 dark:text-white"
              : "text-foreground/60 hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
