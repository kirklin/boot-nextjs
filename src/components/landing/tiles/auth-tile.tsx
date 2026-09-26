import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { BentoTile, Scene } from "~/components/landing/bento";
import { glass } from "~/components/landing/glass";
import { cn } from "~/lib/utils";

const PROVIDERS = [
  { name: "Google", icon: "i-[logos--google-icon]" },
  { name: "GitHub", icon: "i-[simple-icons--github]" },
];

// Text fields sit flat in the page; only the buttons float.
const field = "flex h-12 items-center rounded-full bg-white/75 ring-1 ring-black/[0.07] ring-inset dark:bg-white/[0.06] dark:ring-white/10";

export function AuthTile() {
  const t = useTranslations("HomeFeatures.auth");
  const auth = useTranslations("Auth");

  return (
    <BentoTile id="auth" eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <Scene className="items-center justify-center bg-[linear-gradient(180deg,#e9f0fc,#f6f8fd)] p-6">
        <div aria-hidden className="flex w-full max-w-[17.5rem] flex-col items-center">
          <p className="text-[26px]/tight font-semibold tracking-[-0.02em] [&:lang(zh)]:tracking-normal">{auth("signInTitle")}</p>
          <div className="mt-6 flex w-full flex-col gap-2 text-[15px]">
            <p className={cn(field, "px-5")}>kirk@example.com</p>
            <p className={cn(field, "pr-1.5 pl-5 ring-brand/70 outline-4 outline-brand/20 dark:ring-brand/70")}>
              <span className="tracking-[0.18em]">••••••••••</span>
              <span className="ml-0.5 h-5 w-0.5 animate-caret-blink rounded-full bg-brand motion-reduce:animate-none" />
              <span className="ml-auto flex size-9 items-center justify-center rounded-full bg-foreground text-background">
                <ArrowRight className="size-4" />
              </span>
            </p>
          </div>
          <div className="mt-5 grid w-full grid-cols-2 gap-2">
            {PROVIDERS.map(({ name, icon }) => (
              <p key={name} className={cn(glass, "flex h-11 items-center justify-center gap-2 rounded-full text-[14px] font-medium")}>
                <span className={cn(icon, "size-4")} />
                {name}
              </p>
            ))}
          </div>
        </div>
      </Scene>
    </BentoTile>
  );
}
