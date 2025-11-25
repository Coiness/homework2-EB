// lib/store.ts
// 简易内存数据库（仅用于本地开发 / 测试）
// - 存放商品数据（ProductDetail / SKU / ProductSimple）
// - 存放购物车数据（按 uid）
// 这个模块暴露的函数供 app/api/* 的 route.ts 使用。

import type {
  ProductSimple,
  ProductSku,
  ProductDetail,
  Cart,
  CartItem,
} from "@/types";

// 这里写入一些示例商品数据，方便前端联调
const products: ProductDetail[] = [
  {
    id: "p1",
    name: "红色 T 恤",
    description: "舒适纯棉，适合日常穿着",
    category: "clothes",
    priceRange: { min: 49, max: 99 },
    sales: 1200,
    images: ["https://placehold.co/600x600/png?text=Red+T-shirt"],
    attributes: [
      {
        name: "颜色",
        key: "color",
        values: [
          { value: "red", label: "红色" },
          { value: "blue", label: "蓝色" },
        ],
      },
      {
        name: "尺码",
        key: "size",
        values: [
          { value: "s", label: "S" },
          { value: "m", label: "M" },
        ],
      },
    ],
    skus: [
      {
        id: "sku_p1_r_s",
        productId: "p1",
        name: "红色 S",
        price: 49,
        stock: 10,
        image: "https://placehold.co/400x400/png?text=Red+S",
        attributes: { color: "red", size: "s" },
      },
      {
        id: "sku_p1_r_m",
        productId: "p1",
        name: "红色 M",
        price: 59,
        stock: 5,
        image: "https://placehold.co/400x400/png?text=Red+M",
        attributes: { color: "red", size: "m" },
      },
    ],
    recommendations: [],
  },
  {
    id: "p2",
    name: "蓝色 牛仔裤",
    description: "百搭牛仔裤，耐穿不易变形",
    category: "clothes",
    priceRange: { min: 129, max: 169 },
    sales: 800,
    images: ["https://placehold.co/600x600/png?text=Jeans+Blue"],
    attributes: [
      {
        name: "尺码",
        key: "size",
        values: [
          { value: "s", label: "S" },
          { value: "m", label: "M" },
          { value: "l", label: "L" },
        ],
      },
    ],
    skus: [
      {
        id: "sku_p2_m",
        productId: "p2",
        name: "蓝色 M",
        price: 129,
        stock: 7,
        image: "https://placehold.co/400x400/png?text=Jeans+M",
        attributes: { size: "m" },
      },
    ],
    recommendations: [],
  },
];

const carts = new Map<string, Cart>();

function toSimple(p: ProductDetail): ProductSimple {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.priceRange.min,
    sales: p.sales,
    image: p.images[0] ?? "",
    tags: [],
  };
}

export const db = {
  // 返回所有商品的简要信息（用于 /products 列表）
  getProducts: (): ProductSimple[] => products.map(toSimple),

  // 根据 id 返回商品详情
  getProductDetail: (id: string): ProductDetail | null => {
    return products.find((p) => p.id === id) ?? null;
  },

  // 购物车：按 uid 存储
  getCart: (uid: string): Cart => {
    // 当购物车不存在时，返回带有 uid 的空购物车对象以满足 Cart 类型
    return (
      carts.get(uid) ?? {
        uid,
        items: [] as CartItem[],
        totalPrice: 0,
        totalQuantity: 0,
      }
    );
  },

  addToCart: (uid: string, item: CartItem): Cart => {
    // 明确给默认值添加 uid 并断言为 Cart，避免 TS 推断出 never[] 联合类型
    const c: Cart = carts.get(uid) ?? {
      uid,
      items: [] as CartItem[],
      totalPrice: 0,
      totalQuantity: 0,
    };
    const exist = c.items.find((i) => i.skuId === item.skuId);
    if (exist) exist.quantity += item.quantity;
    else c.items.push(item);

    // 更新统计
    c.totalQuantity = c.items.reduce((s, it) => s + it.quantity, 0);
    c.totalPrice = c.items.reduce((s, it) => {
      const sku = products
        .flatMap((p) => p.skus)
        .find((s) => s.id === it.skuId);
      const price = sku?.price ?? 0;
      return s + price * it.quantity;
    }, 0);
    carts.set(uid, c);
    return c;
  },

  updateCartItem: (uid: string, skuId: string, quantity: number): Cart => {
    const c = carts.get(uid);
    if (!c) throw new Error("Cart not found");
    const it = c.items.find((i) => i.skuId === skuId);
    if (!it) throw new Error("Item not found");
    it.quantity = quantity;
    c.totalQuantity = c.items.reduce((s, it) => s + it.quantity, 0);
    c.totalPrice = c.items.reduce((s, it) => {
      const sku = products
        .flatMap((p) => p.skus)
        .find((s) => s.id === it.skuId);
      const price = sku?.price ?? 0;
      return s + price * it.quantity;
    }, 0);
    carts.set(uid, c);
    return c;
  },

  removeFromCart: (uid: string, skuId: string): Cart => {
    const c = carts.get(uid);
    if (!c) throw new Error("Cart not found");
    c.items = c.items.filter((i) => i.skuId !== skuId);
    c.totalQuantity = c.items.reduce((s, it) => s + it.quantity, 0);
    c.totalPrice = c.items.reduce((s, it) => {
      const sku = products
        .flatMap((p) => p.skus)
        .find((s) => s.id === it.skuId);
      const price = sku?.price ?? 0;
      return s + price * it.quantity;
    }, 0);
    carts.set(uid, c);
    return c;
  },
};

export default db;
