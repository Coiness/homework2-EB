import { create } from "zustand";
import { Cart, CartItem } from "@/types";
import { api } from "@/lib/api";
import { simpleDebounce } from "@/lib/utils";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  fetchCart: (uid: string) => Promise<void>;
  addToCart: (uid: string, skuId: string, quantity: number) => Promise<void>;
  updateQuantity: (
    uid: string,
    skuId: string,
    quantity: number
  ) => Promise<void>;
  removeItem: (uid: string, skuId: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => {
  // 更新防抖
  const debouncedSync = simpleDebounce(
    async (uid: string, skuId: string, quantity: number) => {
      const currentCart = get().cart ?? null;
      try {
        const newCart = await api.updateCartItem(uid, skuId, quantity);
        set({ cart: newCart });
      } catch (err) {
        set({ error: (err as Error).message, cart: currentCart });
      }
    },
    500
  );

  return {
    // 初始化
    cart: null,
    isLoading: false,
    error: null,

    fetchCart: async (uid: string) => {
      set({ isLoading: true, error: null });
      try {
        const data = await api.getCart(uid);
        set({ cart: data, isLoading: false });
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    addToCart: async (uid: string, skuId: string, quantity: number) => {
      set({ isLoading: true, error: null });
      try {
        const newCart = await api.addToCart(uid, skuId, quantity);
        set({ cart: newCart, isLoading: false });
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    updateQuantity: async (uid: string, skuId: string, quantity: number) => {
      // A. 乐观更新 (Optimistic Update)
      // 这一步是为了让用户点击 + 号时，数字立马变，不需要等网络
      const currentCart = get().cart;
      if (currentCart) {
        set({
          cart: {
            ...currentCart,
            items: currentCart.items.map((item) =>
              item.skuId === skuId ? { ...item, quantity } : item
            ),
            // 注意：这里暂时没算总价，因为比较麻烦，等 500ms 后后端返回了就会自动修正
          },
        });
      }

      // B. 调用防抖函数
      debouncedSync(uid, skuId, quantity);
    },

    removeItem: async (uid: string, skuId: string) => {
      const previousCart = get().cart;
      if (!previousCart) return;
      const targetItem = previousCart.items.find(
        (item) => item.skuId === skuId
      );
      if (!targetItem) return;
      const priceToRemove =
        (targetItem.product?.price ?? 0) * targetItem.quantity;
      const quantityToRemove = targetItem.quantity;

      try {
        set({
          cart: {
            ...previousCart,
            items: previousCart.items.filter((item) => item.skuId !== skuId),
            totalPrice: previousCart.totalPrice - priceToRemove,
            totalQuantity: previousCart.totalQuantity - quantityToRemove,
          },
        });
        const newCart = await api.removeFromCart(uid, skuId);
        set({ cart: newCart });
      } catch (err) {
        set({
          error: (err as Error).message,
          cart: previousCart,
        });
      }
    },
  };
});
