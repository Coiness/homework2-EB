## 数据结构设计

商品

```typescript
// 列表页展示用的简略信息
interface ProductSimple {
  id: string; // 商品ID (SPU ID)
  name: string; // 商品名称
  price: number; // 显示价格（最低价）
  sales: number; // 销量
  image: string; // 封面图 URL (e.g., "https://cdn.example.com/t-shirt.jpg")
  tags: string[]; // 标签 (e.g., ["热销", "新品"])
}

// 具体规格商品 (SKU)
interface ProductSku {
  id: string; // SKU ID (唯一标识，如 "sku_123")
  productId: string; // 关联的 SPU ID
  name: string; // SKU 名称 (e.g., "红色 T恤 S码")
  price: number; // 该规格的价格
  stock: number; // 库存
  image: string; // 该规格对应的图片 URL
  attributes: {
    // 该 SKU 选中的属性组合
    [key: string]: string; // e.g., { color: "red", size: "s" }
  };
}

// 商品详情页完整信息 (SPU)
interface ProductDetail {
  id: string; // SPU ID
  name: string; // 商品名称
  description: string; // 商品描述
  priceRange: {
    // 价格区间
    min: number;
    max: number;
  };
  sales: number; // 总销量
  images: string[]; // 主图轮播列表 URLs

  // 动态属性定义 (用于渲染选择器)
  attributes: {
    name: string; // 属性名 (e.g., "颜色")
    key: string; // 属性键 (e.g., "color")
    values: {
      value: string; // 属性值 (e.g., "red")
      label: string; // 显示文本 (e.g., "红色")
      image?: string; // 可选：属性对应的缩略图
    }[];
  }[];

  // 所有可用的 SKU 列表 (用于前端判断库存和价格)
  skus: ProductSku[];

  // 推荐商品
  recommendations: ProductSimple[];
}
```

过滤器

```typescript
interface ProductFilter {
  query?: string; // 搜索关键词
  category?: string; // 商品分类 ID
  minPrice?: number; // 最低价格
  maxPrice?: number; // 最高价格
  tags?: string[]; // 标签筛选
  sort?: "default" | "price_asc" | "price_desc" | "sales" | "newest"; // 排序方式
  page: number; // 当前页码
  pageSize: number; // 每页数量
}
```

购物车

```typescript
interface CartItem {
  skuId: string; // 购物车存的是 SKU ID
  quantity: number; // 购买数量
  addedAt: number; // 添加时间 (用于排序)
  // 前端展示时，通常需要根据 skuId 去 fetch 实时信息，或者后端直接返回聚合后的信息
  // 下面是后端聚合返回时可能包含的字段：
  product?: {
    name: string;
    image: string;
    price: number;
    attributes: { [key: string]: string };
  };
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}
```

## API 接口设计

```typescript
// 1. 查询商品列表
// GET /api/v1/products?page=1&pageSize=12&category=clothes&sort=price_asc
interface GetProductsResponse {
  items: ProductSimple[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 2. 查询商品详情
// GET /api/v1/products/:id
// 返回 ProductDetail

// 3. 购物车相关
// GET /api/v1/cart
// 返回 Cart

// POST /api/v1/cart
// Body: { skuId: string, quantity: number }

// PATCH /api/v1/cart/:skuId
// Body: { quantity: number }

// DELETE /api/v1/cart/:skuId
```
