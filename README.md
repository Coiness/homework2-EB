# homework2-EB

这是一个示例电商商铺项目，基于 Next.js（App Router）和 TypeScript 构建，采用 TailwindCSS 与 shadcn/ui 组件库，主要用于学习前端架构、服务端渲染/客户端渲染、分页/筛选、以及本地购物车持久化等实践场景。

## 🔎 项目概述

- 商品列表（服务端渲染 + 分页、筛选、排序）
- 商品详情页（SKU 选择、图片画廊、SKU ↔ URL 同步）
- 购物车（localStorage + Zustand 状态管理）
- API 路由：`app/api/v1/*` 使用内存数据 `lib/data.ts` 作为演示数据源
- UI：`shadcn/ui` + TailwindCSS
- 开发/测试：MSW（Mock Service Worker）、Vitest

## 🔗 快速导航

- 商品列表：`/products`
- 商品详情：`/product/[id]`（例如：`/product/p1`）
- 购物车：`/cart`

## 🛠️ 安装与运行

先决条件

- Node.js 20.x 或更高
- npm 10.x 或更高

```powershell
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

构建与启动生产服务：

```powershell
npm run build
npm run start
```

打开 `http://localhost:3000` 访问项目。

## 📦 主要功能说明

- 服务端 API：
  - `GET /api/v1/products?page=1&pageSize=12&tags=xxx` — 支持分页、pageSize、tags 等筛选参数
  - `GET /api/v1/product/[id]` — 获取商品详情
  - `GET /api/v1/cart/[uid]`、`PUT/POST` — 购物车接口（演示）

- 前端：
  - 列表页：Server Component 渲染初始数据，URL 查询参数驱动过滤、分页、排序
  - 分页组件（Pagination）会更新 URL 的 `page` / `pageSize`，Server 端基于这些参数返回数据
  - 工具栏（Toolbar）控制排序和布局（grid / list）并更新 URL
  - 商品页面（Product Page）支持 SKU 与 URL 的双向同步，选择不同 SKU 会更新查询参数
  - 图片画廊使用 `next/image`，并通过 `sizes` 属性帮助浏览器加载合适尺寸图片
  - 购物车数据在 localStorage 中保存，使用 Zustand 做状态管理

## 🧪 测试与 Mock

- 使用 MSW 做开发/测试时的 API Mock
- 单元测试使用 Vitest，运行命令示例：

```powershell
npm test
# 或：
npm run test
```

## 💡 开发与代码约定

- 样式：TailwindCSS 与 shadcn UI 组件，样式入口由 `app/globals.css` 管理
- 状态管理：`store/` 下包含 Zustand store（`useStore.ts`, `useCartStore.ts`），购物车逻辑由 `useClientCart` 负责 localStorage 同步
- 类型：通用类型在 `types/` 下维护（例如：`types/product.ts`, `types/cart.ts`）
- 数据源：演示用数据集中在 `lib/data.ts`，便于演示和 Mock

## 🔭 建议的后续改进

- 将 `lib/data.ts` 换成真实数据库（例如：Vercel Postgres），并实现数据迁移脚本
- 增加用户认证以及后端持久化购物车
- 在 API 侧增加缓存（Edge / SSR 缓存）以提升性能
- 补充更多端到端/集成测试，覆盖分页、筛选、购物车等关键交互

---

如果你希望我把 README 做成中英双语、或者在首页添加交互式文档（比如「点击演示 SKU 到 URL」），告诉我你的优先级，我可以继续迭代。

# homework2-EB

这是一个示例电商商铺项目，基于 Next.js（App Router）和 TypeScript 构建，采用 TailwindCSS 与 shadcn/ui 组件库，主要用于学习前端架构、服务端渲染/客户端渲染、分页/筛选、及本地购物车持久化等实践场景。

## 🔎 项目概述

