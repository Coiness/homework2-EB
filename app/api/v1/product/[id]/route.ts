// app/api/v1/product/[id]/route.ts
// API: GET /api/v1/product/:id
// - 返回单个商品完整详情（来自 lib/store 的内存数据）

import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const product = db.getProductDetail(id);
  if (!product)
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  return NextResponse.json(product);
}
