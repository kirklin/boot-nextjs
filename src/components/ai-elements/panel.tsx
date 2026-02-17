import type { ComponentProps } from "react";

import { Panel as PanelPrimitive } from "@xyflow/react";
import { cn } from "~/lib/utils/index";

type PanelProps = ComponentProps<typeof PanelPrimitive>;

export function Panel({ className, ...props }: PanelProps) {
  return (
    <PanelPrimitive
      className={cn(
        "m-4 overflow-hidden rounded-md border bg-card p-1",
        className,
      )}
      {...props}
    />
  );
}
