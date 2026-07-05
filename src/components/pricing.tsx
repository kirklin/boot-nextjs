"use client";

import type { Subscription } from "@better-auth/stripe";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  Check,
  Folder,
  FolderKanban,
  Headphones,
  Infinity as InfinityIcon,
  MessageSquareDot,
  MessagesSquare,
  Rocket,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authClient } from "~/lib/auth/client";
import { Link, useRouter } from "~/lib/i18n/navigation";
import { stripeAmountToMajorUnits } from "~/lib/stripe/format";
import { findPlanByName, getHighlightedPlan, isSamePlan, subscriptionPlans } from "~/lib/stripe/plans";
import { cn } from "~/lib/utils";

type BillingInterval = "month" | "year";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  "sparkles": Sparkles,
  "messages": MessagesSquare,
  "badge": BadgeCheck,
  "users": Users,
  "headphones": Headphones,
  "rocket": Rocket,
  "folder": Folder,
  "folders": FolderKanban,
  "message-dot": MessageSquareDot,
  "building": Building2,
  "sliders": SlidersHorizontal,
  "infinity": InfinityIcon,
};

const FREE_FEATURE_ICONS = ["sparkles", "messages", "folder"];

/** ChatGPT-style price: superscript symbol, large amount, small currency/cycle. */
function PriceTag({ amount, currency, locale, cycle }: {
  amount: number;
  currency: string;
  locale: string;
  cycle: string;
}) {
  const value = stripeAmountToMajorUnits(amount, currency);
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).formatToParts(value);
  const symbol = parts.filter(p => p.type === "currency").map(p => p.value).join("");
  const number = parts.filter(p => p.type !== "currency").map(p => p.value).join("").trim();

  return (
    <div className="flex items-start gap-0.5">
      <span className="mt-1.5 text-xl font-semibold text-foreground/80">{symbol}</span>
      <span className="text-5xl font-semibold tracking-tight">{number}</span>
      <span className="mt-auto mb-1.5 ml-1.5 text-xs font-medium text-muted-foreground">
        {currency.toUpperCase()}
        {" "}
        {cycle}
      </span>
    </div>
  );
}

