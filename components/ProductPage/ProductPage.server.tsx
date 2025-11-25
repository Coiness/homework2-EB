import React from "react";
import type { ProductDetail } from "@/types";
import ProductPageClient from "./ProductPage.client";
import Image from "next/image";
import Recommendations from "./Recommendations";

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

      {/* Recommendations — use a small server component for clarity and reuse */}
      <Recommendations items={product.recommendations ?? []} />
    </div>
  );
}
