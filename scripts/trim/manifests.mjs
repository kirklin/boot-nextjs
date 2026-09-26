/**
 * Feature manifests: everything the trim tool needs to remove a feature —
 * files to delete, anchored code patches, dependencies, locale keys, docs.
 *
 * Every non-optional patch is validated against the source before anything
 * is written; if the template drifts, the tool reports it and changes nothing.
 */

/** Vendored ai-elements component library + Vercel AI SDK dependencies. */
export const ai = {
  name: "ai",
  title: "AI components",
  hint: "ai-elements library, Vercel AI SDK, streamdown",
  requires: [],
  deletions: [
    "src/components/ai-elements",
    "src/components/landing/tiles/ai-tile.tsx",
    "src/components/landing/tiles/ai-chat.tsx",
  ],
  replacements: [],
  patches: [
    {
      file: "src/components/landing/features.tsx",
      find: / {12}<AiTile \/>\n/,
      replace: "",
    },
    {
      file: "src/components/landing/features.tsx",
      find: /import \{ AiTile \} from "~\/components\/landing\/tiles\/ai-tile";\n/,
      replace: "",
    },
    {
      file: "src/components/landing/tiles/stack-tile.tsx",
      find: / {2}\{ name: "AI SDK", [^\n]*\},\n/,
      replace: "",
    },
    {
      file: "src/components/layout/site-menu.tsx",
      find: / {2}\{ key: "ai", [^\n]*\},\n/,
      replace: "",
    },
    // Best-effort README cleanup.
    {
      file: "README.md",
      find: /- \*\*AI SDK\*\* — Vercel AI SDK for streaming LLM responses\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.md",
      find: /\| AI +\| Vercel AI SDK +\|\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /- \*\*AI SDK\*\* — Vercel AI SDK，支持流式 LLM 响应\n/,
      replace: "",
      optional: true,
    },
    {
      file: "README.zh-CN.md",
      find: /\| AI +\| Vercel AI SDK +\|\n/,
      replace: "",
      optional: true,
    },
  ],
  removeDependencies: [
    "ai",
    "streamdown",
    "@streamdown/cjk",
    "@streamdown/code",
    "@streamdown/math",
    "@streamdown/mermaid",
    "tokenlens",
    "use-stick-to-bottom",
    "ansi-to-react",
    "react-jsx-parser",
    "@xyflow/react",
    "media-chrome",
    "shiki",
    "@rive-app/react-webgl2",
    "@radix-ui/react-use-controllable-state",
  ],
  removeDevDependencies: [],
  removeScripts: [],
  removeLocaleNamespaces: [],
  removeLocaleKeys: [["HomeFeatures", "ai"], ["SiteMenu", "ai"]],
  regenerateMigrations: false,
};

