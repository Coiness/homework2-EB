# ProductPage 组件框架说明

这个目录包含商品详情页的 Server / Client 分离骨架：

- `ProductPage.server.tsx` — Server side 布局组件；接收你在 `app/product/[id]/page.tsx` 中获取的 `product` 并把数据传到 client 组件。
- `ProductImageGallery.tsx` — Client 组件（简单轮播 / 缩略图）
- `ProductInfoPanel.tsx` — Client 组件（价格、SKU 选择、数量、加入购物车按钮）

## 关键待实现点（你要填的地方）

1. SKU 选择 & 映射逻辑：
   - `ProductInfoPanel` 内的属性选择按钮目前只是 UI 占位。
   - 你需要实现“属性组合 -> SKU 映射”的逻辑（例如：选中 color=red、size=S 应该找到与之匹配的 SKU 并 setSelectedSku）。

2. 添加到购物车（持久化 / 同步）：
   - `ProductInfoPanel` 会调用传入的 `onAddToCart(skuId, quantity)`。
   - 这里你可以选择使用 `useCartStore` (Zustand) 或 `clientCart`（localStorage），例如：
     - useCartStore.getState().addToCart('1', skuId, quantity)
     - 或 import clientCart 并调用 clientCart.addItem('1', { skuId, quantity, addedAt: Date.now() })

3. 价格 / 库存校验：
   - 选 sku 后可发请求到后端检查库存或价格变动（可在 client 里调用 API），在 `ProductInfoPanel` 内 TODO 部分实现。

4. URL sync（可选）：
   - 如果你想支持从 url 的 `skuid` 读取初始选项，请在 `app/product/[id]/page.tsx` 读取 `searchParams` 或在客户端 hook 中处理。

## 如何开始

1. 在 `components/ProductPage/ProductInfoPanel.tsx` 内实现 SKU 匹配逻辑（找到合适的 SKU 并调用 setSelectedSku）。
2. 实现 onAddToCart 流程（选择 store 或 clientCart）。
3. 如需把逻辑放在全局，请修改 `app/product/[id]/page.tsx` 将必要的 props 传入，或在 client 组件里直接使用全局 store。

如果你希望我把某一个逻辑点替你写成样例（例如：把 addToCart 用 useCartStore 连线并写入 localStorage），告诉我，我可以继续实现并为你测试一遍。