function FeatureList({ features, icons }: { features: string[]; icons: string[] }) {
  return (
    <ul className="space-y-3.5">
      {features.map((feature, i) => {
        const Icon = FEATURE_ICONS[icons[i] ?? ""] ?? Check;
        return (
          <li key={feature} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.8} />
            <span className="text-sm leading-5">{feature}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function Pricing() {
  const t = useTranslations("Pricing");
  const locale = useLocale();
  const [interval, setInterval] = useState<BillingInterval>("month");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [downgradeTarget, setDowngradeTarget] = useState<(typeof subscriptionPlans)[number] | null>(null);
  const { data: user } = authClient.useSession();
  const router = useRouter();
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (user) {
      authClient.subscription.list().then(({ data }) => {
        const sub = data?.find(s => s.status === "active" || s.status === "trialing");
        setActiveSubscription(sub ?? null);
      }).catch(() => {
        toast.error(t("subscriptionLoadError"));
      });
    }
  }, [user, t]);

  const currentPlan = findPlanByName(activeSubscription?.plan);
  const currentInterval: BillingInterval = activeSubscription?.billingInterval === "year" ? "year" : "month";
  // Promote relative to what the user already has — never promote a downgrade.
  const highlightedPlan = getHighlightedPlan(activeSubscription?.plan);

  const changePlan = async (plan: (typeof subscriptionPlans)[number], scheduleAtPeriodEnd: boolean) => {
    setLoadingPlan(plan.name);
    try {
      // Upgrades confirm through the Billing Portal and invoice immediately;
      // downgrades are scheduled for the end of the current period.
      const { error } = await authClient.subscription.upgrade({
        plan: plan.name,
        annual: interval === "year",
        successUrl: "/dashboard/billing",
        cancelUrl: "/pricing",
        returnUrl: "/dashboard/billing",
        ...(scheduleAtPeriodEnd && { scheduleAtPeriodEnd: true }),
        ...(activeSubscription?.stripeSubscriptionId && {
          subscriptionId: activeSubscription.stripeSubscriptionId,
        }),
      });
      if (error) {
        // A bare 404 (no error code) means the Stripe plugin isn't registered
        // — the deployment is missing the STRIPE_* environment variables.
        if (error.status === 404 && !error.code) {
          console.warn("[stripe] Subscription endpoints are not registered — set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET (see README).");
          toast.error(t("billingNotConfigured"));
        } else {
          toast.error(error.message ?? t("checkoutError"));
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(t("checkoutError"));
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleSelect = (plan: (typeof subscriptionPlans)[number]) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    const isDowngrade = !!currentPlan && plan.price < currentPlan.price;
    if (isDowngrade) {
      setDowngradeTarget(plan);
      return;
    }
    changePlan(plan, false);
  };

  const effectiveDate = activeSubscription?.periodEnd
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(activeSubscription.periodEnd))
    : null;

  const freeFeatures = t.raw("free.features") as string[];
  const isFreeUser = !activeSubscription;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 flex justify-center">
        <Tabs value={interval} onValueChange={value => setInterval(value as BillingInterval)}>
          <TabsList className="h-10 rounded-full p-1">
            <TabsTrigger value="month" className="rounded-full px-5">{t("monthly")}</TabsTrigger>
            <TabsTrigger value="year" className="rounded-full px-5">
              {t("annual")}
              <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                {t("annualSave")}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Free tier — the anchor card */}
        <div className={cn(
          "flex flex-col rounded-2xl border bg-card p-6",
          user && isFreeUser && "border-primary",
        )}
        >
          <div className="flex h-7 items-center">
            <h3 className="text-xl font-semibold">{t("free.name")}</h3>
          </div>
          <div className="mt-5">
            <PriceTag amount={0} currency="usd" locale={locale} cycle={t("perMonth")} />
            <p className="mt-1 h-4 text-xs text-muted-foreground" />
          </div>
          <p className="mt-2 min-h-10 text-sm text-muted-foreground">{t("free.tagline")}</p>
          <div className="mt-5">
            {user && isFreeUser
              ? (
                  <Button variant="outline" className="h-11 w-full rounded-full" disabled>
                    {t("currentPlan")}
                  </Button>
                )
              : !user
                  ? (
                      <Button variant="outline" className="h-11 w-full rounded-full" asChild>
                        <Link href="/sign-up">{t("getStarted")}</Link>
                      </Button>
                    )
                  : <div className="h-11" />}
            <p className="mt-2 h-4" />
          </div>
          <div className="mt-4 flex-1">
            <FeatureList features={freeFeatures} icons={FREE_FEATURE_ICONS} />
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {t("haveSubscription")}
            {" "}
            <Link href="/dashboard/billing" className="underline underline-offset-2 hover:text-foreground">
              {t("billingHelp")}
            </Link>
          </p>
        </div>

        {subscriptionPlans.map((plan) => {
          const isCurrentPlan = isSamePlan(plan.name, activeSubscription?.plan);
          const isCurrent = isCurrentPlan && interval === currentInterval;
          const isIntervalSwitch = isCurrentPlan && interval !== currentInterval;
          const isDowngrade = !!currentPlan && plan.price < currentPlan.price;
          const isHighlighted = plan.name === highlightedPlan?.name;
          const features = t.raw(`plans.${plan.key}.features`) as string[];

          return (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 transition-shadow",
                isHighlighted
                  ? "border-primary/60 shadow-[0_0_50px_-12px] shadow-primary/35"
                  : isCurrentPlan
                    ? "border-primary"
                    : "hover:shadow-md",
              )}
            >
              <div className="flex h-7 items-center justify-between">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {isHighlighted && (
                  <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                    {t("recommended")}
                  </span>
                )}
                {isCurrentPlan && (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {t("currentPlan")}
                  </span>
                )}
              </div>

              <div className="mt-5">
                <PriceTag
                  amount={interval === "year" ? Math.round(plan.annualPrice / 12) : plan.price}
                  currency={plan.currency}
                  locale={locale}
                  cycle={t("perMonth")}
                />
                <p className="mt-1 h-4 text-xs text-muted-foreground">
                  {interval === "year" && t("billedAnnually")}
                </p>
              </div>

              <p className="mt-2 min-h-10 text-sm text-muted-foreground">{t(`plans.${plan.key}.description`)}</p>

              <div className="mt-5">
                <Button
                  variant={isHighlighted ? "default" : "secondary"}
                  className="h-11 w-full rounded-full font-medium"
                  onClick={() => handleSelect(plan)}
                  disabled={loadingPlan !== null || isCurrent}
                >
                  {loadingPlan === plan.name
                    ? t("redirecting")
                    : isCurrent
                      ? t("currentPlan")
                      : isIntervalSwitch
                        ? t("switchBilling")
                        : isDowngrade
                          ? t("downgrade")
                          : t("upgradeTo", { plan: plan.name })}
                </Button>
                <p className="mt-2 h-4 text-center text-xs text-primary">
                  {plan.freeTrialDays && isFreeUser && t("freeTrial", { days: plan.freeTrialDays })}
                </p>
              </div>

              <div className="mt-4 flex-1">
                {plan.includes && (
                  <p className="mb-3.5 text-sm font-medium">
                    {t("includesAll", { plan: plan.includes })}
                  </p>
                )}
                <FeatureList features={features} icons={plan.featureIcons} />
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={downgradeTarget !== null} onOpenChange={open => !open && setDowngradeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("downgradeTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {effectiveDate
                ? t("downgradeDescription", { plan: downgradeTarget?.name ?? "", date: effectiveDate })
                : t("downgradeDescriptionNoDate", { plan: downgradeTarget?.name ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("downgradeCancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (downgradeTarget) {
                  changePlan(downgradeTarget, true);
                }
                setDowngradeTarget(null);
              }}
            >
              {t("downgradeConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
