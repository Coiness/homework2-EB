"use client";

import React from "react";
import type { ProductSimple } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductSimple[];
  layout?: "grid" | "list";
  onProductClick?: (id: string) => void;
  onAddToCart?: (skuId: string) => void;
}

/**
 * ProductGrid：负责把产品列表转换为网格或列表展示。
 * 设计注意点：
 * - 列表和网格布局通常影响图片尺寸、显示字段数量
 * - 如果性能成为问题，需要考虑虚拟滚动（例如 react-virtual）来避免渲染大量 DOM
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  layout = "grid",
  onProductClick,
  onAddToCart,
}) => {
  if (layout === "list") {
    return (
      <div className="space-y-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={onAddToCart}
            onClick={onProductClick}
            layout="list"
          />
        ))}
      </div>
    );
  }

  // grid layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onAddToCart={onAddToCart}
          onClick={onProductClick}
          layout="grid"
        />
      ))}
    </div>
  );
};
