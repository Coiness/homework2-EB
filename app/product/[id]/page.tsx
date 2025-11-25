import React from "react";
import type { Metadata } from "next";
import ProductPage from "@/components/ProductPage/ProductPage.server";
import { db } from "@/lib/data";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // simple example metadata — if product missing, return default
  const p = db.getProductDetail(id);
  return { title: p ? p.name : "商品详情" };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string } | Promise<{ id: string }>;
  // searchParams can be an object or a Promise resolving to the object
  searchParams?: { skuid?: string } | Promise<{ skuid?: string }>;
}) {
  const { id } = await params;

  // Server-side fetch: use in-memory db for now. You can replace with Prisma/db later.
  const product = db.getProductDetail(id);
  if (!product) return notFound();

  // We render a server wrapper component which passes data to client subcomponents.
  // TODO: Decide if you want to support an initial `skuid` from search params — currently omitted.
  // resolve searchParams if it's a Promise (app router may pass a Promise in some runtimes)
  const resolvedSearchParams = await (searchParams as any);
  const initialSkuId =
    (resolvedSearchParams?.skuid as string | undefined) ?? null;
  return <ProductPage product={product} initialSkuId={initialSkuId} />;
}
