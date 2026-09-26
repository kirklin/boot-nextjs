"use client";

import { useLayoutEffect, useRef } from "react";
import { useTimeline } from "~/components/landing/use-timeline";
import { cn } from "~/lib/utils";

export interface TrimPlan {
  deletions: number;
  patches: number;
  files: number;
  dependencies: number;
  namespaces: number;
  keys: number;
}

interface TrimTerminalProps {
  /** Title and hint of each feature, as the picker lists them; the first one is removed. */
  features: { title: string; hint: string }[];
  /** The summary `pnpm trim` prints for that removal. */
  plan: TrimPlan;
}

const COMMAND = "pnpm trim";
const CHECKS = ["pnpm install", "eslint --fix", "type check (tsc)", "remove trim tool (self-cleanup)"];

// Frames: the prompt, the command typed out, the picker, the first feature unchecked, the plan, one per step, done.
const PICKER = COMMAND.length + 1;
const UNCHECKED = PICKER + 1;
const PLAN = UNCHECKED + 1;
const STEPS = PLAN + 1;
const DURATIONS = [800, ...Array.from(COMMAND, (_, i) => (i === COMMAND.length - 1 ? 450 : 75)), 1500, 900, 1400, 500, 1500, 900, 1200, 450, 5000];
const DONE = DURATIONS.length - 1;

// Every line of output is one row of this height, in pixels.
const ROW = 19;

// The CLI's ANSI styles, in colors for the light and the dark theme.
const dim = "text-[#8e8e93]";
const bold = "font-semibold text-[#1d1d1f] dark:text-white";
const cyan = "text-[#0e7a92] dark:text-[#5ccbe3]";
const heading = "font-semibold text-[#0e7a92] dark:text-[#5ccbe3]";
const green = "text-[#248a3d] dark:text-[#32d74b]";

function Prompt() {
  return <span className={dim}>my-saas % </span>;
}

function Cursor() {
  return <span className="inline-block h-[14px] w-[7px] animate-caret-blink bg-current align-[-3px] opacity-60 motion-reduce:animate-none" />;
}

function Blank() {
  return <p style={{ height: ROW }} />;
}

/** Replays `pnpm trim` in a Terminal window, with the tool's exact prompts, summary and steps. */
export function TrimTerminal({ features, plan }: TrimTerminalProps) {
  const { ref, frame } = useTimeline<HTMLDivElement>(DURATIONS);
  const screenRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [removed] = features;
  const steps = [`apply ${plan.deletions + plan.patches} changes`, ...CHECKS];
  const running = frame - STEPS;

  // New output pushes the old lines up a whole row at a time, as in a terminal;
  // the spacer row below the output leaves room to scroll to a row boundary.
  useLayoutEffect(() => {
    const screen = screenRef.current!;
    screen.scrollTop = Math.max(0, outputRef.current!.offsetHeight - Math.floor(screen.clientHeight / ROW) * ROW);
  }, [frame]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute top-5 bottom-5 left-5 -right-[45%] flex flex-col overflow-hidden rounded-[14px] bg-white/90 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_30px_60px_-24px_rgb(15_23_42/0.35)] ring-1 ring-black/[0.08] backdrop-blur-xl dark:bg-[#141416]/90 dark:shadow-[0_30px_60px_-24px_rgb(0_0_0/0.8)] dark:ring-white/10"
    >
      <div className="relative flex h-10 shrink-0 items-center gap-2 px-4">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="absolute inset-x-0 text-center text-[12px] font-medium text-foreground/45">my-saas — zsh</span>
      </div>

      <div ref={screenRef} className="mb-3 min-h-0 flex-1 overflow-hidden px-4 font-mono text-[12px] whitespace-pre text-[#3a3a3c] dark:text-[#d1d1d6]">
        <div ref={outputRef} style={{ lineHeight: `${ROW}px` }}>
          <p>
            <Prompt />
            {COMMAND.slice(0, Math.min(frame, COMMAND.length))}
            {frame < PICKER && <Cursor />}
          </p>

          {frame >= PICKER && (
            <>
              <Blank />
              <p className={heading}>boot-nextjs trim</p>
              <Blank />
              <p className={dim}>Pick the features your project needs — the rest gets removed cleanly:</p>
              <p className={dim}>code, dependencies, env vars, locales and docs. Nothing is written until you confirm.</p>
              <Blank />
              <p>
                <span className={bold}>Which features do you want to keep?</span>
                {" "}
                <span className={dim}>(↑/↓ move · space toggle · enter confirm)</span>
              </p>
              {features.map(({ title, hint }, i) => {
                const kept = i > 0 || frame < UNCHECKED;
                return (
                  <p key={title}>
                    <span className={cyan}>{i === 0 ? "❯" : " "}</span>
                    {" "}
                    <span className={kept ? green : dim}>{kept ? "◉" : "◯"}</span>
                    {" "}
                    <span className={cn(i === 0 && bold)}>{title}</span>
                    {"  "}
                    <span className={dim}>{hint}</span>
                  </p>
                );
              })}
            </>
          )}

          {frame >= PLAN && (
            <>
              <Blank />
              <p className={heading}>{`Removing: ${removed.title}`}</p>
              <Blank />
              <p>
                {"  "}
                <span className={bold}>delete</span>
                {`   ${plan.deletions} files/directories`}
              </p>
              <p>
                {"  "}
                <span className={bold}>patch</span>
                {`    ${plan.patches} anchored edits across ${plan.files} files`}
              </p>
              <p>
                {"  "}
                <span className={bold}>deps</span>
                {`     -${plan.dependencies} dependencies`}
              </p>
              <p>
                {"  "}
                <span className={bold}>locales</span>
                {`  -${plan.namespaces} namespaces, -${plan.keys} keys (en/zh)`}
              </p>
              <Blank />
              <p>
                <span className={bold}>Apply these changes? Files are deleted permanently (git can restore them).</span>
                {" "}
                <span className={dim}>[y/N]</span>
                {frame >= STEPS && " y"}
              </p>
            </>
          )}

          {frame >= STEPS && (
            <>
              <Blank />
              {steps.slice(0, running + 1).map((step, i) => (
                <p key={step}>
                  {"  "}
                  {i < running ? <span className={green}>✓</span> : <span className={dim}>→</span>}
                  {` ${step}`}
                  {i === running && <span className={dim}> …</span>}
                </p>
              ))}
            </>
          )}

          {frame === DONE && (
            <>
              <Blank />
              <p className={heading}>{`✔ Done — removed: ${removed.title}`}</p>
              <Blank />
              <p>  Next steps:</p>
              <p>
                {"  • "}
                <span className={cyan}>pnpm dev</span>
                {" — check the result"}
              </p>
              <p>
                {"  • review "}
                <span className={cyan}>git diff</span>
                {" and the READMEs"}
              </p>
              <p>  • commit the trimmed template</p>
              <Blank />
              <p>
                <Prompt />
                <Cursor />
              </p>
            </>
          )}
        </div>
        <Blank />
      </div>
    </div>
  );
}
