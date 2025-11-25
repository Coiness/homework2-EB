// app/api/v1/products/route.ts
// API: GET /api/v1/products
// - 返回分页的商品列表（基于 lib/store 的内存数据）
// - 支持常用筛选字段：query, tags, minPrice, maxPrice, sort
// API: POST /api/v1/products
// - 简单示例：接受 body 并返回已创建对象（非持久化）

import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1") || 1;
  const pageSize = Number(url.searchParams.get("pageSize") ?? "12") || 12;

  // parse common filter params
  const query = url.searchParams.get("query") ?? undefined;
  const category = url.searchParams.get("category") ?? undefined;
  const tagsRaw = url.searchParams.getAll("tags");
  // tags may be comma-separated in a single value (eg: tags=hot,new)
  const tags: string[] | undefined = tagsRaw?.length
    ? tagsRaw.flatMap((t) => (t ? String(t).split(",") : [])).filter(Boolean)
    : undefined;
  const minPrice = url.searchParams.get("minPrice")
    ? Number(url.searchParams.get("minPrice"))
    : undefined;
  const maxPrice = url.searchParams.get("maxPrice")
    ? Number(url.searchParams.get("maxPrice"))
    : undefined;
  const sort = (url.searchParams.get("sort") as string) || undefined;

  // Start with all products and apply filters
  let results = db.getProducts();

  if (query) {
    const q = query.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  if (tags && tags.length > 0) {
    results = results.filter((p) => tags.every((t) => p.tags.includes(t)));
  }

  if (minPrice !== undefined) {
    results = results.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    results = results.filter((p) => p.price <= maxPrice);
  }

  // Sorting
  if (sort === "price_asc") {
    results = results.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    results = results.sort((a, b) => b.price - a.price);
  } else if (sort === "sales") {
    results = results.sort((a, b) => b.sales - a.sales);
  }

  const total = results.length;
  const start = (page - 1) * pageSize;
  const items = results.slice(start, start + pageSize);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    hasMore: start + items.length < total,
  });
}

export async function POST(request: Request) {
  // 仅示例：直接回传请求体作为“创建的资源”，不做持久化
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ created: body }, { status: 201 });
}
