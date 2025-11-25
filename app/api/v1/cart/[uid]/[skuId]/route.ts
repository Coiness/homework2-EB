// app/api/v1/cart/[uid]/[skuId]/route.ts
// API: PATCH /api/v1/cart/:uid/:skuId  - 更新某个 sku 的数量
// API: DELETE /api/v1/cart/:uid/:skuId - 从购物车移除 sku

import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function PATCH(
  request: Request,
  { params }: { params: { uid: string; skuId: string } }
) {
  const { uid: rawUid, skuId } = params;
  const uid = rawUid ?? "1";
  const body = await request.json().catch(() => ({}));
  try {
    const c = db.updateCartItem(uid, skuId, Number(body.quantity ?? 0));
    return NextResponse.json(c);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { uid: string; skuId: string } }
) {
  const { uid: rawUid, skuId } = params;
  const uid = rawUid ?? "1";
  try {
    const c = db.removeFromCart(uid, skuId);
    return NextResponse.json(c);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