- 商品列表（在服务端渲染的基础上支持分页、筛选、排序）
- 商品详情页：SKU 选择、图片画廊、SKU 与 URL 的双向同步
- 购物车：基于 localStorage 的客户端持久化，使用 Zustand 管理状态
- API：`app/api/v1/*` 下含演示用的内存数据源（`lib/data.ts`）
- UI：使用 `shadcn/ui` 与 TailwindCSS 构建全局组件和系统样式
- 开发/测试：使用 MSW 和 Vitest 做 Mock 与单元测试

## 🧭 快速链接

- 商品列表：`/products`
- 商品详情：`/product/[id]`（示例：`/product/p1`）
- 购物车：`/cart`

## 🛠️ 安装与运行

先决条件

- Node.js 20 及以上
- npm 10 及以上

安装依赖并运行开发环境：

```powershell
npm install
npm run dev
```

构建并运行生产：

```powershell
npm run build
npm run start
```

在浏览器打开：`http://localhost:3000`。

## 📦 功能详解

- 服务端 API
  - `GET /api/v1/products?page=1&pageSize=12&tags=xxx`：支持分页、pageSize、tags 等筛选参数
  - `GET /api/v1/product/[id]`：获取商品详情
  - `GET /api/v1/cart/[uid]`、`POST/PUT`：购物车操作（演示）

- 前端 / UI 行为
  - 列表页：Server Component 渲染初始数据并支持 URL 查询参数（page、pageSize、tags、sort）
  - 分页组件会更新 URL 中的 `page` 和 `pageSize`，以触发服务器重新渲染并返回新的数据
  - 工具栏（Toolbar）支持排序与布局切换（grid / list），并可更新 URL
  - 商品详情页支持 SKU 与 URL 的同步（选中 SKU 后会变更查询参数）
  - 图片画廊使用 `next/image`，并通过 `sizes` 属性优化图片加载
  - 购物车保存在 localStorage（支持 uid），并且在页面间保持状态

## 🧪 测试与 Mock

- 开发时使用 MSW（Mock Service Worker）提供 API mock；测试使用 Vitest
- 运行测试：

```powershell
npm test
# 或
npm run test
```

## 💡 开发注意事项与约定

- 样式：TailwindCSS + shadcn 组件，样式入口 `app/globals.css`。
- 状态管理：`store/useStore.ts` 与 `store/useCartStore.ts`，购物车使用 `useClientCart` 包装的 localStorage。
- 类型：所有公共类型位于 `types/`（例如 `types/product.ts`, `types/cart.ts`）。
- 数据：演示数据位于 `lib/data.ts`，便于开发与 Mock。

## 🧭 后续改进建议

- 将内存数据迁移到生产数据库（例如：Vercel Postgres）并添加数据迁移脚本
- 添加用户认证与后端持久化购物车
- 为产品 API 添加缓存（边缘/SSR 缓存）或优化查询方式
- 添加更完善的测试用例，覆盖分页/筛选/购物车流程

---

如果你希望我把 README 进一步分为中文/英文双语或在首页添加实时演示（例如一次点击演示 SKU -> URL、Add to Cart 的流程），我可以继续迭代并实现这些改进。欢迎告诉我你更偏好的内容。

---

本 README 为项目当前状态的说明，若需扩展（测试、CI、贡献指南等），告诉我想要的细节即可，我会补充完整。

# homework2-EB

A sample e-commerce storefront built with Next.js (App Router), TypeScript, TailwindCSS and shadcn/ui — intended as a learning project for frontend architecture and features such as server-side rendering, client hydration, pagination, filtering, and local cart persistence.

## 🔎 Project Overview

- Products listing (server-rendered with server-side data fetch)
- Product detail page with SKU selection, image gallery and URL <-> SKU sync
- Client-side cart stored in localStorage with a Zustand store wrapper
- API routes under `app/api/v1/*` that use an in-memory `lib/data.ts` store for demo/mocking
- Global UI primitives using `shadcn/ui` components and TailwindCSS
- Pagination, filtering (including `tags`), and sorting on the server API
- Mock data and MSW used for development and tests

