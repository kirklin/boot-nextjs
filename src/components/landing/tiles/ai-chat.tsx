"use client";

import { BookOpen, Brain, Check, LoaderCircle, Sparkles, Wrench } from "lucide-react";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { glass, glassCircle, selectedRing } from "~/components/landing/glass";
import { useTimeline } from "~/components/landing/use-timeline";
import { cn } from "~/lib/utils";

interface AiChatProps {
  prompt: string;
  assistant: string;
  thinking: string;
  answer: string;
  range: string;
  steps: { reasoning: string; tools: string; sources: string };
}

// Frames before the answer streams: prompt sent, reasoning, tool running, tool done.
const INTRO = [800, 1600, 1100, 400];
const TOKEN_MS = 45;
const HOLD_MS = 5000;

/**
 * A question and its answer, replayed: reasoning, a tool call, then the answer
 * streaming in word by word. The glass buttons light up with the step on screen.
 */
export function AiChat({ prompt, assistant, thinking, answer, range, steps }: AiChatProps) {
  const locale = useLocale();
  const tokens = useMemo(
    () => Array.from(new Intl.Segmenter(locale, { granularity: "word" }).segment(answer), ({ segment }, id) => ({ id, segment })),
    [answer, locale],
  );
  const durations = useMemo(() => [...INTRO, ...tokens.map(() => TOKEN_MS), HOLD_MS], [tokens]);
  const { ref, frame } = useTimeline<HTMLDivElement>(durations);

  const lastFrame = durations.length - 1;
  const streamed = tokens.slice(0, Math.max(0, frame - INTRO.length + 1));
  const step = frame === 1 ? "reasoning" : frame === 2 || frame === 3 ? "tools" : frame === lastFrame ? "sources" : null;
  const buttons = [
    { key: "reasoning", icon: Brain, label: steps.reasoning },
    { key: "tools", icon: Wrench, label: steps.tools },
    { key: "sources", icon: BookOpen, label: steps.sources },
  ];

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 flex flex-col items-center px-5 pt-7 @xl:px-10 @xl:pt-9">
      <div className="flex w-full max-w-xl flex-col gap-3.5">
        <p className={cn(glass, "max-w-[85%] self-end rounded-[20px] rounded-br-md px-4 py-2.5 text-[15px]")}>{prompt}</p>
        <div className={cn(glass, "rounded-[24px] p-5 @xl:p-6")}>
          <p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <Sparkles className="size-4 text-brand" />
            {frame === 1
              ? <span className="animate-shimmer bg-[linear-gradient(90deg,var(--color-muted-foreground)_40%,var(--color-foreground)_50%,var(--color-muted-foreground)_60%)] bg-[length:250%_100%] bg-clip-text text-transparent motion-reduce:animate-none">{thinking}</span>
              : assistant}
          </p>
          <p className="mt-3 text-lg/7 font-medium tracking-tight text-pretty @xl:text-[22px]/[1.4]">
            {streamed.map(({ id, segment }) => <span key={id} className="animate-word-in">{segment}</span>)}
          </p>
          {frame >= 2 && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground/[0.06] px-3 py-1 text-[12px] font-medium text-muted-foreground">
              <Wrench className="size-3.5" />
              {`getSignups · ${range}`}
              {frame >= 3
                ? <Check className="size-3.5 text-[#1a7f37] dark:text-[#34c759]" />
                : <LoaderCircle className="size-3.5 animate-spin" />}
            </p>
          )}
        </div>
      </div>

      <ul className="mt-7 hidden gap-9 @xl:flex">
        {buttons.map(({ key, icon: Icon, label }) => (
          <li key={key} className="flex flex-col items-center gap-2">
            <span className={cn(glassCircle, step === key && selectedRing)}>
              <Icon />
            </span>
            <span className="text-[12px] font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
