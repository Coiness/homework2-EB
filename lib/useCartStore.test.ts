import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useCartStore } from "@/store/useCartStore";
import { api } from "@/lib/api";
import { Cart } from "@/types";

// 1. Mock api 模块
// 这样我们就不用真的去调 fetch 或者 MSW，而是完全控制 API 的行为
vi.mock("@/lib/api", () => ({
  api: {
    getCart: vi.fn(),
    addToCart: vi.fn(),
    updateCartItem: vi.fn(),
    removeFromCart: vi.fn(),
  },
}));

// 准备一份模拟数据
const mockCart: Cart = {
  uid: "user1",
  items: [
    {
      skuId: "sku1",
      quantity: 1,
      addedAt: 123,
      product: { name: "Test Product", price: 100, image: "", attributes: {} },
    },
  ],
  totalPrice: 100,
  totalQuantity: 1,
};

describe("useCartStore", () => {
  // 每个测试前重置 store 状态和 mock 状态
  beforeEach(() => {
    useCartStore.setState({ cart: null, isLoading: false, error: null });
    vi.clearAllMocks();
    vi.useFakeTimers(); // 启用假定时器，用于测试防抖
  });

  afterEach(() => {
    vi.useRealTimers(); // 恢复真定时器
  });

  // --- 测试 fetchCart ---
  it("fetchCart should update state correctly on success", async () => {
    vi.mocked(api.getCart).mockResolvedValue(mockCart);

    await useCartStore.getState().fetchCart("user1");

    const state = useCartStore.getState();
    expect(state.cart).toEqual(mockCart);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("fetchCart should handle error", async () => {
    vi.mocked(api.getCart).mockRejectedValue(new Error("Network Error"));

    await useCartStore.getState().fetchCart("user1");

    const state = useCartStore.getState();
    expect(state.cart).toBeNull();
    expect(state.error).toBe("Network Error");
    expect(state.isLoading).toBe(false);
  });

  // --- 测试 addToCart ---
  it("addToCart should update state correctly", async () => {
    const newCart = { ...mockCart, totalQuantity: 2 };
    vi.mocked(api.addToCart).mockResolvedValue(newCart);

    await useCartStore.getState().addToCart("user1", "sku1", 1);

    const state = useCartStore.getState();
    expect(state.cart).toEqual(newCart);
    expect(state.isLoading).toBe(false);
  });

  // --- 测试 updateQuantity (重点：防抖 + 乐观更新) ---
  it("updateQuantity should optimistic update UI immediately", () => {
    // 初始状态
    useCartStore.setState({ cart: mockCart });

    // 调用 updateQuantity
    useCartStore.getState().updateQuantity("user1", "sku1", 5);

    // 验证：UI 应该立马变了 (乐观更新)
    expect(useCartStore.getState().cart?.items[0].quantity).toBe(5);

    // 验证：API 此时还不应该被调用 (因为有防抖)
    expect(api.updateCartItem).not.toHaveBeenCalled();
  });

  it("updateQuantity should debounce API calls", async () => {
    useCartStore.setState({ cart: mockCart });
    const updatedCart = {
      ...mockCart,
      items: [{ ...mockCart.items[0], quantity: 10 }],
    };
    vi.mocked(api.updateCartItem).mockResolvedValue(updatedCart);

    const store = useCartStore.getState();

    // 快速连点 3 次
    store.updateQuantity("user1", "sku1", 2);
    store.updateQuantity("user1", "sku1", 5);
    store.updateQuantity("user1", "sku1", 10);

    // 此时 API 应该还没调
    expect(api.updateCartItem).not.toHaveBeenCalled();

    // 快进 500ms
    vi.advanceTimersByTime(500);

    // 验证：API 只被调用了 1 次，且用的是最后一次的值 (10)
    expect(api.updateCartItem).toHaveBeenCalledTimes(1);
    expect(api.updateCartItem).toHaveBeenCalledWith("user1", "sku1", 10);

    // 等待 Promise 完成
    await Promise.resolve();

    // 验证最终状态
    expect(useCartStore.getState().cart).toEqual(updatedCart);
  });

  // --- 测试 removeItem (重点：错误回滚) ---
  it("removeItem should optimistic delete and rollback on error", async () => {
    useCartStore.setState({ cart: mockCart });

    // 模拟 API 报错
    vi.mocked(api.removeFromCart).mockRejectedValue(new Error("Delete Failed"));

    // 调用删除
    const promise = useCartStore.getState().removeItem("user1", "sku1");

    // 验证：UI 应该立马删掉了 (乐观更新)
    expect(useCartStore.getState().cart?.items).toHaveLength(0);

    // 等待异步操作
    await promise;

    // 验证：报错后，应该回滚 (恢复原样)
    const state = useCartStore.getState();
    expect(state.error).toBe("Delete Failed");
    expect(state.cart?.items).toHaveLength(1);
    expect(state.cart?.items[0].skuId).toBe("sku1");
  });
});
