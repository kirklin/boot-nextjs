import type { TrimPlan } from "~/components/landing/tiles/trim-terminal";
import { useTranslations } from "next-intl";
import { BentoTile, Scene } from "~/components/landing/bento";
import { TrimTerminal } from "~/components/landing/tiles/trim-terminal";
import packageJson from "../../../../package.json";
import { ai, FEATURES, SHARED_FILES, trimTool } from "../../../../scripts/trim/manifests.mjs";

/**
 * The summary `pnpm trim` prints for removing AI components on the untouched
 * template, derived from the manifests the same way computePlan does.
 */
function planForAi(): TrimPlan {
  const removed = [ai, trimTool];
  const patches = removed.flatMap(feature => feature.patches);
  const namespaces = removed.flatMap(feature => feature.removeLocaleNamespaces);
  const keys = removed.flatMap(feature => feature.removeLocaleKeys);
  // Patched files, plus the en/zh locale files when keys go and the always rewritten package.json.
  const files = new Set([...patches.map(({ file }) => file), ...(namespaces.length + keys.length > 0 ? ["en", "zh"] : []), "package.json"]);
  const shared = SHARED_FILES.filter(({ usedBy }) => usedBy.every(name => removed.some(feature => feature.name === name)));
  return {
    deletions: removed.flatMap(feature => feature.deletions).length + shared.length,
    patches: patches.length,
    files: files.size,
    dependencies: ai.removeDependencies.filter(dependency => dependency in packageJson.dependencies).length,
    namespaces: namespaces.length,
    keys: keys.length,
  };
}

export function TrimTile() {
  const t = useTranslations("HomeFeatures.trim");

  return (
    <BentoTile id="trim" eyebrow="pnpm trim" title={t("title")} description={t("description")}>
      <Scene className="bg-[linear-gradient(180deg,#eceff4,#f5f6f9)]">
        <TrimTerminal features={FEATURES.map(({ title, hint }) => ({ title, hint }))} plan={planForAi()} />
      </Scene>
    </BentoTile>
  );
}
