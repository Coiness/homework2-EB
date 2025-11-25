"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterGroup } from "./FilterGroup";

export function PriceRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [min, setMin] = useState(searchParams.get("minPrice") || "");
  const [max, setMax] = useState(searchParams.get("maxPrice") || "");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (min) params.set("minPrice", String(min));
    else params.delete("minPrice");

    if (max) params.set("maxPrice", String(max));
    else params.delete("maxPrice");

    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <FilterGroup grouptitle="价格区间">
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="number"
          placeholder="¥ 最低"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="h-8 text-xs"
        />
        <span className="text-gray-400">-</span>
        <Input
          type="number"
          placeholder="¥ 最高"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full h-8 text-xs"
        onClick={handleApply}
      >
        应用
      </Button>
    </FilterGroup>
  );
}
