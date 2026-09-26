import { useTranslations } from "next-intl";
import { BentoTile, Scene } from "~/components/landing/bento";
import { BillingPreview } from "~/components/landing/tiles/billing-preview";
import { subscriptionPlans } from "~/lib/stripe/plans";

export function PaymentsTile() {
  const t = useTranslations("HomeFeatures.payments");
  const plan = subscriptionPlans.find(({ popular }) => popular) ?? subscriptionPlans[0];

  return (
    <BentoTile id="payments" eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <Scene className="bg-[linear-gradient(180deg,#e9f7ee,#f6fbf8)]">
        <BillingPreview
          plan={plan}
          action={plan.freeTrialDays ? t("trial", { days: plan.freeTrialDays }) : t("subscribe")}
        />
      </Scene>
    </BentoTile>
  );
}
