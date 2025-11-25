"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ToolbarProps {
  currentSort?: string;
  currentLayout?: "grid" | "list";
  searchQuery?: string;
  productCount?: number;
  onSortChange?: (sort: string) => void;
  onLayoutChange?: (layout: "grid" | "list") => void;
  onSearch?: (q: string) => void;
}

/**
 * Toolbar 是主内容区顶部的小工具条：负责排序 / 布局切换 / 展示搜索结果数量
 * 我尽量保持简单，关键逻辑使用 props 回调 — 这样它与数据层完全解耦。
 *
 * 学习点（提问）：
 * - 你觉得这个组件应该是有状态的还是无状态的？为什么？
 *   无状态，状态放在url里面
 * - 如果我们要把排序和布局持久化到 URL，你会如何修改 onSortChange/onLayoutChange？
 *    首先使用useSearchParams得到url的参数
 *    接着获取sort字段和布局字段
 *    更新这两个字段（记得不可变性）
 *    重定向路由，使用router.push
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  currentSort = "default",
  currentLayout = "grid",
  searchQuery = "",
  productCount = 0,
  onSortChange,
  onLayoutChange,
  onSearch,
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="text-sm/6 text-muted-foreground">
          {productCount} 条结果
        </div>

        <select
          aria-label="排序"
          value={currentSort}
          onChange={(e) => onSortChange?.(e.target.value)}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="default">默认排序</option>
          <option value="price_asc">价格从低到高</option>
          <option value="price_desc">价格从高到低</option>
          <option value="newest">最新</option>
          <option value="popular">热门</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        {/* 布局切换按钮 */}
        <Button
          variant={currentLayout === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => onLayoutChange?.("grid")}
        >
          Grid
        </Button>
        <Button
          variant={currentLayout === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onLayoutChange?.("list")}
        >
          List
        </Button>
      </div>
    </div>
  );
};
