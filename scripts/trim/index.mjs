#!/usr/bin/env node
/**
 * boot-nextjs trim tool — strip template features you don't need.
 *
 *   pnpm trim                       interactive
 *   pnpm trim --preset no-payments  keep auth + dashboard, remove Stripe
 *   pnpm trim --preset landing      marketing site only (no payments, auth, db)
 *   pnpm trim --dry-run             show what would happen
 *
 * Run this right after cloning, on a clean git tree. Every code patch is
 * anchored to the current source; if an anchor no longer matches, the tool
 * aborts before touching anything (use git to recover in the worst case).
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const REPLACEMENTS = path.join(ROOT, "scripts", "trim", "replacements");

// ---------------------------------------------------------------------------
// Feature manifests
// ---------------------------------------------------------------------------

/** Stripe subscriptions + one-time payments. */
const payments = {
  name: "payments",
  deletions: [
    "src/lib/stripe",
    "src/app/api/stripe",
    "src/app/[locale]/dashboard/billing",
    "src/app/[locale]/payment-result",
    "src/app/[locale]/pricing",
    "src/components/pricing.tsx",
  ],
  replacements: [
    { file: "src/app/[locale]/dashboard/page.tsx", from: "dashboard-page.tsx.tpl" },
  ],
  patches: [
    {
      file: "src/lib/auth/server.ts",
      find: /import \{ stripe \} from "@better-auth\/stripe";\n/,
      replace: "",
    },
    {
      file: "src/lib/auth/server.ts",
      find: /import \{ getStripePlans \} from "~\/lib\/stripe\/plans\.server";\n/,
      replace: "",
    },
    {
      file: "src/lib/auth/server.ts",
      find: /import \{ stripe as stripeClient \} from "~\/lib\/stripe\/server";\n/,
      replace: "",
    },
    {
      file: "src/lib/auth/server.ts",
      find: /import \{ handleStripeEvent \} from "~\/lib\/stripe\/webhook";\n/,
      replace: "",
    },
    {
      file: "src/lib/auth/server.ts",
      find: /import \{ account, jwks, session, subscription, user, verification \}/,
      replace: "import { account, jwks, session, user, verification }",
    },
    {
      file: "src/lib/auth/server.ts",
      find: /\n {8}subscription,(?=\n {6}\},)/,
      replace: "",
    },
    {
      file: "src/lib/auth/server.ts",
      find: / {2}if \(stripeClient && env\.STRIPE_WEBHOOK_SECRET\) \{[\s\S]*?Stripe features are disabled\."\);\n {2}\}\n\n/,
      replace: "",
    },
    {
      file: "src/lib/auth/client.ts",
      find: /import \{ stripeClient \} from "@better-auth\/stripe\/client";\n/,
      replace: "",
    },
    {
      file: "src/lib/auth/client.ts",
      find: / {4}stripeClient\(\{\n {6}subscription: true,\n {4}\}\),\n/,
      replace: "",
    },
    // customSession existed only to type user.stripeCustomerId — drop it.
    {
      file: "src/lib/auth/client.ts",
      find: /import type \{ auth \} from "~\/lib\/auth\/server";\n/,
      replace: "",
    },
    {
      file: "src/lib/auth/client.ts",
      find: /import \{ customSessionClient, jwtClient \} from "better-auth\/client\/plugins";/,
      replace: "import { jwtClient } from \"better-auth/client/plugins\";",
    },
    {
      file: "src/lib/auth/client.ts",
      find: / {4}customSessionClient<NonNullable<typeof auth>>\(\),\n/,
      replace: "",
    },
    {
      file: "src/lib/auth/server.ts",
      find: /import \{ customSession, jwt \} from "better-auth\/plugins";/,
      replace: "import { jwt } from \"better-auth/plugins\";",
    },
    {
      file: "src/lib/auth/server.ts",
      find: / {6}\/\/ The Stripe plugin populates user\.stripeCustomerId at runtime; this\n {6}\/\/ surfaces it in the inferred session type for API routes\.\n {6}customSession\(async \(\{ session, user: authUser \}\) => \{\n {8}return \{\n {10}session,\n {10}user: authUser as typeof authUser & \{ stripeCustomerId\?: string \| null \},\n {8}\};\n {6}\}, authOptions\),\n/,
      replace: "",
    },
    {
      file: "src/lib/db/schema.ts",
      find: /\nexport const subscription = pgTable\("subscription", \{[\s\S]*?\n\}\);\n\n\/\/ One-time purchases[\s\S]*?\n\}\);\n/,
      replace: "",
    },
    {
      file: "src/lib/db/schema.ts",
      find: / {2}stripeCustomerId: text\("stripe_customer_id"\)\.unique\(\),\n/,
      replace: "",
    },
    {
      file: "src/config/server.ts",
      find: / {2}STRIPE_SECRET_KEY: z\.string\(\)\.optional\(\),[\s\S]*?STRIPE_PRICE_LIFETIME: z\.string\(\)\.optional\(\),\n\n/,
      replace: "",
    },
    {
      file: "src/components/layout/header.tsx",
      find: / {4}\{ href: "\/pricing", label: t\("pricing"\) \},\n/,
      replace: "",
    },
    {
      file: "src/components/dashboard/dashboard-nav.tsx",
      find: / {2}\{\n {4}title: "Billing & Invoices",[\s\S]*?\n {2}\},\n/,
      replace: "",
    },
    {
      file: "src/app/[locale]/page.tsx",
      find: / {2}\{\n {4}icon: <CreditCard className="h-6 w-6" \/>,\n {4}title: "Payment Integration",[\s\S]*?\n {2}\},\n/,
      replace: "",
    },
    {
      file: "src/app/sitemap.ts",
      find: / {2}\{ path: "\/pricing", changeFrequency: "monthly", priority: 0\.8 \},\n/,
      replace: "",
    },
    {
      file: "src/app/robots.ts",
      find: /, "\/payment-result"\]/,
      replace: "]",
    },
    {
      file: "compose.yaml",
      find: /#\n# Optional Stripe webhook forwarding[\s\S]*?STRIPE_WEBHOOK_SECRET\n/,
      replace: "",
    },
    {
      file: "compose.yaml",
      find: /\n {2}# Forwards Stripe webhooks[\s\S]*?host-gateway"\n/,
      replace: "\n",
    },
    {
      file: ".env.example",
      find: /\n# -+\n# Payment with Stripe[\s\S]*$/,
      replace: "\n",
    },
    // README patches are best-effort: the docs evolve independently.
    {
      file: "README.md",
      find: /## Payments \(Stripe\)[\s\S]*?(?=\n## )/,
      replace: "",
      optional: true,
    },
    {
      file: "README.md",
      find: /\nTo test Stripe webhooks locally.*\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.md",
      find: /- \*\*Payments\*\* — Stripe integration built-in\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.md",
      find: /\| Payments +\| Stripe +\|\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /## 支付（Stripe）[\s\S]*?(?=\n## )/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /\n本地测试 Stripe Webhook.*\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /- \*\*支付系统\*\* — 内置 Stripe 支付集成\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /\| 支付 +\| Stripe +\|\n/,
      replace: "",
      optional: true,
    },
  ],
  removeDependencies: ["@better-auth/stripe", "stripe"],
  removeDevDependencies: [],
  removeScripts: ["stripe:listen"],
  removeLocaleNamespaces: ["Pricing", "Billing", "PaymentResult"],
  removeLocaleKeys: [["Header", "pricing"]],
  regenerateMigrations: true,
};

