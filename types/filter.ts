export interface ProductFilter {
  query?: string; // 搜索关键词
  category?: string; // 商品分类 ID
  minPrice?: number; // 最低价格
  maxPrice?: number; // 最高价格
  tags?: string[]; // 标签筛选
  sort?: "default" | "price_asc" | "price_desc" | "sales" | "newest"; // 排序方式
  page: number; // 当前页码
  pageSize: number; // 每页数量
}
