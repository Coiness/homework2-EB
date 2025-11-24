"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { FilterGroup } from "./FilterGroup";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("category", id);
    else params.delete("category");
    // 更换分类后重置到首页
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <FilterGroup grouptitle="分类">
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => handleSelect("")}
            className={cn(
              "text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-100",
              currentCategory === ""
                ? "font-semibold bg-gray-100"
                : "text-gray-600"
            )}
          >
            全部商品
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => handleSelect(cat.id)}
              className={cn(
                "text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-100",
                currentCategory === cat.id
                  ? "font-semibold bg-gray-100"
                  : "text-gray-600"
              )}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </FilterGroup>
  );
}
