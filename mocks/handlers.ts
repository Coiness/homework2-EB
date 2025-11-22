import { http, HttpResponse } from 'msw'
import { GetProductsResponse, ProductSimple ,CartItem} from '@/types'

// 模拟一些假数据
const mockProducts: ProductSimple[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `prod_${i + 1}`,
  name: `示例商品 ${i + 1} 号`,
  price: 99 + i * 10,
  sales: 100 + i,
  image: 'https://placehold.co/400x400/png', // 使用占位图
  tags: i % 2 === 0 ? ['热销'] : ['新品']
}))

export const handlers = [
  // 1. 拦截 GET /api/v1/products
  http.get('https://api.example.com/api/v1/products', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 10)

    // 模拟分页逻辑
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = mockProducts.slice(start, end)

    const response: GetProductsResponse = {
      items,
      total: mockProducts.length,
      page,
      pageSize,
      hasMore: end < mockProducts.length
    }

    return HttpResponse.json(response)
  }),

  // 2. 拦截 GET /api/v1/product/:id
  http.get('https://api.example.com/api/v1/product/:id', ({ params }) => {
    const { id } = params
    
    // 返回一个模拟的详情
    return HttpResponse.json({
      id,
      name: `商品详情 ${id}`,
      description: '这是一个非常棒的商品，买它！',
      priceRange: { min: 99, max: 199 },
      sales: 1000,
      images: ['https://placehold.co/600x600/png'],
      attributes: [],
      skus: [],
      recommendations: []
    })
  }),

  // 拦截 GET /api/v1/cart     一般后面要加用户ID，这里的需求暂时不需要，想了想还是加上吧
  http.get('https://api.example.com/api/v1/cart/:uid',({params}) =>{
    const {uid} = params

    return HttpResponse.json({
      uid,
      items:[
        {
          skuId:"skuId123",
          quantity:100,
          addedAt:202511221445,
          product:{
            name:"T-shirt",
            image:'https://placehold.co/600x600/png',
            price:100,
            attributes:{
              color:"red",
              size:"S",
            }
          }
        },{
          skuId:"skuId456",
          quantity:100,
          addedAt:202511221445,
          product:{
            name:"T-shirt",
            image:'https://placehold.co/600x600/png',
            price:100,
            attributes:{
              color:"red",
              size:"M",
            }
          }
        }
      ],
      totalPrice:20000,
      totalQuantity:200
    })
  })
]