"use client";

import type { SubscriptionPlan } from "~/lib/stripe/plans";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Segmented } from "~/components/landing/segmented";
import { stripeAmountToMajorUnits } from "~/lib/stripe/format";

type BillingInterval = "month" | "year";

/** Splits a price into symbol, whole units and cents, so the cents can be set smaller. */
function priceParts(amount: number, currency: string, locale: string) {
  const value = stripeAmountToMajorUnits(amount, currency);
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).formatToParts(value);
  const pick = (types: Intl.NumberFormatPartTypes[]) => parts.filter(({ type }) => types.includes(type)).map(part => part.value).join("");
  return { symbol: pick(["currency"]), whole: pick(["integer", "group"]), cents: pick(["decimal", "fraction"]) };
}

interface BillingPreviewProps {
  plan: SubscriptionPlan;
  /** Label of the call to action (the free trial when the plan has one). */
  action: string;
}

/** One plan with the monthly / annual switch of the pricing page. */
export function BillingPreview({ plan, action }: BillingPreviewProps) {
  const t = useTranslations("Pricing");
  const locale = useLocale();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("year");
  const price = priceParts(billingInterval === "year" ? Math.round(plan.annualPrice / 12) : plan.price, plan.currency, locale);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <Segmented
        label={t("switchBilling")}
        value={billingInterval}
        onChange={setBillingInterval}
        options={[
          { value: "month", label: t("monthly") },
          { value: "year", label: t("annual") },
        ]}
      />
      <div aria-live="polite" className="text-center">
        <p className="text-[13px] font-semibold text-muted-foreground">{plan.name}</p>
        <p key={billingInterval} className="mt-1 flex animate-in items-start justify-center duration-300 fade-in slide-in-from-bottom-1">
          <span className="mt-2 text-2xl font-semibold">{price.symbol}</span>
          <span className="text-6xl font-semibold tracking-[-0.05em] tabular-nums">{price.whole}</span>
          <span className="mt-2 text-2xl font-semibold tabular-nums">{price.cents}</span>
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {t("perMonth")}
          {billingInterval === "year" && ` · ${t("billedAnnually")}`}
        </p>
      </div>
      <p aria-hidden className="flex h-11 items-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background">{action}</p>
    </div>
  );
}
