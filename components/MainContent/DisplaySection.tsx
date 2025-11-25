"use client";

import React from "react";
import type { ProductSimple } from "@/types/product";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";
import { Button } from "../ui/button";

interface DisplaySectionProps {
  products: ProductSimple[];
  layout?: "grid" | "list";
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onAddToCart?: (skuId: string) => void;
  onProductClick?: (id: string) => void;
}

/**
 * DisplaySection: 负责页面主体的展示逻辑：加载/空数据/错误/产品网格 + 分页
 *
 * 注：我把 Loading / Empty / Error 放在同一文件，便于集中管理，但如果你的项目更大，建议拆到单独文件，并复用样式。
 */
export const DisplaySection: React.FC<DisplaySectionProps> = ({
  products,
  layout = "grid",
  isLoading = false,
  isEmpty = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onAddToCart,
  onProductClick,
}) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white h-48 rounded border"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border rounded bg-red-50 text-red-700">
        <div className="font-semibold">出现错误</div>
        <div className="mt-2">{error}</div>
        <div className="mt-4">
          {/* 提示：这里可以放一个重试按钮，触发父组件传入的 onPageChange 或 onRetry 回调 */}
          <Button
            onClick={() =>
              onPageChange ? onPageChange(currentPage) : undefined
            }
          >
            重试
          </Button>
        </div>
      </div>
    );
  }

  if (isEmpty || products.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        <h3 className="text-lg font-semibold">暂无商品</h3>
        <p className="mt-2">尝试更改筛选条件或搜索其他关键词。</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProductGrid
        products={products}
        layout={layout}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
      />

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
