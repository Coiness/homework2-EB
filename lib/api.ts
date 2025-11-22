import { GetProductsResponse,ProductFilter,ProductDetail,Cart,CartItem} from "@/types";

const BASE_URL = "https://api.example.com/api/v1";

async function fetcher<T>(endpoint:string,options?:RequestInit):Promise<T>{
    const res = await fetch(`${BASE_URL}${endpoint}`,{...options})

    if(!res.ok){
        throw new Error(`API Error: ${res.statusText}`)
    }

    return res.json();
}

export const api = {
    // 获取商品列表
    getProducts:(filter?:ProductFilter) =>{
        const params = new URLSearchParams();
        if(filter){
            Object.entries(filter).forEach(([key,value]) => {
                if(value !== undefined) params.append(key,String(value))
            })
        }
        return fetcher<GetProductsResponse>(`/products?${params.toString()}`);
    },

    // 获取商品详情
    getProductDetail:(id:string) =>{
        return fetcher<ProductDetail>(`/product/${id}`)
    },

    // 获取购物车
    getCart:(uid:string) =>{
        return fetcher<Cart>(`/cart/${uid}`)
    },

    // 将物品加入购物车
    addToCart: (uid: string, skuId: string, quantity: number) => {
        return fetcher<Cart>(`/cart/${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                skuId,
                quantity,
                addedAt: Date.now()
            }),
        });
    },
}

