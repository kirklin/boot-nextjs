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
- PostgreSQL

### 安装

```bash
git clone https://github.com/kirklin/boot-nextjs.git
cd boot-nextjs
pnpm install
cp .env.example .env
pnpm drizzle-kit push
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可查看。

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