/** Auth + dashboard + database (turns the template into a static marketing site). */
const app = {
  name: "auth + dashboard + database",
  deletions: [
    "src/lib/auth",
    "src/lib/db",
    "src/app/api",
    "src/app/[locale]/(auth)",
    "src/app/[locale]/dashboard",
    "src/components/dashboard",
    "drizzle.config.ts",
    "compose.yaml",
  ],
  replacements: [
    { file: "src/proxy.ts", from: "proxy.ts.tpl" },
    { file: "src/components/layout/header.tsx", from: "header.tsx.tpl" },
  ],
  patches: [
    {
      file: "src/config/server.ts",
      find: / {2}BETTER_AUTH_SECRET: z\.string\(\)\.optional\(\),\n\n {2}GITHUB_CLIENT_ID: z\.string\(\)\.optional\(\),\n {2}GITHUB_CLIENT_SECRET: z\.string\(\)\.optional\(\),\n\n {2}GOOGLE_CLIENT_ID: z\.string\(\)\.optional\(\),\n {2}GOOGLE_CLIENT_SECRET: z\.string\(\)\.optional\(\),\n/,
      replace: "  // Add your server-side environment variables here.\n",
    },
    {
      file: "src/app/[locale]/page.tsx",
      find: / {2}\{\n {4}icon: <LayoutDashboard className="h-6 w-6" \/>,\n {4}title: "Dashboard Ready",[\s\S]*?\n {2}\},\n/,
      replace: "",
    },
    {
      file: "src/app/robots.ts",
      find: /const privatePages = \[[^\]]*\];/,
      replace: "const privatePages: string[] = [];",
    },
    {
      file: ".env.example",
      find: /\n# Matches the local Postgres[\s\S]*?# POSTGRES_PORT=5432\n/,
      replace: "\n",
    },
    {
      file: ".env.example",
      find: /\n# Better Auth configuration[\s\S]*?GOOGLE_CLIENT_SECRET=""\n/,
      replace: "\n",
    },
    // Best-effort README cleanup; review the READMEs afterwards.
    {
      file: "README.md",
      find: /- \*\*Authentication\*\* — Secure auth with \[Better Auth\]\(https:\/\/www\.better-auth\.com\/\)\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.md",
      find: /- \*\*Database\*\* — PostgreSQL \+ \[Drizzle ORM\]\(https:\/\/orm\.drizzle\.team\/\)\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.md",
      find: /- Docker \(for the local PostgreSQL\).*\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.md",
      find: /pnpm db:up.*\npnpm db:migrate.*\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.md",
      find: /\nUseful database scripts:\n[\s\S]*?Drizzle Studio\s+\|\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.md",
      find: /\nIf port 5432 is already in use.*\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /- \*\*身份认证\*\*.*\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /- \*\*数据库\*\*.*\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /- Docker（用于本地 PostgreSQL）.*\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /pnpm db:up.*\npnpm db:migrate.*\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /\n常用数据库脚本：\n[\s\S]*?浏览数据库\s+\|\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /\n如果本机 5432 端口已被占用.*\n/,
      replace: "",
      optional: true,
    },
  ],
  removeDependencies: ["better-auth", "drizzle-orm", "postgres"],
  removeDevDependencies: ["drizzle-kit"],
  removeScripts: ["db:up", "db:down", "db:reset", "db:push", "db:migrate", "db:studio"],
  removeLocaleNamespaces: ["Auth", "UserNav", "Profile"],
  removeLocaleKeys: [
    ["Header", "signIn"],
    ["Header", "signUp"],
    ["Header", "profile"],
    ["Header", "signOut"],
    ["Header", "dashboard"],
  ],
  regenerateMigrations: false,
};

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const yes = args.includes("--yes") || args.includes("-y");
const force = args.includes("--force");
const presetArg = args.includes("--preset") ? args[args.indexOf("--preset") + 1] : null;

