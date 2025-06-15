import React from "react";
import { Link } from "~/lib/i18n/navigation";
import { cn } from "~/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function TypographyH1({ children, className, id }: TypographyProps) {
  return (
    <h1
      id={id}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className, id }: TypographyProps) {
  return (
    <h2
      id={id}
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className, id }: TypographyProps) {
  return (
    <h3
      id={id}
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({ children, className, id }: TypographyProps) {
  return (
    <h4
      id={id}
      className={cn(
        "mt-6 scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyP({ children, className, id }: TypographyProps) {
  return (
    <p
      id={id}
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function TypographyLarge({ children, className, id }: TypographyProps) {
  return (
    <div
      id={id}
      className={cn(
        "text-lg font-semibold",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TypographySmall({ children, className, id }: TypographyProps) {
  return (
    <small
      id={id}
      className={cn(
        "text-sm font-medium leading-none",
        className,
      )}
    >
      {children}
    </small>
  );
}

export function TypographyMuted({ children, className, id }: TypographyProps) {
  return (
    <p
      id={id}
      className={cn(
        "text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function TypographySection({ children, className, id }: TypographyProps) {
  return (
    <div
      id={id}
      className={cn(
        "space-y-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TypographyCode({ children, className, id }: TypographyProps) {
  return (
    <code
      id={id}
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className,
      )}
    >
      {children}
    </code>
  );
}

export function TypographyLead({ children, className, id }: TypographyProps) {
  return (
    <p
      id={id}
      className={cn(
        "text-xl text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function TypographyBlockquote({ children, className, id }: TypographyProps) {
  return (
    <blockquote
      id={id}
      className={cn(
        "mt-6 border-l-2 pl-6 italic",
        className,
      )}
    >
      {children}
    </blockquote>
  );
}

export function TypographyList({ children, className, id }: TypographyProps) {
  return (
    <ul
      id={id}
      className={cn(
        "my-6 ml-6 list-disc [&>li]:mt-2",
        className,
      )}
    >
      {children}
    </ul>
  );
}

export function TypographyInlineCode({ children, className, id }: TypographyProps) {
  return (
    <code
      id={id}
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className,
      )}
    >
      {children}
    </code>
  );
}

export function TypographyTable({ children, className, id }: TypographyProps) {
  return (
    <div id={id} className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)}>
        {children}
      </table>
    </div>
  );
}

export function TypographyLink({ children, className, id, href = "#" }: TypographyProps & { href?: string }) {
  // 判断是否为内部链接
  const isInternalLink = href.startsWith("/") || href.startsWith("#");

  if (isInternalLink) {
    // 使用国际化的Link组件处理内部链接
    return (
      <Link
        id={id}
        href={href}
        className={cn(
          "font-medium text-primary underline underline-offset-4",
          className,
        )}
      >
        {children}
      </Link>
    );
  }

  // 使用普通的a标签处理外部链接
  return (
    <a
      id={id}
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={cn(
        "font-medium text-primary underline underline-offset-4",
        className,
      )}
    >
      {children}
    </a>
  );
}