/** Stripe subscriptions + one-time payments. */
export const payments = {
  name: "payments",
  title: "Stripe payments",
  hint: "subscriptions, one-time checkout, billing UI",
  requires: ["app"],
  deletions: [
    "src/lib/stripe",
    "src/app/api/stripe",
    "src/app/[locale]/dashboard/billing",
    "src/app/[locale]/payment-result",
    "src/app/[locale]/pricing",
    "src/components/pricing.tsx",
    "src/components/landing/tiles/payments-tile.tsx",
    "src/components/landing/tiles/billing-preview.tsx",
    "scripts/stripe-seed.mjs",
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
      file: "src/components/landing/features.tsx",
      find: / {12}<PaymentsTile \/>\n/,
      replace: "",
    },
    {
      file: "src/components/landing/features.tsx",
      find: /import \{ PaymentsTile \} from "~\/components\/landing\/tiles\/payments-tile";\n/,
      replace: "",
    },
    {
      file: "src/components/landing/tiles/stack-tile.tsx",
      find: / {2}\{ name: "Stripe", [^\n]*\},\n/,
      replace: "",
    },
    {
      file: "src/components/layout/site-menu.tsx",
      find: / {2}\{ key: "billing", [^\n]*\},\n/,
      replace: "",
    },
    {
      file: "src/components/layout/site-menu.tsx",
      find: / {2}\{ key: "pricing", [^\n]*\},\n/,
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
  removeScripts: ["stripe:listen", "stripe:seed"],
  removeLocaleNamespaces: ["Pricing", "Billing", "PaymentResult"],
  removeLocaleKeys: [
    ["Header", "pricing"],
    ["HomeFeatures", "payments"],
    ["SiteMenu", "billing"],
    ["SiteMenu", "pricing"],
  ],
  regenerateMigrations: true,
};

/** Auth + dashboard + database (removing it turns the template into a static site). */
export const app = {
  name: "app",
  title: "Auth + dashboard + database",
  hint: "better-auth, PostgreSQL/drizzle, dashboard pages",
  requires: [],
  deletions: [
    "src/lib/auth",
    "src/lib/db",
    "src/app/api",
    "src/app/[locale]/(auth)",
    "src/app/[locale]/dashboard",
    "src/components/dashboard",
    "src/components/landing/tiles/auth-tile.tsx",
    "src/components/landing/tiles/dashboard-tile.tsx",
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
    // The homepage row of the auth, billing and dashboard tiles (billing is gone already: it requires this feature).
    {
      file: "src/components/landing/features.tsx",
      find: / {10}<BentoRow even>\n {12}<AuthTile \/>\n(?: {12}<PaymentsTile \/>\n)? {12}<DashboardTile \/>\n {10}<\/BentoRow>\n/,
      replace: "",
    },
    {
      file: "src/components/landing/features.tsx",
      find: /import \{ AuthTile \} from "~\/components\/landing\/tiles\/auth-tile";\n/,
      replace: "",
    },
    {
      file: "src/components/landing/features.tsx",
      find: /import \{ DashboardTile \} from "~\/components\/landing\/tiles\/dashboard-tile";\n/,
      replace: "",
    },
    {
      file: "src/components/layout/site-menu.tsx",
      find: / {2}\{ key: "auth", [^\n]*\},\n/,
      replace: "",
    },
    {
      file: "src/components/layout/site-menu.tsx",
      find: / {2}\{ key: "dashboard", [^\n]*\},\n/,
      replace: "",
    },
    {
      file: "src/components/landing/tiles/stack-tile.tsx",
      find: / {2}\{ name: "Better Auth", [^\n]*\},\n/,
      replace: "",
    },
    {
      file: "src/components/landing/tiles/stack-tile.tsx",
      find: / {2}\{ name: "Drizzle", [^\n]*\},\n/,
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
    ["HomeFeatures", "auth"],
    ["HomeFeatures", "dashboard"],
    ["SiteMenu", "auth"],
    ["SiteMenu", "dashboard"],
  ],
  regenerateMigrations: false,
};

/**
 * The trim tool's own tile on the homepage. It is removed along with the tool
 * (i.e. unless --keep-tool), after the selected features.
 */
export const trimTool = {
  name: "trim",
  title: "Trim tool",
  hint: "homepage tile showing pnpm trim",
  requires: [],
  deletions: [
    "src/components/landing/tiles/trim-tile.tsx",
    "src/components/landing/tiles/trim-terminal.tsx",
  ],
  replacements: [],
  patches: [
    // The whole row when the AI tile is gone already, otherwise just this tile.
    {
      file: "src/components/landing/features.tsx",
      find: / {10}<BentoRow>\n {12}<TrimTile \/>\n {10}<\/BentoRow>\n| {12}<TrimTile \/>\n/,
      replace: "",
    },
    {
      file: "src/components/landing/features.tsx",
      find: /import \{ TrimTile \} from "~\/components\/landing\/tiles\/trim-tile";\n/,
      replace: "",
    },
    {
      file: "src/components/layout/site-menu.tsx",
      find: / {2}\{ key: "trim", [^\n]*\},\n/,
      replace: "",
    },
  ],
  removeDependencies: [],
  removeDevDependencies: [],
  removeScripts: [],
  removeLocaleNamespaces: [],
  removeLocaleKeys: [["HomeFeatures", "trim"], ["SiteMenu", "trim"]],
  regenerateMigrations: false,
};

/** All features, in the order they must be applied. */
export const FEATURES = [ai, payments, app];

/** Files several features (or the trim tool's tile) use: deleted once all of them are removed. */
export const SHARED_FILES = [
  { file: "src/components/landing/use-timeline.ts", usedBy: [ai.name, trimTool.name] },
];

/** Named presets for non-interactive use. */
export const PRESETS = {
  "no-payments": ["payments"],
  "landing": ["ai", "payments", "app"],
};

/** Trim-section anchors for README self-cleanup. */
export const TRIM_DOC_SECTIONS = [
  ["README.md", /### Trim the template\n[\s\S]*?(?=\n### |\n## )/],
  ["README.zh-CN.md", /### 按需精简模板\n[\s\S]*?(?=\n### |\n## )/],
];
