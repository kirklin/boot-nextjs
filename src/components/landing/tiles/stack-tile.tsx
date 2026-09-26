import type { StackApp } from "~/components/landing/tiles/app-icon";
import { useTranslations } from "next-intl";
import { BentoTile, Scene } from "~/components/landing/bento";
import { AppDock } from "~/components/landing/tiles/app-dock";
import { AppIcon } from "~/components/landing/tiles/app-icon";

const STACK: StackApp[] = [
  { name: "Next.js", icon: "i-[simple-icons--nextdotjs]", surface: "from-[#48484a] to-[#0a0a0a] text-white" },
  { name: "React", icon: "i-[simple-icons--react]", surface: "from-[#34455c] to-[#0e1520] text-[#61dafb]" },
  { name: "TypeScript", icon: "i-[simple-icons--typescript]", surface: "from-[#5aa0f5] to-[#2159c4] text-white" },
  { name: "Tailwind CSS", icon: "i-[simple-icons--tailwindcss]", surface: "from-[#67e3ff] to-[#0b93d6] text-white" },
  { name: "shadcn/ui", icon: "i-[simple-icons--shadcnui]", surface: "from-white to-[#dcdce2] text-black" },
  { name: "Better Auth", icon: "i-[simple-icons--betterauth]", surface: "from-[#a5a5ab] to-[#3a3a3e] text-white" },
  { name: "Drizzle", icon: "i-[simple-icons--drizzle]", surface: "from-[#e6ff8f] to-[#98c42c] text-[#17240a]" },
  { name: "Stripe", icon: "i-[simple-icons--stripe]", surface: "from-[#948eff] to-[#4a3fe0] text-white" },
  { name: "AI SDK", icon: "i-[simple-icons--vercel]", surface: "from-[#3a3a3c] to-black text-white" },
];

/** The stack as app icons: a home screen grid on narrow tiles, a dock on wide ones. */
export function StackTile() {
  const t = useTranslations("HomeFeatures.stack");

  return (
    <BentoTile id="stack" eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <Scene className="items-center justify-center bg-[#f1f4fa] bg-[radial-gradient(90%_110%_at_15%_0%,#d9e6f8,transparent_60%),radial-gradient(90%_110%_at_100%_100%,#ece2f6,transparent_60%)] p-6">
        <ul className="grid grid-cols-3 gap-x-8 gap-y-6 sm:gap-x-12 @2xl:hidden">
          {STACK.map(({ name, icon, surface }) => (
            <li key={name} className="flex flex-col items-center gap-2">
              <AppIcon icon={icon} surface={surface} className="size-16" />
              <span className="text-xs font-medium text-foreground/70">{name}</span>
            </li>
          ))}
        </ul>
        <div className="hidden pt-12 @2xl:flex">
          <AppDock apps={STACK} />
        </div>
      </Scene>
    </BentoTile>
  );
}
