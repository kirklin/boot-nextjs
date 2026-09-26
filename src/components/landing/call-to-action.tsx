import { useTranslations } from "next-intl";
import { Actions } from "~/components/landing/actions";
import { CopyCommand } from "~/components/landing/copy-command";
import { REPOSITORY_URL } from "~/config/site";

export function CallToAction() {
  const t = useTranslations("HomePage.cta");

  return (
    <section className="reveal container mx-auto flex flex-col items-center px-4 py-24 text-center sm:py-32">
      <h2 className="max-w-3xl text-4xl/[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-6xl/[1.05] [&:lang(zh)]:tracking-normal">
        {t("title")}
      </h2>
      <p className="mt-5 max-w-xl text-lg/8 text-pretty text-muted-foreground">{t("description")}</p>
      <div className="mt-10">
        <Actions />
      </div>
      <div className="mt-12 flex w-full justify-center">
        <CopyCommand command={`git clone ${REPOSITORY_URL}`} />
      </div>
    </section>
  );
}
