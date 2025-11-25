"use client";
import React, { useMemo, useState } from "react";
import type { ProductDetail, ProductSku } from "@/types";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfoPanel from "./ProductInfoPanel";

interface Props {
  product: ProductDetail;
  initialSkuId?: string | null;
}

/**
 * Client-side wrapper that keeps selectedSku in sync between the gallery and the info panel.
 * - Uses initialSkuId when available to set initial selected SKU.
 * - Receives `onAddToCart` from ProductInfoPanel and forwards as needed (left as-is).
 */
export default function ProductPageClient({ product, initialSkuId }: Props) {
  // find initial SKU object if initialSkuId provided — fallback to the first sku
  const initialSku = useMemo<ProductSku | undefined>(() => {
    // Prefer a valid non-empty initialSkuId. If missing or empty, fall back to first sku.
    if (!initialSkuId) return product.skus?.[0];
    return (
      product.skus?.find((s) => s.id === initialSkuId) ?? product.skus?.[0]
    );
  }, [initialSkuId, product.skus]);

  // selected SKU is the source of truth for the client side
  const [selectedSku, setSelectedSku] = useState<ProductSku | undefined>(
    initialSku
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {/* gallery uses selectedSku.image as hero when available */}
          <ProductImageGallery
            images={product.images}
            defaultIndex={0}
            heroImage={selectedSku?.image ?? null}
          />
        </div>

        <div>
          <ProductInfoPanel
            product={product}
            initialSkuId={initialSkuId ?? null}
            // pass selectedSku down so the panel can render the correct price/stock
            // and emit skuid changes so parent can update gallery + URL.
            onSelectedSkuChange={(sku) => setSelectedSku(sku)}
          />
        </div>
      </div>

      {/* Recommendations (client doesn't need to own this) */}
    </div>
  );
}
