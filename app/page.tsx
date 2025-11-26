"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { count, increment, decrement } = useStore();

  return (
    <main className="min-h-screen flex items-start justify-center bg-linear-to-r from-sky-50 to-indigo-100 p-8">
      <div className="max-w-6xl w-full">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">homework2-EB</h1>
            <p className="text-slate-600 mt-1">
              一个基于 Next.js App Router、TypeScript 与 TailwindCSS
              的示例电商项目，使用 shadcn/ui、Zustand 与本地 Mock
              数据，适合学习和演示前端电商架构。
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">如何使用</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600">
              <li>
                点击{" "}
                <Link className="underline" href="/products">
                  商品列表
                </Link>
                ，浏览演示数据并测试分页/筛选。
              </li>
              <li>在商品详情页尝试选择 SKU，观察 URL 查询参数如何同步。</li>
              <li>
                将商品加入购物车 —— 购物车会保存在 localStorage 并在页面间保持。
              </li>
              <li>使用工具栏测试排序、布局（网格/列表）以及标签筛选。</li>
            </ul>
          </div>

          <aside className="bg-white p-6 rounded-lg shadow space-y-4">
            <div>
              <h3 className="text-lg font-medium">快速演示</h3>
              <p className="text-sm text-slate-500">
                一个小型计数器（Zustand）演示本地 store 的连通性。
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-3">
                {count}
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={decrement} variant="outline" size="sm">
                  -
                </Button>
                <Button onClick={increment} size="sm">
                  +
                </Button>
              </div>
            </div>
          </aside>
        </section>

        <footer className="mt-8 text-sm text-slate-500">
          <div>
            开发说明：项目使用内存数据（`lib/data.ts`）作为演示数据源；生产环境请替换为真实数据库。
          </div>
        </footer>
      </div>
    </main>
  );
}
