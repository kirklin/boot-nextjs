<div align="center">

<img src="./public/banner.png" alt="Boot Next.js Banner" width="100%" />

<br />

[English](./README.md) | **简体中文**

</div>

<br />

一个为 AI SaaS 应用打造的现代 Next.js 启动模板

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 特性

- **Next.js 16** — App Router、Turbopack、Server Actions、React 19
- **身份认证** — 基于 [Better Auth](https://www.better-auth.com/) 的安全认证方案
- **支付系统** — 内置 Stripe 支付集成
- **数据库** — PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/)
- **AI SDK** — Vercel AI SDK，支持流式 LLM 响应
- **UI 组件** — [shadcn/ui](https://ui.shadcn.com/) + Radix UI
- **国际化** — [next-intl](https://next-intl.dev/) 多语言支持
- **类型安全** — 端到端 TypeScript + Zod 校验
- **代码质量** — ESLint 搭配 [@kirklin/eslint-config](https://github.com/kirklin/eslint-config)
- **深色模式** — next-themes 支持系统偏好自动检测

## 技术栈

| 分类   | 技术                    |
| ------ | ----------------------- |
| 框架   | Next.js 16、React 19    |
| 语言   | TypeScript 5.9          |
| 样式   | Tailwind CSS 4          |
| UI     | shadcn/ui、Radix UI     |
| 数据库 | PostgreSQL、Drizzle ORM |
| 认证   | Better Auth             |
| 支付   | Stripe                  |
| AI     | Vercel AI SDK           |
| 校验   | Zod                     |
| 国际化 | next-intl               |
| 动画   | Framer Motion           |
| 图表   | Recharts                |

## 快速开始

### 前置要求

- Node.js >= 18
- pnpm >= 9
- Docker（用于本地 PostgreSQL）——或自备 PostgreSQL 实例

### 安装

```bash
git clone https://github.com/kirklin/boot-nextjs.git
cd boot-nextjs
pnpm install
cp .env.example .env
pnpm db:up      # 通过 Docker 启动本地 PostgreSQL（compose.yaml）
pnpm db:migrate # 应用数据库迁移
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可查看。认证、订阅、发票等功能全部跑在本地数据库上，无需任何云服务。

常用数据库脚本：

| 命令              | 说明                                |
| ----------------- | ----------------------------------- |
| `pnpm db:up`      | 启动本地 PostgreSQL 容器            |
| `pnpm db:down`    | 停止容器                            |
| `pnpm db:reset`   | 清空数据库并重新开始                |
| `pnpm db:migrate` | 应用 SQL 迁移                       |
| `pnpm db:push`    | 直接推送 drizzle schema（原型开发） |
| `pnpm db:studio`  | 使用 Drizzle Studio 浏览数据库      |

如果本机 5432 端口已被占用，在 `.env` 中设置 `POSTGRES_PORT=5433` 并同步修改 `DATABASE_URL`。

本地测试 Stripe Webhook：运行 `pnpm stripe:listen`（Docker 化的 Stripe CLI，需要 `.env` 中的 `STRIPE_SECRET_KEY`），并把输出的 `whsec_...` 填入 `STRIPE_WEBHOOK_SECRET`。

### 按需精简模板

不需要全部功能？clone 后立即运行：

```bash
pnpm trim
```

交互式勾选要保留的功能——AI 组件、Stripe 支付、登录 + 后台 + 数据库。工具会先在内存中校验完整变更集（一个锚点失配都不会动任何文件），然后删除代码、清理依赖、环境变量、配置、翻译和文档，必要时重新生成数据库迁移，用 ESLint + TypeScript 验证通过后才自我删除。

- `pnpm trim --remove ai` — 移除 AI 组件库及其 15 个依赖
- `pnpm trim --remove payments`（或 `--preset no-payments`）— 保留登录和后台，移除 Stripe
- `pnpm trim --preset landing` — 纯展示站（移除 AI、支付、登录、数据库）
- 加 `--dry-run` 可预览计划而不做任何改动

## 国际化与 SEO

语言路由策略由 [`src/lib/i18n/navigation.ts`](src/lib/i18n/navigation.ts) 中的**一行代码**控制：

```ts
export const localePrefix: "always" | "as-needed" | "never" = "never";
```

- **`never`**（默认）— 所有语言共用一个干净 URL，语言由 `NEXT_LOCALE` cookie / `Accept-Language` 决定。最适合 app 优先的产品（后台、支付）；注意搜索引擎此时只会收录公开页面的一种语言版本。老的带前缀链接依然可用：访问 `/zh/pricing` 会重定向到 `/pricing` 并自动设置语言 cookie。
- **`as-needed`** — 默认语言无前缀（`/pricing`），其他语言带前缀（`/zh/pricing`）。当营销页需要多语言 SEO 时切到这个——hreflang 和 sitemap alternates 会自动点亮。
- **`always`** — 所有语言都带前缀（`/en/pricing`、`/zh/pricing`）。
- **独立域名**（`example.com` / `example.cn`）— 取消同文件中 `domains` 配置的注释即可。

下游一切自动适配：导航、中间件跳转、canonical、hreflang alternates、sitemap 全部通过 next-intl 的 `getPathname` 从这份配置推导 URL。

SEO 已全部接好：页面级 `canonical` + `hreflang` 标签（含 `x-default`）、中间件输出的 hreflang `Link` 响应头、多语言 [`sitemap.ts`](src/app/sitemap.ts)（带 alternate 语言条目）、`og:locale`，以及登录/后台/支付页的 `noindex` + robots 屏蔽。只需遵守一条纪律：内部跳转永远使用 `~/lib/i18n/navigation` 导出的 `Link`/`useRouter`/`redirect`（不要直接用 `next/link`/`next/navigation`），路径写裸路径，前缀由封装按当前策略自动补齐。

## 支付（Stripe）

支付体系基于 [Stripe Checkout](https://docs.stripe.com/payments/checkout) 和 [`@better-auth/stripe`](https://better-auth.com/docs/plugins/stripe) 插件构建——订阅、账单门户（Billing Portal）、一次性支付和 Webhook 均已预置。

### 配置步骤

1. **API 密钥** — 在 [Stripe Dashboard](https://dashboard.stripe.com/apikeys) 获取并设置 `STRIPE_SECRET_KEY`。
2. **Webhook** — 创建指向 `https://<你的域名>/api/auth/stripe/webhook` 的 Webhook 端点，订阅 `checkout.session.*` 和 `customer.subscription.*` 事件，并设置 `STRIPE_WEBHOOK_SECRET`。本地开发使用：

   ```bash
   stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
   ```

3. **价格** — 运行 `pnpm stripe:seed`：一键创建产品、月付/年付价格，并配置好账单门户（套餐切换 + 即时开票），然后打印出 `STRIPE_PRICE_*` 填入 `.env`。幂等，可安全重跑。套餐展示信息位于 `src/lib/stripe/plans.ts`，价格 ID 映射位于 `src/lib/stripe/plans.server.ts`。
4. **支付方式** — 在 [Dashboard → Payment methods](https://dashboard.stripe.com/settings/payment_methods) 中启用银行卡、钱包、支付宝、微信支付、Link 等。Checkout 会自动向用户展示所有已启用且匹配币种和地区的支付方式，无需改动代码。

### 计费行为（行业主流默认值）

- **升级即时生效**：立刻按比例扣差价并出发票（账单门户确认，`always_invoice`）。
- **降级期末生效**：应用内排定切换（没有退款和抵扣余额的困惑），账单页展示排定的变更并支持一键取消。
- **支付失败可见**：`past_due`/`unpaid` 订阅会显示醒目警告和"更新支付方式"入口，而不是悄悄显示为免费版。
- **年付折扣**：定价页内置月付/年付切换（"免 2 个月"），热门套餐带 **14 天免费试用**（`plans.ts` 的 `freeTrialDays`）。

### 内置能力

- **订阅** — 结账、套餐变更、取消/恢复、发票历史；订阅状态由插件的 Webhook 处理器同步到 `subscription` 表。
- **一次性支付** — 调用 `POST /api/stripe/checkout` 并传入 `src/lib/stripe/products.ts` 中的商品 key（`mode: "payment"`，支持不能用于订阅的支付方式，如微信支付）。支付完成后记录到 `payment` 表，异步支付方式（银行转账等）也会正确处理。

测试模式下可使用 [测试卡号](https://docs.stripe.com/testing)（如 `4242 4242 4242 4242`）。

## 项目结构

```
src/
├── app/             # App Router 页面 & API 路由
│   ├── [locale]/    # i18n 动态路由
│   └── api/         # API 路由
├── components/      # 可复用 UI 组件
├── config/          # 应用配置
├── data/            # 数据层 & 常量
├── hooks/           # 自定义 React Hooks
├── lib/             # 工具库
├── locales/         # i18n 翻译文件
└── styles/          # 全局样式
```

## 脚本

| 命令            | 说明                          |
| --------------- | ----------------------------- |
| `pnpm dev`      | 使用 Turbopack 启动开发服务器 |
| `pnpm build`    | 构建生产版本                  |
| `pnpm start`    | 启动生产服务器                |
| `pnpm lint`     | 运行 ESLint 检查              |
| `pnpm lint:fix` | 自动修复 ESLint 错误          |
| `pnpm test`     | 使用 Vitest 运行测试          |
| `pnpm ui`       | 添加 shadcn/ui 组件           |

## 贡献

欢迎贡献！请 Fork 本仓库，创建功能分支，然后提交 PR。

## 许可证

[MIT](./LICENSE) © 2025-至今 [Kirk Lin](https://github.com/kirklin)
