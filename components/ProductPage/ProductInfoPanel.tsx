"use client";
import React, { useMemo, useState } from "react";
import type { CartItem, ProductDetail, ProductSku } from "@/types";
import useClientCart from "@/lib/useClientCart";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface Props {
  product: ProductDetail;
  initialSkuId?: string | null;
  onAddToCart?: (skuId: string, quantity: number) => Promise<void> | void;
  onSelectedSkuChange?: (sku: ProductSku | undefined) => void;
}

/**
 * Client component that presents product information and handles SKU selection / add to cart.
 * - Key business logic points are marked with TODO so you can wire them to Zustand / API / localStorage.
 */
export default function ProductInfoPanel({
  product,
  initialSkuId = null,
  onAddToCart,
  onSelectedSkuChange,
}: Props) {
  // Determine a default SKU if initialSkuId not provided
  const initialSku = useMemo<ProductSku | undefined>(() => {
    if (!product.skus || product.skus.length === 0) return undefined;
    return product.skus.find((s) => s.id === initialSkuId) ?? product.skus[0];
  }, [product.skus, initialSkuId]);

  const [selectedSku, setSelectedSku] = useState<ProductSku | undefined>(
    initialSku
  );
  // track currently selected attribute values, initialize from initialSku attributes when available
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
    () => (initialSku?.attributes as Record<string, string> | undefined) ?? {}
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
      // attach product info so client-side cart has price/image for display/totals
      product: {
        name: product.name,
        image: selectedSku.image ?? product.images?.[0] ?? "",
        price: selectedSku.price ?? product.priceRange.min,
        attributes: selectedSku.attributes ?? {},
      },
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
    <div className="space-y-4 p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold text-gray-800">
            {product.name}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {product.description}
          </div>
        </div>
        <div className="mt-2 md:mt-0 text-right">
          <div className="text-sm text-gray-500">销量 {product.sales}</div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-2xl md:text-3xl text-rose-600 font-extrabold">
            ¥{selectedSku?.price ?? product.priceRange.min}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            库存: {selectedSku?.stock ?? "N/A"}
          </div>
        </div>
        <div className="text-sm text-gray-600">{product.category}</div>
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
                    // Update selected attribute values
                    const next = { ...selectedAttrs, [attr.key]: v.value };
                    setSelectedAttrs(next);

                    // Find matching SKU by comparing all selected attrs
                    const matched = product.skus?.find((s) =>
                      Object.entries(next).every(
                        ([k, val]) => s.attributes?.[k] === val
                      )
                    );

                    if (matched) {
                      // Found an exact SKU match — update selection, notify parent and update URL
                      setSelectedSku(matched);
                      try {
                        // notify the parent client wrapper so gallery can update
                        onSelectedSkuChange?.(matched);
                      } catch (e) {}

                      try {
                        const newParams = new URLSearchParams(
                          params.toString()
                        );
                        newParams.set("skuid", matched.id);
                        router.replace(`${pathname}?${newParams.toString()}`);
                      } catch (e) {}

                      setNote(`选择了 ${attr.name}: ${v.label}`);
                    } else {
                      // No exact match for current attribute combination
                      setSelectedSku(undefined);
                      try {
                        onSelectedSkuChange?.(undefined);
                      } catch (e) {}
                      try {
                        const newParams = new URLSearchParams(
                          params.toString()
                        );
                        newParams.delete("skuid");
                        router.replace(`${pathname}?${newParams.toString()}`);
                      } catch (e) {}

                      setNote(`对应的商品已经卖光了，请试试其他选择`);
                    }
                  }}
                  className={`px-3 py-1 border rounded-md text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${selectedAttrs[attr.key] === v.value ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 数量 + 加入购物车 */}
      <div className="flex items-center gap-3 mt-4 flex-wrap">
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
          className="px-5 py-2 bg-indigo-600 text-white rounded-md md:rounded-lg shadow-sm hover:bg-indigo-700 transition-colors w-full md:w-auto text-center"
        >
          加入购物车
        </button>
      </div>

      {note ? <div className="text-sm text-gray-600 mt-2">{note}</div> : null}
    </div>
  );
}
