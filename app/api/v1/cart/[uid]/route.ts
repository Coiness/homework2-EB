// app/api/v1/cart/[uid]/route.ts
// API: GET /api/v1/cart/:uid
// - 返回指定 uid 的购物车（内存数据）
// API: POST /api/v1/cart/:uid
// - 向购物车添加 item（skuId，quantity），并返回更新后的购物车

import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { uid: string } | Promise<{ uid: string }> }
) {
  const { uid: rawUid } = await params;
  const uid = rawUid ?? "1";
  const cart = db.getCart(uid);
  return NextResponse.json(cart);
}

export async function POST(
  request: Request,
  { params }: { params: { uid: string } | Promise<{ uid: string }> }
) {
  const { uid: rawUid } = await params;
  const uid = rawUid ?? "1";
  const body = await request.json().catch(() => ({}));
  const { skuId, quantity = 1 } = body as any;
  if (!skuId)
    return NextResponse.json({ error: "skuId required" }, { status: 400 });
  const c = db.addToCart(uid, {
    skuId,
    quantity: Number(quantity) || 1,
    addedAt: Date.now(),
  });
  return NextResponse.json(c);
}
