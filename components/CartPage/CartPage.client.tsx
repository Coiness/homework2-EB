"use client";
import React from "react";
import useClientCart from "@/lib/useClientCart";
import CartItemRow from "./CartItemRow";
import Link from "next/link";

export default function CartPageClient() {
  const { cart, add, update, remove, reload, uid } = useClientCart();

  // Total values are stored on cart but recalc here if needed
  const totalPrice = cart.totalPrice ?? 0;
  const totalQuantity = cart.totalQuantity ?? 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">购物车</h1>

      {cart.items.length === 0 ? (
        <div className="p-6 border rounded bg-gray-50 text-center">
          你的购物车是空的
          <div className="mt-4">
            <Link href="/products" className="text-indigo-600">
              去逛逛商品
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border rounded bg-white p-4">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.skuId}
                item={item}
                onUpdate={(sku, q) => update(sku, q)}
                onRemove={(sku) => remove(sku)}
              />
            ))}
          </div>

          <div className="flex justify-end items-center gap-6">
            <div className="text-sm text-gray-600">
              总数：{totalQuantity} 件
            </div>
            <div className="text-xl font-semibold">
              合计：¥{totalPrice.toFixed(2)}
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">
              去结算
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
