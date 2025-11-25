"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ProductSimple } from "@/types/product";
import { DisplaySection } from "./DisplaySection";
import { Toolbar } from "./Toolbar";

interface Props {
  products: ProductSimple[];
  currentPage: number;
  totalPages: number;
  layout?: "grid" | "list";
  productCount?: number;
  defaultSort?: string;
}

/**
 * Client wrapper used on product list page.
 * Responsibilities:
 * - Provide client-side callbacks for DisplaySection such as onProductClick and onPageChange
 * - Update the URL search params (page, layout) and navigate using the router
 */
export default function ProductsClient({
  products,
  currentPage,
  totalPages,
  layout = "grid",
  productCount = 0,
  defaultSort = "default",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Keep layout purely client-side (no URL changes for layout) — requirement from your choice
  const [localLayout, setLocalLayout] = useState<"grid" | "list">(layout);

  // Navigate to product detail page when an item is clicked
  const onProductClick = (id: string) => {
    // By default we navigate to the product page. If you want modal behavior,
    // replace this with custom logic (open modal + fetch data, etc.).
    router.push(`/product/${id}`);
  };

  // Page change should update the URL's `page` query param and keep other params
  const onPageChange = (page: number) => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(
        params.toString() ? `${pathname}?${params.toString()}` : pathname
      );
    } catch (e) {
      // ignore
    }
  };

  // sorting: keep the old behaviour (update query param sort & reset page)
  const onSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort && sort !== "default") params.set("sort", sort);
    else params.delete("sort");
    params.set("page", "1");
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  };

  const onLayoutChange = (l: "grid" | "list") => setLocalLayout(l);

  return (
    <div>
      <Toolbar
        currentSort={defaultSort}
        currentLayout={localLayout}
        productCount={productCount}
        onSortChange={onSortChange}
        onLayoutChange={onLayoutChange}
      />

      <DisplaySection
        products={products}
        layout={localLayout}
        isLoading={false}
        isEmpty={products.length === 0}
        error={null}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onProductClick={onProductClick}
      />
    </div>
  );
}
