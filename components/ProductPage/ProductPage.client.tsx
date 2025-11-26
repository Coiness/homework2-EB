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
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto p-6 w-full flex-1 flex min-h-0">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 w-full">
          <div className="w-full lg:w-2/3 shrink-0 flex flex-col">
            <div className="h-full bg-transparent p-2 md:p-4 rounded-lg flex-1 min-h-0">
              <ProductImageGallery
                images={product.images}
                defaultIndex={0}
                heroImage={selectedSku?.image ?? null}
              />
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex-1">
            <div className="h-full flex flex-col">
              <ProductInfoPanel
                product={product}
                initialSkuId={initialSkuId ?? null}
                onSelectedSkuChange={(sku) => setSelectedSku(sku)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
