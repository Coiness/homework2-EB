// api 响应结构
import { ProductDetail,ProductSimple,ProductSku } from "@/types"

export interface GetProductsResponse{
    items: ProductSimple[],
    total: number,
    page: number,
    pageSize: number,
    hasMore: boolean
}