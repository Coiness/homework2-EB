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
    const c: Cart =
      carts.get(uid) ??
      ({
        uid,
        items: [] as CartItem[],
        totalPrice: 0,
        totalQuantity: 0,
      } as Cart);
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

// 示例商品数据
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
    recommendations: [
      {
        id: "p2",
        name: "蓝色 牛仔裤",
        category: "clothes",
        price: 129,
        sales: 800,
        image: "https://placehold.co/400x400/png?text=Jeans+Blue",
        tags: ["热销"],
      },
      {
        id: "p3",
        name: "运动鞋 - 白色",
        category: "shoes",
        price: 199,
        sales: 320,
        image: "https://placehold.co/400x400/png?text=Sneakers+White",
        tags: ["新品"],
      },
      {
        id: "p5",
        name: "轻量跑鞋 - 黑色",
        category: "shoes",
        price: 219,
        sales: 210,
        image: "https://placehold.co/400x400/png?text=Running+Black",
        tags: ["新品"],
      },
    ],
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
    recommendations: [
      {
        id: "p1",
        name: "红色 T 恤",
        category: "clothes",
        price: 49,
        sales: 1200,
        image: "https://placehold.co/400x400/png?text=Red+T-shirt",
        tags: ["热销"],
      },
      {
        id: "p4",
        name: "便携水壶 - 500ml",
        category: "home",
        price: 39,
        sales: 450,
        image: "https://placehold.co/400x400/png?text=Bottle+Black",
        tags: ["热销"],
      },
      {
        id: "p6",
        name: "旅行双肩包 - 卡其",
        category: "bags",
        price: 299,
        sales: 140,
        image: "https://placehold.co/400x400/png?text=Backpack+Kaki",
        tags: ["热门"],
      },
    ],
  },

  {
    id: "p3",
    name: "运动鞋 - 白色",
    description: "轻量缓震，日常跑步与城市通勤两相宜",
    category: "shoes",
    priceRange: { min: 179, max: 249 },
    sales: 320,
    images: ["https://placehold.co/600x600/png?text=Sneakers+White"],
    attributes: [
      {
        name: "尺码",
        key: "size",
        values: [
          { value: "38", label: "38" },
          { value: "39", label: "39" },
          { value: "40", label: "40" },
        ],
      },
    ],
    skus: [
      {
        id: "sku_p3_38",
        productId: "p3",
        name: "白色 38",
        price: 179,
        stock: 15,
        image: "https://placehold.co/400x400/png?text=Sneakers+38",
        attributes: { size: "38" },
      },
      {
        id: "sku_p3_40",
        productId: "p3",
        name: "白色 40",
        price: 199,
        stock: 8,
        image: "https://placehold.co/400x400/png?text=Sneakers+40",
        attributes: { size: "40" },
      },
    ],
    recommendations: [
      {
        id: "p5",
        name: "轻量跑鞋 - 黑色",
        category: "shoes",
        price: 219,
        sales: 210,
        image: "https://placehold.co/400x400/png?text=Running+Black",
        tags: ["推荐"],
      },
      {
        id: "p1",
        name: "红色 T 恤",
        category: "clothes",
        price: 49,
        sales: 1200,
        image: "https://placehold.co/400x400/png?text=Red+T-shirt",
        tags: ["搭配"],
      },
    ],
  },

  {
    id: "p4",
    name: "便携水壶 - 500ml",
    description: "保温且不漏水，适合上班通勤或户外运动携带",
    category: "home",
    priceRange: { min: 29, max: 59 },
    sales: 450,
    images: ["https://placehold.co/600x600/png?text=Bottle+Black"],
    attributes: [],
    skus: [
      {
        id: "sku_p4_default",
        productId: "p4",
        name: "便携水壶 500ml",
        price: 39,
        stock: 120,
        image: "https://placehold.co/400x400/png?text=Bottle+Black",
        attributes: {},
      },
    ],
    recommendations: [
      {
        id: "p2",
        name: "蓝色 牛仔裤",
        category: "clothes",
        price: 129,
        sales: 800,
        image: "https://placehold.co/400x400/png?text=Jeans+Blue",
        tags: ["适合"],
      },
    ],
  },

  {
    id: "p5",
    name: "轻量跑鞋 - 黑色",
    description: "外观简洁、缓震良好，适合跑步与日常穿着",
    category: "shoes",
    priceRange: { min: 199, max: 249 },
    sales: 210,
    images: ["https://placehold.co/600x600/png?text=Running+Black"],
    attributes: [
      {
        name: "尺码",
        key: "size",
        values: [
          { value: "38", label: "38" },
          { value: "39", label: "39" },
          { value: "40", label: "40" },
        ],
      },
    ],
    skus: [
      {
        id: "sku_p5_39",
        productId: "p5",
        name: "黑色 39",
        price: 199,
        stock: 18,
        image: "https://placehold.co/400x400/png?text=Running+39",
        attributes: { size: "39" },
      },
      {
        id: "sku_p5_40",
        productId: "p5",
        name: "黑色 40",
        price: 219,
        stock: 12,
        image: "https://placehold.co/400x400/png?text=Running+40",
        attributes: { size: "40" },
      },
    ],
    recommendations: [
      {
        id: "p3",
        name: "运动鞋 - 白色",
        category: "shoes",
        price: 179,
        sales: 320,
        image: "https://placehold.co/400x400/png?text=Sneakers+White",
        tags: ["相似"],
      },
    ],
  },

  {
    id: "p6",
    name: "旅行双肩包 - 卡其",
    description: "大容量隔层，侧袋放水壶，适合短途旅行与通勤",
    category: "bags",
    priceRange: { min: 239, max: 349 },
    sales: 140,
    images: ["https://placehold.co/600x600/png?text=Backpack+Kaki"],
    attributes: [],
    skus: [
      {
        id: "sku_p6_default",
        productId: "p6",
        name: "旅行包 卡其",
        price: 299,
        stock: 22,
        image: "https://placehold.co/400x400/png?text=Backpack+Kaki",
        attributes: {},
      },
    ],
    recommendations: [
      {
        id: "p4",
        name: "便携水壶 - 500ml",
        category: "home",
        price: 39,
        sales: 450,
        image: "https://placehold.co/400x400/png?text=Bottle+Black",
        tags: ["搭配"],
      },
      {
        id: "p1",
        name: "红色 T 恤",
        category: "clothes",
        price: 49,
        sales: 1200,
        image: "https://placehold.co/400x400/png?text=Red+T-shirt",
        tags: ["搭配"],
      },
    ],
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

export default db;
