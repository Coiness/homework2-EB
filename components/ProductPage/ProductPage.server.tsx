import React from "react";
import type { ProductDetail } from "@/types";
import ProductPageClient from "./ProductPage.client";
import Image from "next/image";

export interface ProductPageProps {
  product: ProductDetail;
  initialSkuId?: string | null;
}

/**
 * Server component wrapper for a Product Detail page.
 * - Fetching happens at the page route; this component focuses on layout + passing data to client components.
 * - Key business logic like `onAddToCart` is intentionally left as TODO callbacks to be implemented in client code / store.
 */
export default function ProductPage({
  product,
  initialSkuId,
}: ProductPageProps) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client wrapper - keep selectedSku in client state and synchronize gallery & info panel */}
        <ProductPageClient
          product={product}
          initialSkuId={initialSkuId ?? null}
        />
      </div>

      {/* Recommendations — simple server-side mapping (rendered statically) */}
      {product.recommendations?.length ? (
        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-4">相关推荐</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.recommendations.map((p) => (
              <div key={p.id} className="border rounded p-3">
                <Image
                  loading="lazy"
                  src={p.image}
                  alt={p.name}
                  className="w-full h-32 object-cover mb-2"
                />
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">¥{p.price}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
