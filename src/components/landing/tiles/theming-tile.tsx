import { useTranslations } from "next-intl";
import { BentoTile, Scene } from "~/components/landing/bento";
import { AppearancePicker } from "~/components/landing/tiles/appearance-picker";

export function ThemingTile() {
  const t = useTranslations("HomeFeatures.theming");

  return (
    <BentoTile id="theming" eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <Scene className="items-center justify-center bg-[linear-gradient(180deg,#f4f4f7,#ececf1)] p-6">
        <AppearancePicker label={t("appearance")} labels={{ light: t("light"), dark: t("dark"), system: t("auto") }} />
      </Scene>
    </BentoTile>
  );
}
