#!/usr/bin/env node
/**
 * boot-nextjs trim tool — strip template features you don't need.
 *
 *   pnpm trim                          interactive feature picker
 *   pnpm trim --remove ai,payments     remove specific features
 *   pnpm trim --preset landing         marketing site only
 *   pnpm trim --dry-run                validate + show the plan, change nothing
 *
 * How it works: the whole change set (deletions, anchored code patches,
 * dependency/locale/doc cleanups) is computed and validated in memory first;
 * only when every required anchor matches is anything written to disk. The
 * result is verified with pnpm install + ESLint + tsc, and only after a clean
 * verification does the tool remove itself.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { app, FEATURES, PRESETS, TRIM_DOC_SECTIONS } from "./manifests.mjs";
import { bold, confirm, cyan, dim, fail, green, heading, multiselect, note, step, yellow } from "./ui.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const REPLACEMENTS = path.join(ROOT, "scripts", "trim", "replacements");
const LOCALE_FILES = ["src/locales/en.json", "src/locales/zh.json"];

// ---------------------------------------------------------------------------
// CLI arguments
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const yes = args.includes("--yes") || args.includes("-y");
const force = args.includes("--force");
const verbose = args.includes("--verbose");
const keepTool = args.includes("--keep-tool");
const presetArg = args.includes("--preset") ? args[args.indexOf("--preset") + 1] : null;
const removeArg = args.includes("--remove") ? args[args.indexOf("--remove") + 1] : null;

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
${bold("boot-nextjs trim")} — strip template features you don't need.

Usage:
  pnpm trim                        interactive feature picker
  pnpm trim --remove <features>    comma-separated: ${FEATURES.map(f => f.name).join(", ")}
  pnpm trim --preset <name>        ${Object.keys(PRESETS).join(" | ")}

Options:
  --dry-run     validate anchors and print the plan, change nothing
  --yes, -y     skip the confirmation prompt
  --force       allow a dirty git tree / no git repository
  --keep-tool   don't remove scripts/trim afterwards
  --verbose     list every file in the plan
`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Feature selection
// ---------------------------------------------------------------------------

function featuresFromNames(names) {
  const known = new Map(FEATURES.map(f => [f.name, f]));
  const selected = new Set();
  for (const name of names) {
    const feature = known.get(name.trim());
    if (!feature) {
      fail(`Unknown feature "${name.trim()}". Available: ${FEATURES.map(f => f.name).join(", ")}`);
      process.exit(1);
    }
    selected.add(feature);
  }
  // Removing a dependency of another feature drags that feature along
  // (e.g. payments requires the app stack, so removing app removes payments).
  for (const feature of FEATURES) {
    if (feature.requires.some(dep => [...selected].some(s => s.name === dep))) {
      if (!selected.has(feature)) {
        note(`${feature.title} depends on a removed feature — removing it too.`);
        selected.add(feature);
      }
    }
  }
  // Keep manifest order: patches assume it.
  return FEATURES.filter(f => selected.has(f));
}

async function resolveFeatures() {
  if (presetArg) {
    const names = PRESETS[presetArg];
    if (!names) {
      fail(`Unknown preset "${presetArg}". Available: ${Object.keys(PRESETS).join(", ")}`);
      process.exit(1);
    }
    return featuresFromNames(names);
  }
  if (removeArg) {
    return featuresFromNames(removeArg.split(","));
  }

  heading("boot-nextjs trim");
  console.log(`${dim("Pick the features your project needs — the rest gets removed cleanly:")}\n${dim("code, dependencies, env vars, locales and docs. Nothing is written until you confirm.")}\n`);

  const keep = await multiselect("Which features do you want to keep?", FEATURES.map(feature => ({
    label: feature.title,
    hint: feature.hint,
    selected: true,
  })));

  const names = FEATURES.filter((_, i) => !keep[i]).map(f => f.name);
  if (names.length === 0) {
    return [];
  }
  return featuresFromNames(names);
}

// ---------------------------------------------------------------------------
// Plan phase — compute and validate the full change set in memory
// ---------------------------------------------------------------------------

function computePlan(features) {
  // Virtual file state: string = pending content, null = pending deletion.
  const vfs = new Map();
  const readVirtual = (rel) => {
    if (vfs.has(rel)) {
      return vfs.get(rel);
    }
    const abs = path.join(ROOT, rel);
    return fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
  };

  const plan = {
    features,
    deletions: [],
    writes: vfs,
    problems: [],
    optionalSkips: [],
    patchCount: 0,
    replacedFiles: [],
    removedDeps: [],
    removedDevDeps: [],
    removedScripts: [],
    removedNamespaces: [],
    removedKeys: [],
    regenerateMigrations: false,
    removingApp: features.some(f => f.name === app.name),
  };

  for (const feature of features) {
    for (const target of feature.deletions) {
      if (fs.existsSync(path.join(ROOT, target))) {
        plan.deletions.push(target);
        // Mark files under the deleted path so later patches skip them.
        vfs.set(target, null);
      }
    }

    for (const { file, from } of feature.replacements) {
      vfs.set(file, fs.readFileSync(path.join(REPLACEMENTS, from), "utf8"));
      plan.replacedFiles.push(file);
    }

    for (const patch of feature.patches) {
      const deleted = plan.deletions.some(d => patch.file === d || patch.file.startsWith(`${d}/`));
      if (deleted) {
        continue;
      }
      const content = readVirtual(patch.file);
      if (content === null) {
        if (!patch.optional) {
          plan.problems.push(`${patch.file}: file not found (required patch)`);
        }
        continue;
      }
      if (!patch.find.test(content)) {
        if (patch.optional) {
          plan.optionalSkips.push(`${patch.file}: ${patch.find.source.slice(0, 60)}…`);
        } else {
          plan.problems.push(`${patch.file}: anchor not found — /${patch.find.source.slice(0, 80)}…/`);
        }
        continue;
      }
      vfs.set(patch.file, content.replace(patch.find, patch.replace));
      plan.patchCount += 1;
    }

    for (const localeFile of LOCALE_FILES) {
      if (feature.removeLocaleNamespaces.length === 0 && feature.removeLocaleKeys.length === 0) {
        continue;
      }
      const data = JSON.parse(readVirtual(localeFile));
      for (const namespace of feature.removeLocaleNamespaces) {
        delete data[namespace];
      }
      for (const [namespace, key] of feature.removeLocaleKeys) {
        if (data[namespace]) {
          delete data[namespace][key];
        }
      }
      vfs.set(localeFile, `${JSON.stringify(data, null, 2)}\n`);
    }
    plan.removedNamespaces.push(...feature.removeLocaleNamespaces);
    plan.removedKeys.push(...feature.removeLocaleKeys.map(([ns, key]) => `${ns}.${key}`));

    const pkg = JSON.parse(readVirtual("package.json"));
    for (const dep of feature.removeDependencies) {
      if (pkg.dependencies?.[dep]) {
        delete pkg.dependencies[dep];
        plan.removedDeps.push(dep);
      }
    }
    for (const dep of feature.removeDevDependencies) {
      if (pkg.devDependencies?.[dep]) {
        delete pkg.devDependencies[dep];
        plan.removedDevDeps.push(dep);
      }
    }
    for (const script of feature.removeScripts) {
      if (pkg.scripts?.[script]) {
        delete pkg.scripts[script];
        plan.removedScripts.push(script);
      }
    }
    vfs.set("package.json", `${JSON.stringify(pkg, null, 2)}\n`);

    plan.regenerateMigrations ||= feature.regenerateMigrations;
  }

  plan.regenerateMigrations &&= !plan.removingApp;
  return plan;
}

function printPlan(plan) {
  const modified = [...plan.writes.entries()].filter(([, content]) => content !== null).map(([rel]) => rel);

  heading(`Removing: ${plan.features.map(f => f.title).join(" · ")}`);
  console.log(`  ${bold("delete")}   ${plan.deletions.length} files/directories`);
  console.log(`  ${bold("patch")}    ${plan.patchCount} anchored edits across ${new Set(modified).size} files${plan.replacedFiles.length ? ` (${plan.replacedFiles.length} rewritten)` : ""}`);
  if (plan.removedDeps.length || plan.removedDevDeps.length) {
    console.log(`  ${bold("deps")}     -${plan.removedDeps.length} dependencies${plan.removedDevDeps.length ? `, -${plan.removedDevDeps.length} dev` : ""}${plan.removedScripts.length ? `, -${plan.removedScripts.length} scripts` : ""}`);
  }
  if (plan.removedNamespaces.length || plan.removedKeys.length) {
    console.log(`  ${bold("locales")}  -${plan.removedNamespaces.length} namespaces, -${plan.removedKeys.length} keys (en/zh)`);
  }
  if (plan.regenerateMigrations) {
    console.log(`  ${bold("db")}       migrations regenerated for the slimmer schema`);
  }

  if (verbose) {
    console.log(`\n${dim("Deletions:")}`);
    plan.deletions.forEach(d => console.log(dim(`    - ${d}`)));
    console.log(`${dim("Modified:")}`);
    modified.forEach(m => console.log(dim(`    * ${m}`)));
    if (plan.removedDeps.length) {
      console.log(`${dim(`Dependencies: ${plan.removedDeps.join(", ")}`)}`);
    }
  }
  if (plan.optionalSkips.length) {
    note(`${plan.optionalSkips.length} optional doc cleanups skipped (anchors drifted) — review the READMEs afterwards.`);
  }
  console.log("");
}

// ---------------------------------------------------------------------------
// Apply + verify
// ---------------------------------------------------------------------------

function applyPlan(plan) {
  // Writes first, deletions last, so a directory deletion always wins.
  for (const [rel, content] of plan.writes) {
    if (content !== null) {
      fs.writeFileSync(path.join(ROOT, rel), content);
    }
  }
  for (const target of plan.deletions) {
    fs.rmSync(path.join(ROOT, target), { recursive: true, force: true });
  }
  if (plan.regenerateMigrations) {
    fs.rmSync(path.join(ROOT, "src/lib/db/migrations"), { recursive: true, force: true });
  }
  // Stale generated route types would fail the type check below.
  fs.rmSync(path.join(ROOT, ".next"), { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, "tsconfig.tsbuildinfo"), { force: true });
}

function runQuiet(command, env = {}) {
  return execSync(command, {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...env },
  });
}

function verify(plan) {
  const steps = [
    ["pnpm install", () => runQuiet("pnpm install")],
    ...(plan.regenerateMigrations
      ? [["regenerate database migrations", () => runQuiet("pnpm exec drizzle-kit generate", {
          // drizzle.config.ts needs a DATABASE_URL to load; generate never connects.
          DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://localhost:5432/placeholder",
        })]]
      : []),
    ["eslint --fix", () => runQuiet("pnpm lint:fix")],
    ["type check (tsc)", () => runQuiet("pnpm exec tsc --noEmit")],
  ];

  for (const [label, task] of steps) {
    try {
      step(label, task);
    } catch (error) {
      console.error(`\n${(error.stdout ?? "").toString()}${(error.stderr ?? "").toString()}`);
      fail(`"${label}" failed — output above.`);
      console.log(`
${bold("The trim itself is applied; only verification failed.")} The trim tool was kept so you can:
  • fix the issue, then re-check: ${cyan("pnpm lint:fix && pnpm exec tsc --noEmit")}
  • or restore everything:        ${cyan("git restore . && git clean -fd && pnpm install")}
`);
      process.exit(1);
    }
  }
}

function removeTrimTool() {
  fs.rmSync(path.join(ROOT, "scripts", "trim"), { recursive: true });
  const scriptsDir = path.join(ROOT, "scripts");
  if (fs.existsSync(scriptsDir) && fs.readdirSync(scriptsDir).length === 0) {
    fs.rmSync(scriptsDir, { recursive: true });
  }
  const pkgPath = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  delete pkg.scripts?.trim;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  for (const [file, pattern] of TRIM_DOC_SECTIONS) {
    const abs = path.join(ROOT, file);
    if (fs.existsSync(abs)) {
      const content = fs.readFileSync(abs, "utf8");
      if (pattern.test(content)) {
        fs.writeFileSync(abs, content.replace(pattern, ""));
      }
    }
  }
}

function assertCleanGitTree() {
  try {
    const status = runQuiet("git status --porcelain").toString().trim();
    if (status && !force) {
      fail("Your git tree has uncommitted changes. Commit or stash them first (or pass --force).");
      process.exit(1);
    }
  } catch {
    if (!force) {
      fail("Not a git repository. Pass --force to trim anyway (there is no undo without git).");
      process.exit(1);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const features = await resolveFeatures();

if (features.length === 0) {
  console.log(`${green("✓")} Keeping the full template — nothing to trim.`);
  process.exit(0);
}

const plan = computePlan(features);

if (plan.problems.length > 0) {
  fail("The template source has drifted from the trim manifest. Nothing was changed.");
  plan.problems.forEach(problem => console.error(`  ${yellow("!")} ${problem}`));
  console.error(`\n${dim("Fix the anchors in scripts/trim/manifests.mjs, then re-run.")}`);
  process.exit(1);
}

printPlan(plan);

if (dryRun) {
  console.log(`${green("✓")} Dry run — all required anchors match, nothing was changed.`);
  process.exit(0);
}

assertCleanGitTree();

if (!yes) {
  const confirmed = await confirm("Apply these changes? Files are deleted permanently (git can restore them).", false);
  if (!confirmed) {
    console.log("Aborted — nothing was changed.");
    process.exit(0);
  }
  console.log("");
}

step(`apply ${plan.deletions.length + plan.patchCount} changes`, () => applyPlan(plan));
verify(plan);

if (!keepTool) {
  step("remove trim tool (self-cleanup)", () => removeTrimTool());
}

heading(`✔ Done — removed: ${features.map(f => f.title).join(" · ")}`);
console.log(`  Next steps:
  • ${cyan("pnpm dev")} — check the result
  • review ${cyan("git diff")} and the READMEs
  • commit the trimmed template
`);
