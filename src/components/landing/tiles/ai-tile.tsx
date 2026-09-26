import { useTranslations } from "next-intl";
import { BentoTile, Scene } from "~/components/landing/bento";
import { AiChat } from "~/components/landing/tiles/ai-chat";

export function AiTile() {
  const t = useTranslations("HomeFeatures.ai");

  return (
    <BentoTile id="ai" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} wide visualClassName="min-h-[27rem]">
      <Scene className="bg-[#f5f5f9] bg-[radial-gradient(80%_100%_at_0%_0%,#ece6fd,transparent_65%),radial-gradient(80%_100%_at_100%_100%,#e2edfc,transparent_65%)]">
        <AiChat
          prompt={t("prompt")}
          assistant={t("assistant")}
          thinking={t("thinking")}
          answer={t("answer")}
          range={t("range")}
          steps={{ reasoning: t("reasoning"), tools: t("tools"), sources: t("sources") }}
        />
      </Scene>
    </BentoTile>
  );
}
