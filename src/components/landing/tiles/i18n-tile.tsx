import { useTranslations } from "next-intl";
import { BentoTile, Scene } from "~/components/landing/bento";
import { LocaleStrategy } from "~/components/landing/tiles/locale-strategy";
import { localePrefix } from "~/lib/i18n/navigation";

export function I18nTile() {
  const t = useTranslations("HomeFeatures.i18n");

  return (
    <BentoTile id="i18n" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} wide>
      <Scene className="bg-[linear-gradient(180deg,#fdf3ea,#fbf8f5)]">
        <LocaleStrategy
          current={localePrefix}
          notes={{
            "never": t("notes.never"),
            "as-needed": t("notes.as-needed"),
            "always": t("notes.always"),
          }}
          languageLabel={t("language")}
          currentLabel={t("current")}
        />
      </Scene>
    </BentoTile>
  );
}
