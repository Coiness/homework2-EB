import { http, HttpResponse } from "msw";
import { GetProductsResponse, ProductSimple, CartItem } from "@/types";

// 模拟一些假数据
const mockProducts: ProductSimple[] = Array.from({ length: 20 }).map(
  (_, i) => ({
    id: `prod_${i + 1}`,
    name: `示例商品 ${i + 1} 号`,
    price: 99 + i * 10,
    sales: 100 + i,
    image: "https://placehold.co/400x400/png", // 使用占位图
    tags: i % 2 === 0 ? ["热销"] : ["新品"],
  })
);

export const handlers = [
  // 1. 拦截 GET /api/v1/products
  http.get("https://api.example.com/api/v1/products", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 10);

    // 模拟分页逻辑
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = mockProducts.slice(start, end);

    const response: GetProductsResponse = {
      items,
      total: mockProducts.length,
      page,
      pageSize,
      hasMore: end < mockProducts.length,
    };

    return HttpResponse.json(response);
  }),

  // 2. 拦截 GET /api/v1/product/:id
  http.get("https://api.example.com/api/v1/product/:id", ({ params }) => {
    const { id } = params;

    // 返回一个模拟的详情
    return HttpResponse.json({
      id,
      name: `商品详情 ${id}`,
      description: "这是一个非常棒的商品，买它！",
      priceRange: { min: 99, max: 199 },
      sales: 1000,
      images: ["https://placehold.co/600x600/png"],
      attributes: [],
      skus: [],
      recommendations: [],
    });
  }),

  // 拦截 GET /api/v1/cart     一般后面要加用户ID，这里的需求暂时不需要，想了想还是加上吧
  http.get("https://api.example.com/api/v1/cart/:uid", ({ params }) => {
    const { uid } = params;

    return HttpResponse.json({
      uid,
      items: [
        {
          skuId: "skuId123",
          quantity: 100,
          addedAt: 202511221445,
          product: {
            name: "T-shirt",
            image: "https://placehold.co/600x600/png",
            price: 100,
            attributes: {
              color: "red",
              size: "S",
            },
          },
        },
      ],
      totalPrice: 20000,
      totalQuantity: 200,
    });
  }),

  // 拦截添加购物车逻辑
  http.post(
    "https://api.example.com/api/v1/cart/:uid",
    async ({ params, request }) => {
      const { uid } = params;
      const body = (await request.json()) as {
        skuId: string;
        quantity: number;
      };

      // 这里模拟添加逻辑：直接返回一个更新后的购物车对象
      return HttpResponse.json({
        uid,
        items: [
          {
            skuId: body.skuId,
            quantity: body.quantity,
            addedAt: Date.now(),
            product: {
              // 模拟后端聚合了商品信息
              name: "新加入的商品",
              price: 199,
              image: "https://placehold.co/100x100",
              attributes: {},
            },
          },
        ],
        totalPrice: 199 * body.quantity,
        totalQuantity: body.quantity,
      });
    }
  ),

  // 拦截 PATCH /api/v1/cart/:uid/:skuId (更新数量)
  http.patch(
    "https://api.example.com/api/v1/cart/:uid/:skuId",
    async ({ params, request }) => {
      const { uid, skuId } = params;
      const body = (await request.json()) as { quantity: number };

      // 模拟：返回更新后的购物车（假设数量已变）
      return HttpResponse.json({
        uid,
        items: [
          {
            skuId: skuId as string,
            quantity: body.quantity, // 数量变成了新的
            addedAt: Date.now(),
            product: {
              name: "更新后的商品",
              price: 199,
              image: "",
              attributes: {},
            },
          },
        ],
        totalPrice: 199 * body.quantity,
        totalQuantity: body.quantity,
      });
    }
  ),

  // 拦截 DELETE /api/v1/cart/:uid/:skuId (删除商品)
  http.delete(
    "https://api.example.com/api/v1/cart/:uid/:skuId",
    ({ params }) => {
      const { uid } = params;

      // 模拟：返回空的购物车（假设删完了）
      return HttpResponse.json({
        uid,
        items: [], // 列表空了
        totalPrice: 0,
        totalQuantity: 0,
      });
    }
  ),
];