function log(message) {
  console.log(message);
}

async function resolveFeatures() {
  if (presetArg) {
    if (presetArg === "no-payments") {
      return [payments];
    }
    if (presetArg === "landing") {
      return [payments, app];
    }
    console.error(`Unknown preset "${presetArg}". Use --preset no-payments | landing`);
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  log("boot-nextjs trim — remove template features you don't need.\n");
  const wantsApp = (await rl.question("Keep auth + dashboard + database? [Y/n] ")).trim().toLowerCase();
  const keepApp = wantsApp === "" || wantsApp.startsWith("y");
  let keepPayments = false;
  if (keepApp) {
    const wantsPayments = (await rl.question("Keep Stripe payments? [Y/n] ")).trim().toLowerCase();
    keepPayments = wantsPayments === "" || wantsPayments.startsWith("y");
  } else {
    log("Payments require auth + database, so they will be removed too.");
  }
  rl.close();

  const features = [];
  if (!keepPayments) {
    features.push(payments);
  }
  if (!keepApp) {
    features.push(app);
  }
  return features;
}

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

function assertCleanGitTree() {
  try {
    const status = execSync("git status --porcelain", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    if (status && !force) {
      console.error("Your git tree has uncommitted changes. Commit or stash them first (or pass --force).");
      process.exit(1);
    }
  } catch {
    if (!force) {
      console.error("Not a git repository. Pass --force to trim anyway (there is no undo without git).");
      process.exit(1);
    }
  }
}

function applyDeletions(feature) {
  for (const target of feature.deletions) {
    const abs = path.join(ROOT, target);
    if (!fs.existsSync(abs)) {
      log(`  ~ already gone: ${target}`);
      continue;
    }
    log(`  - delete ${target}`);
    if (!dryRun) {
      fs.rmSync(abs, { recursive: true });
    }
  }
}

function applyReplacements(feature) {
  for (const { file, from } of feature.replacements) {
    log(`  ~ replace ${file}`);
    if (!dryRun) {
      fs.copyFileSync(path.join(REPLACEMENTS, from), path.join(ROOT, file));
    }
  }
}

function applyPatches(feature) {
  for (const patch of feature.patches) {
    const abs = path.join(ROOT, patch.file);
    if (!fs.existsSync(abs)) {
      if (patch.optional) {
        continue;
      }
      console.error(`  ! ${patch.file} not found (required patch)`);
      process.exit(1);
    }
    const content = fs.readFileSync(abs, "utf8");
    if (!patch.find.test(content)) {
      if (patch.optional) {
        log(`  ~ skip optional patch (${patch.file}: anchor not found)`);
        continue;
      }
      console.error(`  ! anchor not found in ${patch.file}:\n    ${patch.find}`);
      console.error("  The template source has drifted from the trim manifest. Aborting — nothing else was changed in this step; use git to reset any partial changes.");
      process.exit(1);
    }
    log(`  * patch ${patch.file}`);
    if (!dryRun) {
      fs.writeFileSync(abs, content.replace(patch.find, patch.replace));
    }
  }
}

function trimLocales(feature) {
  for (const localeFile of ["src/locales/en.json", "src/locales/zh.json"]) {
    const abs = path.join(ROOT, localeFile);
    const data = JSON.parse(fs.readFileSync(abs, "utf8"));
    for (const namespace of feature.removeLocaleNamespaces) {
      delete data[namespace];
    }
    for (const [namespace, key] of feature.removeLocaleKeys) {
      if (data[namespace]) {
        delete data[namespace][key];
      }
    }
    log(`  * clean ${localeFile}`);
    if (!dryRun) {
      fs.writeFileSync(abs, `${JSON.stringify(data, null, 2)}\n`);
    }
  }
}

function trimPackageJson(feature) {
  const abs = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(abs, "utf8"));
  for (const dep of feature.removeDependencies) {
    delete pkg.dependencies?.[dep];
  }
  for (const dep of feature.removeDevDependencies) {
    delete pkg.devDependencies?.[dep];
  }
  for (const script of feature.removeScripts) {
    delete pkg.scripts?.[script];
  }
  log("  * clean package.json");
  if (!dryRun) {
    fs.writeFileSync(abs, `${JSON.stringify(pkg, null, 2)}\n`);
  }
}

// Trim-section anchors for README self-cleanup.
const TRIM_DOC_SECTIONS = [
  ["README.md", /### Trim the template\n[\s\S]*?(?=\n### |\n## )/],
  ["README.zh-CN.md", /### 按需精简模板\n[\s\S]*?(?=\n### |\n## )/],
];

function removeTrimTool() {
  log("  - delete scripts/trim (self-removal)");
  if (dryRun) {
    return;
  }
  fs.rmSync(path.join(ROOT, "scripts", "trim"), { recursive: true });
  const scriptsDir = path.join(ROOT, "scripts");
  if (fs.existsSync(scriptsDir) && fs.readdirSync(scriptsDir).length === 0) {
    fs.rmSync(scriptsDir, { recursive: true });
  }
  const pkgPath = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  delete pkg.scripts?.trim;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  // Drop the trim section from the READMEs (best effort).
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

function run(command, { allowFailure = false, env = {} } = {}) {
  log(`  $ ${command}`);
  if (dryRun) {
    return true;
  }
  try {
    execSync(command, { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } });
    return true;
  } catch {
    if (!allowFailure) {
      process.exit(1);
    }
    return false;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const features = await resolveFeatures();

if (features.length === 0) {
  log("Nothing to trim — keeping the full template.");
  process.exit(0);
}

if (!dryRun) {
  assertCleanGitTree();
}

log(`\nRemoving: ${features.map(f => f.name).join(", ")}${dryRun ? " (dry run)" : ""}\n`);

if (!yes && !dryRun) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const confirmed = (await rl.question("This deletes files permanently (git can restore them). Continue? [y/N] "))
    .trim()
    .toLowerCase()
    .startsWith("y");
  rl.close();
  if (!confirmed) {
    log("Aborted.");
    process.exit(0);
  }
}

const removingApp = features.includes(app);

for (const feature of features) {
  log(`\n[${feature.name}]`);
  applyDeletions(feature);
  applyReplacements(feature);
  applyPatches(feature);
  trimLocales(feature);
  trimPackageJson(feature);
}

// Regenerate drizzle migrations for the slimmer schema (still using the db).
if (!removingApp && features.some(f => f.regenerateMigrations)) {
  log("\n[migrations]");
  log("  - delete src/lib/db/migrations");
  if (!dryRun) {
    fs.rmSync(path.join(ROOT, "src/lib/db/migrations"), { recursive: true, force: true });
  }
}

log("\n[cleanup]");
// Generated route types under .next reference the deleted pages and would
// fail the type check below; they are rebuilt on the next dev/build.
log("  - delete .next and tsconfig.tsbuildinfo (stale generated types)");
if (!dryRun) {
  fs.rmSync(path.join(ROOT, ".next"), { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, "tsconfig.tsbuildinfo"), { force: true });
}
removeTrimTool();
run("pnpm install");
if (!removingApp && features.some(f => f.regenerateMigrations)) {
  const ok = run("pnpm exec drizzle-kit generate", {
    allowFailure: true,
    // drizzle.config.ts needs a DATABASE_URL to load; generate never connects.
    env: { DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://localhost:5432/placeholder" },
  });
  if (!ok) {
    log("  ! could not regenerate migrations — run: DATABASE_URL=... pnpm exec drizzle-kit generate");
  }
}
run("pnpm lint:fix", { allowFailure: true });
run("pnpm exec tsc --noEmit");

log(`\nDone. Trimmed: ${features.map(f => f.name).join(", ")}.`);
log("Review the diff (git diff), the READMEs, and run `pnpm dev` to check the result.");
