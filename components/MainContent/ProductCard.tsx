"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { ProductSimple } from "@/types/product";
import React from "react";
import Link from "next/link";

interface ProductCardProps {
  product: ProductSimple;
  onAddToCart?: (skuId: string) => void;
  onClick?: (productId: string) => void;
  layout?: "grid" | "list";
}

/**
 * ProductCard: 商品的最小展示单元
 * - 如果是列表模式，应当展示更多信息
 * - 如果是 grid 模式，卡片更紧凑
 *
 * 学习点（提问）：
 * - 这里为什么用 ProductSimple 而不是 ProductDetail？什么时候用 SPU，什么时候用 SKU？
 *    因为这里只是缩略图，只需要展示关键信息，故选择ProductSimple。
 * - 如果需要支持图片懒加载 / 占位图，Next/Image 要如何调整？
 *    将loading设置为lazy，就可以实现懒加载。占位图不太清楚，使用onLoad回调吗？还是overridesrc？后面那个干什么用的？
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onClick,
  layout = "grid",
}) => {
  return (
    <div
      className={`border rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition ${layout === "grid" ? "p-3" : "p-4 flex gap-4 items-center"}`}
      role="article"
    >
      {/* 图片部分 */}
      <div
        className={
          layout === "grid"
            ? "h-48 w-full relative"
            : "w-28 h-28 relative shrink-0"
        }
      >
        {/* Next/Image 更好的实践：设置 width/height 或者使用 fill + object-cover */}
        <Image
          src={product.image}
          alt={product.name}
          fill={true}
          className="w-full h-full object-cover rounded"
        />
      </div>

      <div className={layout === "grid" ? "mt-3" : "flex-1"}>
        {onClick ? (
          <h3
            className="font-semibold text-sm leading-snug cursor-pointer"
            onClick={() => onClick?.(product.id)}
          >
            {product.name}
          </h3>
        ) : (
          // If no onClick callback provided, fall back to a normal Link navigation
          <h3 className="font-semibold text-sm leading-snug">
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          </h3>
        )}
        <div className="text-sm text-muted-foreground mt-1">
          销量 {product.sales}
        </div>
        <div className="text-lg font-bold text-amber-600 mt-2">
          ¥{product.price.toFixed(2)}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {/**我把加入购物车删了，因为这点要在详细页实现，传入的是skuId而不是普通的产品id */}
          {onClick ? (
            <Button size="sm" onClick={() => onClick?.(product.id)}>
              查看
            </Button>
          ) : (
            <Link href={`/product/${product.id}`} className="inline-block">
              <Button size="sm">查看</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
