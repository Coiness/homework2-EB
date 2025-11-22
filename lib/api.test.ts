import { describe, it, expect } from 'vitest'
import { api } from './api'

describe('API Client', () => {
  // 测试获取商品列表
  it('getProducts should fetch product list correctly', async () => {
    // 1. 调用你的 API 函数
    // 我们传入一些筛选参数，看看是否能正常工作
    const data = await api.getProducts({ page: 1, pageSize: 10 })

    // 2. 断言（验证）结果
    expect(data).toBeDefined() // 数据不应该是空的
    expect(data.items).toHaveLength(10) // 应该返回 10 个商品（根据 mock 数据）
    expect(data.page).toBe(1) // 页码应该是 1
    
    // 验证第一条数据的结构是否符合预期
    const firstItem = data.items[0]
    expect(firstItem).toHaveProperty('id')
    expect(firstItem).toHaveProperty('name')
    expect(firstItem).toHaveProperty('price')
  })

  // 测试获取商品详情
  it('getProductDetail should fetch single product correctly', async () => {
    const productId = 'prod_1'
    const data = await api.getProductDetail(productId)

    expect(data).toBeDefined()
    expect(data.id).toBe(productId)
    expect(data.name).toContain('商品详情') // 验证 mock 返回的名字
  })

  // 测试获取购物车
  it('getCart should fetch cart correctly',async()=>{
    const uid = 'userFirst'
    const data = await api.getCart(uid)

    expect(data).toBeDefined()
    expect(data.uid).toBe(uid)
    expect(data.totalPrice).toBeDefined()
    expect(data.totalQuantity).toBeDefined()

    const firstCartItem = data.items[0]
    expect(firstCartItem).toHaveProperty('skuId')
    expect(firstCartItem).toHaveProperty('quantity')
    expect(firstCartItem).toHaveProperty('addedAt')
    expect(firstCartItem).toHaveProperty('product')
  })

})