"use client";
import React from "react";
import type { CartItem } from "@/types";
import Image from "next/image";

interface Props {
  item: CartItem;
  onUpdate: (skuId: string, quantity: number) => void;
  onRemove: (skuId: string) => void;
}

export default function CartItemRow({ item, onUpdate, onRemove }: Props) {
  const name = item.product?.name ?? item.skuId;
  const img = item.product?.image ?? "https://placehold.co/100x100";
  const price = item.product?.price ?? 0;

  return (
    <div className="flex items-center gap-4 border-b py-3">
      <div className="w-20 h-20 relative shrink-0">
        <Image src={img} alt={name} fill style={{ objectFit: "cover" }} />
      </div>

      <div className="flex-1">
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">SKU: {item.skuId}</div>
      </div>

      <div className="w-40 flex flex-col items-end gap-2">
        <div className="text-sm font-semibold">
          ¥{(price * item.quantity).toFixed(2)}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => onUpdate(item.skuId, Math.max(1, item.quantity - 1))}
            aria-label="decrease"
          >
            -
          </button>
          <div className="px-3">{item.quantity}</div>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => onUpdate(item.skuId, item.quantity + 1)}
            aria-label="increase"
          >
            +
          </button>
          <button
            className="px-3 py-1 text-sm text-red-600"
            onClick={() => onRemove(item.skuId)}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}
