"use client";
import { useEffect, useState } from "react";
import type { Cart, CartItem } from "@/types";
import clientCart from "@/lib/clientCart";

const DEFAULT_UID = "1";

export function useClientCart(uidParam?: string) {
  const uid = uidParam ?? DEFAULT_UID;
  const [cart, setCart] = useState<Cart>(() => clientCart.readCart(uid));

  useEffect(() => {
    setCart(clientCart.readCart(uid));
  }, [uid]);

  function add(item: CartItem) {
    const next = clientCart.addItem(uid, item);
    setCart(next);
  }

  function update(skuId: string, quantity: number) {
    const next = clientCart.updateItem(uid, skuId, quantity);
    setCart(next);
  }

  function remove(skuId: string) {
    const next = clientCart.removeItem(uid, skuId);
    setCart(next);
  }

  function reload() {
    setCart(clientCart.readCart(uid));
  }

  return { cart, add, update, remove, reload, uid } as const;
}

export default useClientCart;
