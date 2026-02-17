"use client";

import type { ComponentProps } from "react";

import { Controls as ControlsPrimitive } from "@xyflow/react";
import { cn } from "~/lib/utils/index";

export type ControlsProps = ComponentProps<typeof ControlsPrimitive>;

export function Controls({ className, ...props }: ControlsProps) {
  return (
    <ControlsPrimitive
      className={cn(
        "gap-px overflow-hidden rounded-md border bg-card p-1 shadow-none!",
        "[&>button]:rounded-md [&>button]:border-none! [&>button]:bg-transparent! [&>button]:hover:bg-secondary!",
        className,
      )}
      {...props}
    />
  );
}