## 🧭 Quick Links

- Products listing: `/products`
- Product detail page: `/product/[id]` (e.g. `/product/p1`)
- Cart: `/cart`

## 🛠️ Setup & Run

Prerequisites

- Node.js 20.x+
- npm 10.x+

Install & start dev server:

```powershell
npm install
npm run dev
```

Build for production:

```powershell
npm run build
npm run start
```

Open http://localhost:3000.

## 📦 Features in Detail

- Server APIs
  - `GET /api/v1/products?page=1&pageSize=12&tags=xxxx` - paginated products with filters
  - `GET /api/v1/product/[id]` - product detail
  - `GET /api/v1/cart/[uid]` and `PUT/POST` for cart operations

- Client / UI
  - Product list pages are server-rendered with query params used for pagination, pageSize, filters (tags), and sort
  - Pagination component updates URL `page` and `pageSize` parameters so server re-renders data
  - Toolbar component controls sorting and layout
  - Product detail page supports SKU -> url sync; selecting a SKU will update the URL
  - Gallery uses `next/image` with `sizes` attribute for efficient image loading
  - Cart persisted in localStorage with an optional `uid` fallback

## 🧪 Tests & Mocking

- Uses MSW for mock API in tests & local dev
- Run unit tests and playback behavior using `npm test` / `vitest`

## 💡 Development Notes / Conventions

- CSS: Tailwind utilities with shadcn components. Styles in `app/globals.css`.
- State: `store/useStore.ts` and `store/useCartStore.ts` for local states; cart uses localStorage wrapped by `useClientCart`.
- Types in `types/*` (product.ts, cart.ts) used across components and API.
- Data: `lib/data.ts` contains demo product data and helper functions used by API routes.

## 🧭 Next Steps / Ideas you may want to implement

- Migrate from in-memory `lib/data.ts` to a real DB (Vercel Postgres or a hosted DB) with proper seed data & migrations
- Add authentication + per-user persisted carts on the backend
- Add server-side caching or edge caching to the product APIs
- Add more thorough tests for pagination, filtering, and cart flows

---

If you want, I can also add a README page in the app root that shows features at runtime (quick links / explanations) — ask and I’ll add that as the homepage UI.

---

This README is generated to reflect the current state of the sample project. If you want more details in any section (testing, CI/CD, commit hooks, contributing), tell me which area to expand.

# homework2-EB

A modern Next.js project initialized with Copilot Agent featuring Zustand, shadcn/ui, TailwindCSS, husky, lint-staged, and GitHub Actions.

## 🚀 Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS v4** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **shadcn/ui** - High-quality UI components
- **Husky** - Git hooks automation
- **lint-staged** - Run linters on staged files
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline

## 📦 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost: 3000](http://localhost:3000) in your browser to see the result.

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

## 🎯 Features

- ✅ **Type-safe** - Full TypeScript support
- ✅ **Modern UI** - TailwindCSS with custom design system
- ✅ **State Management** - Zustand for efficient state handling
- ✅ **Code Quality** - Automated linting and formatting
- ✅ **Git Hooks** - Pre-commit checks with husky
- ✅ **CI/CD** - Automated testing and building

## 🏗️ Project Structure

```
.
├── app/                  # Next.js app directory
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
├── store/                # Zustand stores
├── .github/
│   └── workflows/        # GitHub Actions workflows
├── .husky/               # Git hooks
└── public/               # Static assets
```

## 🔧 Configuration

### TailwindCSS

Configured with custom theme variables in `tailwind.config.ts` and `app/globals.css`.

### ESLint

Using Next.js recommended ESLint config with TypeScript support.

### Husky & lint-staged

Pre-commit hooks automatically lint and format staged files before committing.

## 📝 License

This project is for educational purposes.
