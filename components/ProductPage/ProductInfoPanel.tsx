"use client";
import React, { useMemo, useState } from "react";
import type { CartItem, ProductDetail, ProductSku } from "@/types";
import useClientCart from "@/lib/useClientCart";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface Props {
  product: ProductDetail;
  initialSkuId?: string | null;
  onAddToCart?: (skuId: string, quantity: number) => Promise<void> | void;
}

/**
 * Client component that presents product information and handles SKU selection / add to cart.
 * - Key business logic points are marked with TODO so you can wire them to Zustand / API / localStorage.
 */
export default function ProductInfoPanel({
  product,
  initialSkuId = null,
  onAddToCart,
}: Props) {
  // Determine a default SKU if initialSkuId not provided
  const initialSku = useMemo<ProductSku | undefined>(() => {
    if (!product.skus || product.skus.length === 0) return undefined;
    return product.skus.find((s) => s.id === initialSkuId) ?? product.skus[0];
  }, [product.skus, initialSkuId]);

  const [selectedSku, setSelectedSku] = useState<ProductSku | undefined>(
    initialSku
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string | null>(null);
  const { add } = useClientCart();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // TODO: If you have server-side pricing/stock checks, call them when selectedSku changes
  // Example: fetch(`/api/v1/sku/${selectedSku?.id}/availability`) and update UI
  // 不太清楚

  async function handleAddToCart() {
    if (!selectedSku) {
      setNote("请选择规格");
      return;
    }

    // TODO: Validate stock locally or via API
    // TODO: integrate with Zustand store or clientCart helper. You can choose one:
    //  - use store: useCartStore.getState().addToCart('1', selectedSku.id, quantity)
    //  - local storage: clientCart.addItem('1', {skuId: selectedSku.id, quantity, addedAt: Date.now()})
    const cartItem: CartItem = {
      skuId: selectedSku.id,
      quantity: quantity,
      addedAt: Date.now(),
    };

    add(cartItem);

    try {
      if (onAddToCart) await onAddToCart(selectedSku.id, quantity);
      setNote("已加入购物车（演示）");
    } catch (err) {
      setNote("加入购物车失败");
    }
  }

  function handleURLchange(key: string, value: string) {
    // 首先创建一个新的对象，避免直接操作URL参数
    const newParams = new URLSearchParams();
    // 更改对应的key和value，如果没有的话就加上
    newParams.set(key, value);
    //更改路由
    router.push(`${pathname}?${newParams.toString()}`);
  }

  return (
    <div className="space-y-4 p-4">
      <div className="text-2xl font-semibold">{product.name}</div>
      <div className="text-sm text-gray-500">{product.description}</div>

      <div className="mt-4 border-t pt-4">
        <div className="text-xl text-rose-600 font-bold">
          ¥{selectedSku?.price ?? product.priceRange.min}
        </div>
        <div className="text-xs text-gray-500">
          库存: {selectedSku?.stock ?? "N/A"}
        </div>
      </div>

      {/* 属性选择区 */}
      <div className="mt-4">
        {product.attributes?.map((attr) => (
          <div key={attr.key} className="mb-3">
            <div className="text-sm font-medium mb-2">{attr.name}</div>
            <div className="flex gap-2 flex-wrap">
              {attr.values.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => {
                    // TODO: Implement selection logic — map attribute combination to a SKU
                    // At minimum, setSelectedSku by finding the first SKU that matches the currently chosen attributes.
                    // For now we just show available values; the primary SKU mapping logic you can add later.
                    if (selectedSku?.attributes.v) {
                    }
                    setNote(
                      `选择了 ${attr.name}: ${v.label} （请在 TODO 里实现 SKU 匹配）`
                    );
                  }}
                  className="px-3 py-1 border rounded text-sm"
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 数量 + 加入购物车 */}
      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center border rounded overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3"
            aria-label="decrease"
          >
            -
          </button>
          <div className="px-4">{quantity}</div>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3"
            aria-label="increase"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          加入购物车
        </button>
      </div>

      {note ? <div className="text-sm text-gray-600 mt-2">{note}</div> : null}
    </div>
  );
}
