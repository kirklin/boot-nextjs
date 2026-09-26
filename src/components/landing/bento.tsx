import type { ComponentProps, ReactNode } from "react";
import { cn } from "~/lib/utils";

interface BentoRowProps {
  /** Share the width equally instead of using the three-column track. */
  even?: boolean;
  children: ReactNode;
}

/**
 * One row of the feature grid. Rows adapt to the tiles they contain: a lone
 * tile spans the full width, and on tablets an odd last tile fills its line.
 */
export function BentoRow({ even = false, children }: BentoRowProps) {
  return (
    <div
      className={cn(
        "grid gap-5 md:grid-cols-2 md:max-lg:[&>:last-child:nth-child(odd)]:col-span-2",
        even
          ? "lg:grid-flow-col lg:grid-cols-none lg:auto-cols-fr"
          : "lg:grid-cols-3 lg:[&>:only-child]:col-span-full",
      )}
    >
      {children}
    </div>
  );
}

interface BentoTileProps {
  /** Anchor the site menu links to. */
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Span two of the three columns in a regular row. */
  wide?: boolean;
  /** Extra classes for the illustration area, e.g. a taller minimum height. */
  visualClassName?: string;
  children: ReactNode;
}

/**
 * A feature tile: copy on top, a scene below (inset, with a concentric
 * radius); a tile alone in its row lays the two out side by side.
 */
export function BentoTile({ id, eyebrow, title, description, wide = false, visualClassName, children }: BentoTileProps) {
  return (
    <article
      id={id}
      className={cn(
        "reveal group/tile flex scroll-mt-20 flex-col overflow-hidden rounded-[28px] bg-background dark:bg-card",
        "lg:only:flex-row lg:only:items-center",
        wide && "lg:col-span-2",
      )}
    >
      <div className="px-8 pt-9 pb-7 sm:px-10 sm:pt-10 lg:group-only/tile:w-2/5 lg:group-only/tile:shrink-0 lg:group-only/tile:py-14 lg:group-only/tile:pr-4 lg:group-only/tile:pl-14">
        <p className="text-[15px] font-semibold text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-2 text-2xl/[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[1.75rem]/[1.15] [&:lang(zh)]:tracking-normal">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-[15px]/6 text-pretty text-muted-foreground">{description}</p>
      </div>
      <div
        className={cn(
          "flex min-h-80 flex-1 flex-col p-2 pt-0 lg:group-only/tile:self-stretch lg:group-only/tile:pt-2",
          visualClassName,
        )}
      >
        {children}
      </div>
    </article>
  );
}

/**
 * The picture area of a tile: a softly tinted backdrop that fills the tile's
 * lower part. In dark mode every scene is a plain black screen inside the tile,
 * and the color comes from what is on it. Animated content inside is
 * positioned absolutely so its changing size never shifts the layout.
 */
export function Scene({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("@container relative flex flex-1 flex-col overflow-hidden rounded-[22px] dark:bg-black dark:bg-none", className)} {...props}>
      {children}
    </div>
  );
}

/** A decorative illustration drawn straight onto the tile, cropped by its edges. */
export function Artwork({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden className="relative -mx-2 -mb-2 min-h-72 flex-1 text-link lg:group-only/tile:-m-2">
      {children}
    </div>
  );
}
