<div align="center">

<img src="./public/banner.png" alt="Boot Next.js" width="100%" />

<br />

**English** | [简体中文](./README.zh-CN.md)

</div>

<br />

# Boot Next.js

A modern Next.js starter template built for ai SaaS applications.

## Features

- **Next.js 16** — App Router, Turbopack, Server Actions, React 19
- **Authentication** — Secure auth with [Better Auth](https://www.better-auth.com/)
- **Payments** — Stripe integration built-in
- **Database** — PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/)
- **AI SDK** — Vercel AI SDK for streaming LLM responses
- **UI Components** — [shadcn/ui](https://ui.shadcn.com/) + Radix UI
- **Internationalization** — [next-intl](https://next-intl.dev/) for multi-language support
- **Type Safe** — End-to-end TypeScript + Zod validation
- **Code Quality** — ESLint with [@kirklin/eslint-config](https://github.com/kirklin/eslint-config)
- **Dark Mode** — next-themes with system preference detection

## Tech Stack

| Category   | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 16, React 19    |
| Language   | TypeScript 5.9          |
| Styling    | Tailwind CSS 4          |
| UI         | shadcn/ui, Radix UI     |
| Database   | PostgreSQL, Drizzle ORM |
| Auth       | Better Auth             |
| Payments   | Stripe                  |
| AI         | Vercel AI SDK           |
| Validation | Zod                     |
| i18n       | next-intl               |
| Animation  | Framer Motion           |
| Charts     | Recharts                |

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- Docker (for the local PostgreSQL) — or your own PostgreSQL instance

### Setup

```bash
git clone https://github.com/kirklin/boot-nextjs.git
cd boot-nextjs
pnpm install
cp .env.example .env
pnpm db:up      # start local PostgreSQL via Docker (compose.yaml)
pnpm db:migrate # apply database migrations
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Everything — auth, subscriptions, invoices — runs against the local database; no cloud services required.

Useful database scripts:

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `pnpm db:up`      | Start the local PostgreSQL container           |
| `pnpm db:down`    | Stop it                                        |
| `pnpm db:reset`   | Wipe the database and start fresh              |
| `pnpm db:migrate` | Apply SQL migrations                           |
| `pnpm db:push`    | Push the drizzle schema directly (prototyping) |
| `pnpm db:studio`  | Browse the database with Drizzle Studio        |

If port 5432 is already in use, set `POSTGRES_PORT=5433` in `.env` and update `DATABASE_URL` to match.

To test Stripe webhooks locally, run `pnpm stripe:listen` (Dockerized Stripe CLI; requires `STRIPE_SECRET_KEY` in `.env`) and copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.

### Trim the template

Don't need everything? Right after cloning, run:

```bash
pnpm trim
```

An interactive picker lets you choose which features to keep — AI components, Stripe payments, auth + dashboard + database. The tool validates the whole change set before touching a single file, then deletes the code, removes the dependencies, cleans env/config/locales/docs, regenerates migrations where needed, verifies the result with ESLint + TypeScript, and removes itself only after everything passes.

- `pnpm trim --remove ai` — drop the AI component library and its 15 dependencies
- `pnpm trim --remove payments` (or `--preset no-payments`) — keep auth + dashboard, remove Stripe
- `pnpm trim --preset landing` — marketing site only (removes AI, payments, auth, database)
- add `--dry-run` to preview the plan without changing anything

## Internationalization & SEO

Locale routing is controlled by **one line** in [`src/lib/i18n/navigation.ts`](src/lib/i18n/navigation.ts):

```ts
export const localePrefix: "always" | "as-needed" | "never" = "never";
```

- **`never`** (default) — one clean URL for all locales, language from the `NEXT_LOCALE` cookie / `Accept-Language`. The right fit for app-first products (dashboard, payments); note search engines then index a single language version of the public pages. Old prefixed links keep working: `/zh/pricing` redirects to `/pricing` and sets the locale cookie.
- **`as-needed`** — default locale unprefixed (`/pricing`), others prefixed (`/zh/pricing`). Switch to this when multilingual SEO for your marketing pages matters — hreflang + sitemap alternates light up automatically.
- **`always`** — every locale prefixed (`/en/pricing`, `/zh/pricing`).
- **Domain-based** (`example.com` / `example.cn`) — uncomment the `domains` config in the same file.

Everything downstream adapts automatically: navigation, middleware redirects, canonicals, hreflang alternates, and the sitemap all derive URLs from this config via next-intl's `getPathname`.

SEO comes wired up: per-page `canonical` + `hreflang` link tags (incl. `x-default`), hreflang `Link` response headers from the middleware, a locale-aware [`sitemap.ts`](src/app/sitemap.ts) with alternate-language entries, `og:locale`, and `noindex` + robots disallow for auth/dashboard/payment pages. One rule keeps it working: always use `Link`/`useRouter`/`redirect` from `~/lib/i18n/navigation` (never `next/link`/`next/navigation` directly) with unprefixed paths — the wrappers add the right prefix for the active strategy.

## Payments (Stripe)

Billing is built on [Stripe Checkout](https://docs.stripe.com/payments/checkout) and the [`@better-auth/stripe`](https://better-auth.com/docs/plugins/stripe) plugin — subscriptions, the Billing Portal, one-time purchases, and webhooks are preconfigured.

### Setup

1. **API keys** — set `STRIPE_SECRET_KEY` from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
2. **Webhook** — create an endpoint for `https://<your-domain>/api/auth/stripe/webhook` subscribed to `checkout.session.*` and `customer.subscription.*` events, and set `STRIPE_WEBHOOK_SECRET`. For local development:

   ```bash
   stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
   ```

3. **Prices** — run `pnpm stripe:seed`: it creates the products, monthly/annual prices, and configures the Billing Portal (plan switching with immediate invoicing) in one go, then prints the `STRIPE_PRICE_*` lines for your `.env`. Idempotent — safe to re-run. Plan metadata lives in `src/lib/stripe/plans.ts`; price IDs are mapped in `src/lib/stripe/plans.server.ts`.
4. **Payment methods** — enable cards, wallets, Alipay, WeChat Pay, Link, etc. in [Dashboard → Payment methods](https://dashboard.stripe.com/settings/payment_methods). Checkout offers every enabled method that matches the currency and customer location — no code changes needed.

### Billing behavior (industry defaults)

- **Upgrades are immediate**: the prorated difference is charged right away and produces an invoice (Billing Portal confirmation, `always_invoice`).
- **Downgrades take effect at period end**: the app schedules the switch (no refunds or credit-balance surprises); the billing page shows the pending change with a one-click cancel.
- **Failed payments are visible**: `past_due`/`unpaid` subscriptions surface a warning banner with an "update payment method" shortcut instead of silently showing the free plan.
- **Annual billing** with a built-in "2 months free" toggle on the pricing page, and a **14-day free trial** on the popular plan (`freeTrialDays` in `plans.ts`).

### What's included

- **Subscriptions** — checkout, plan changes, cancel/resume, invoice history; state is synced to the `subscription` table by the plugin's webhook handler.
- **One-time payments** — `POST /api/stripe/checkout` with a product key from `src/lib/stripe/products.ts` (`mode: "payment"`, supports payment methods that don't allow recurring billing). Completed purchases are recorded in the `payment` table, including async payment methods.

Use [test cards](https://docs.stripe.com/testing) (e.g. `4242 4242 4242 4242`) while in test mode.

## Project Structure

```
src/
├── app/             # App Router pages & API routes
│   ├── [locale]/    # i18n dynamic routes
│   └── api/         # API routes
├── components/      # Reusable UI components
├── config/          # Application configuration
├── data/            # Data layer & constants
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── locales/         # i18n translation files
└── styles/          # Global styles
```

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `pnpm dev`      | Start dev server with Turbopack |
| `pnpm build`    | Build for production            |
| `pnpm start`    | Start production server         |
| `pnpm lint`     | Run ESLint                      |
| `pnpm lint:fix` | Fix ESLint errors               |
| `pnpm test`     | Run tests with Vitest           |
| `pnpm ui`       | Add shadcn/ui components        |

## Contributing

Contributions are welcome. Please fork the repo, create a feature branch, and submit a PR.

## License

[MIT](./LICENSE) © 2025-PRESENT [Kirk Lin](https://github.com/kirklin)
