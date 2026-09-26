"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const t = useTranslations("HomePage.copy");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(setCopied, 2000, false);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <button
        type="button"
        aria-label={`${t("label")}: ${command}`}
        onClick={async () => {
          await navigator.clipboard.writeText(command);
          setCopied(true);
        }}
        className="group inline-flex h-11 max-w-full items-center gap-3 rounded-full border bg-background/70 pr-1.5 pl-5 font-mono text-[13px] text-muted-foreground shadow-xs backdrop-blur transition-colors hover:border-foreground/20 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="text-muted-foreground/60 select-none">$</span>
        <span className="truncate">{command}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors group-hover:bg-accent">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </span>
      </button>
      <span aria-live="polite" className="sr-only">{copied ? t("copied") : ""}</span>
    </>
  );
}
