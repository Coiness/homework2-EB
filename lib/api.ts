import {
  GetProductsResponse,
  ProductFilter,
  ProductDetail,
  Cart,
  CartItem,
} from "@/types";

// 默认指向本地 API 路由 (/api/v1) — 可以通过 NEXT_PUBLIC_API_BASE 环境变量覆盖
// 例如在 .env.local 中设定： NEXT_PUBLIC_API_BASE=http://localhost:3000/api/v1
// 默认 dev 指向本地 API 路由 (/api/v1)，但在测试环境下保留旧的 "api.example.com" 地址
// 以便现有测试使用 MSW 的拦截器（它们拦截 https://api.example.com/*）。
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ??
  (process.env.NODE_ENV === "test"
    ? "https://api.example.com/api/v1"
    : "/api/v1");

function isAbsolute(u: string) {
  return u.startsWith("http://") || u.startsWith("https://");
}

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Ensure server-side fetch has an absolute URL. When BASE_URL is a path
  // ("/api/v1") we map it to the local app URL on the server so Node's fetch
  // can parse it. In tests we keep the api.example.com host.
  let url: string;
  if (isAbsolute(BASE_URL)) {
    url = `${BASE_URL}${endpoint}`;
  } else if (typeof window === "undefined") {
    // server runtime — resolve to absolute URL using NEXT_PUBLIC_APP_URL or default localhost
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      `http://localhost:${process.env.PORT ?? 3000}`;
    url = `${appUrl}${BASE_URL}${endpoint}`;
  } else {
    // client runtime — relative path is fine
    url = `${BASE_URL}${endpoint}`;
  }
  let res: Response;
  try {
    res = await fetch(url, { ...options });
  } catch (err) {
    // 明确的网络错误信息，便于排查 ENOTFOUND / ECONNREFUSED 等
    throw new Error(`Network error when fetching ${url}: ${String(err)}`);
  }

  if (!res.ok) {
    // 尝试读取返回体以便获得更有用的错误信息
    const text = await res.text().catch(() => "");
    throw new Error(
      `API Error ${res.status} ${res.statusText} at ${url}: ${text}`
    );
  }

  return res.json();
}

export const api = {
  // 获取商品列表
  getProducts: (filter?: ProductFilter) => {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    return fetcher<GetProductsResponse>(`/products?${params.toString()}`);
  },

  // 获取商品详情
  getProductDetail: (id: string) => {
    return fetcher<ProductDetail>(`/product/${id}`);
  },

  // 获取购物车
  // uid is optional now — default to "1" to keep things simple for this project
  getCart: (uid?: string) => {
    const _uid = uid ?? "1";
    return fetcher<Cart>(`/cart/${_uid}`);
  },

  // 将物品加入购物车
  addToCart: (uid?: string, skuId?: string, quantity?: number) => {
    const _uid = uid ?? "1";
    const _sku = skuId ?? "";
    const _quantity = Number(quantity ?? 1);
    return fetcher<Cart>(`/cart/${_uid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skuId: _sku,
        quantity: _quantity,
        addedAt: Date.now(),
      }),
    });
  },

  updateCartItem: (uid?: string, skuId?: string, quantity?: number) => {
    const _uid = uid ?? "1";
    const _sku = skuId ?? "";
    const _quantity = Number(quantity ?? 0);
    return fetcher<Cart>(`/cart/${_uid}/${_sku}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: _quantity }),
    });
  },

  removeFromCart: (uid?: string, skuId?: string) => {
    const _uid = uid ?? "1";
    const _sku = skuId ?? "";
    return fetcher<Cart>(`/cart/${_uid}/${_sku}`, {
      method: "DELETE",
    });
  },
};
