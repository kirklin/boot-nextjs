import { useTranslations } from "next-intl";
import { Actions } from "~/components/landing/actions";
import { BentoRow } from "~/components/landing/bento";
import { AiTile } from "~/components/landing/tiles/ai-tile";
import { AuthTile } from "~/components/landing/tiles/auth-tile";
import { DashboardTile } from "~/components/landing/tiles/dashboard-tile";
import { I18nTile } from "~/components/landing/tiles/i18n-tile";
import { PaymentsTile } from "~/components/landing/tiles/payments-tile";
import { StackTile } from "~/components/landing/tiles/stack-tile";
import { ThemingTile } from "~/components/landing/tiles/theming-tile";
import { TrimTile } from "~/components/landing/tiles/trim-tile";

/** The top of the homepage: the product in one headline, then its features as tiles. */
export function Features() {
  const t = useTranslations("HomePage.features");

  return (
    <section id="features" className="scroll-mt-12 pt-14 pb-24 sm:pt-20 sm:pb-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="text-lg font-semibold text-muted-foreground sm:text-xl">Boot Next.js</p>
            <h1 className="mt-2 max-w-4xl text-5xl/[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-6xl/[1.03] lg:text-7xl/[1.02] [&:lang(zh)]:tracking-normal">
              {t("title")}
            </h1>
          </div>
          <div className="max-w-sm lg:pb-1.5">
            <p className="text-[17px]/7 text-pretty text-muted-foreground">{t("description")}</p>
            <Actions className="mt-6 items-start justify-start sm:items-center" />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 sm:mt-14">
          <BentoRow>
            <AiTile />
            <TrimTile />
          </BentoRow>
          <BentoRow even>
            <AuthTile />
            <PaymentsTile />
            <DashboardTile />
          </BentoRow>
          <BentoRow>
            <ThemingTile />
            <I18nTile />
          </BentoRow>
          <BentoRow>
            <StackTile />
          </BentoRow>
        </div>
      </div>
    </section>
  );
}
