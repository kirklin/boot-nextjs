"use client";

import { Direction } from "radix-ui";
import * as React from "react";

function DirectionProvider({
  dir,
  direction,
  children,
}: React.ComponentProps<typeof Direction.DirectionProvider> & {
  direction?: React.ComponentProps<typeof Direction.DirectionProvider>["dir"];
}) {
  return (
    <Direction.DirectionProvider dir={direction ?? dir}>
      {children}
    </Direction.DirectionProvider>
  );
}

const useDirection = Direction.useDirection;

// eslint-disable-next-line react-refresh/only-export-components
export { DirectionProvider, useDirection };
