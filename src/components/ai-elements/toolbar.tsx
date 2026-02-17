import type { ComponentProps } from "react";

import { NodeToolbar, Position } from "@xyflow/react";
import { cn } from "~/lib/utils/index";

type ToolbarProps = ComponentProps<typeof NodeToolbar>;

export function Toolbar({ className, ...props }: ToolbarProps) {
  return (
    <NodeToolbar
      className={cn(
        "flex items-center gap-1 rounded-sm border bg-background p-1.5",
        className,
      )}
      position={Position.Bottom}
      {...props}
    />
  );
}
