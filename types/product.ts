// 列表页展示用的简略信息
export interface ProductSimple {
  id: string; // 商品ID (SPU ID)
  name: string; // 商品名称
  price: number; // 显示价格（最低价）
  sales: number; // 销量
  image: string; // 封面图 URL (e.g., "https://cdn.example.com/t-shirt.jpg")
  tags: string[]; // 标签 (e.g., ["热销", "新品"])
}

// 具体规格商品 (SKU)
export interface ProductSku {
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
export interface ProductDetail {
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
