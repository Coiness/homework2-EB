export interface CartItem {
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

export interface Cart {
  uid: string;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}
