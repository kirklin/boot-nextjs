"use client";

import type { localePrefix } from "~/lib/i18n/navigation";
import { Lock } from "lucide-react";
import { useState } from "react";
import { glass } from "~/components/landing/glass";
import { Segmented } from "~/components/landing/segmented";
import { cn } from "~/lib/utils";

type Strategy = typeof localePrefix;
type Language = "en" | "zh";

// The same example page in both languages, whatever language the site is shown in.
const HEADLINES: Record<Language, string> = {
  en: "Simple, transparent pricing.",
  zh: "简单透明的价格。",
};

/** Where the English and Chinese pricing pages live under each strategy. */
function pricingPath(strategy: Strategy, language: Language) {
  if (language === "en") {
    return strategy === "always" ? "/en/pricing" : "/pricing";
  }
  return strategy === "never" ? "/pricing" : "/zh/pricing";
}

interface LocaleStrategyProps {
  /** The strategy configured in src/lib/i18n/navigation.ts. */
  current: Strategy;
  /** One line per strategy explaining how it builds URLs. */
  notes: Record<Strategy, string>;
  languageLabel: string;
  currentLabel: string;
}

/** One page in two languages; switch the language and the URL strategy to see the address change. */
export function LocaleStrategy({ current, notes, languageLabel, currentLabel }: LocaleStrategyProps) {
  const [language, setLanguage] = useState<Language>("zh");
  const [strategy, setStrategy] = useState<Strategy>(current);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 @xl:p-8">
      <Segmented
        label={languageLabel}
        value={language}
        onChange={setLanguage}
        options={[
          { value: "en", label: "English" },
          { value: "zh", label: "中文" },
        ]}
      />
      <div className="flex flex-col items-center gap-4">
        <p className={cn(glass, "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] tabular-nums")}>
          <Lock className="size-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">example.com</span>
          <span key={`${language}-${strategy}`} className="animate-in font-medium duration-300 fade-in">{pricingPath(strategy, language)}</span>
        </p>
        <p
          key={language}
          lang={language}
          className="animate-in text-center text-3xl font-semibold tracking-tight text-balance duration-500 fade-in slide-in-from-bottom-2 @xl:text-[2.75rem]/tight [&:lang(zh)]:tracking-normal"
        >
          {HEADLINES[language]}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2.5">
        <Segmented
          label="localePrefix"
          value={strategy}
          onChange={setStrategy}
          className="font-mono"
          options={(["never", "as-needed", "always"] as const).map(value => ({
            value,
            label: (
              <>
                {value}
                {value === current && (
                  <span title={currentLabel} className="size-1.5 rounded-full bg-[#34c759]">
                    <span className="sr-only">{currentLabel}</span>
                  </span>
                )}
              </>
            ),
          }))}
        />
        <p className="text-center text-[12px] text-muted-foreground">{notes[strategy]}</p>
      </div>
    </div>
  );
}
