"use client"; // 必须是 Client Component

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 初始化搜索词为 URL 中的 query 参数
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = () => {
    // 为了获取过滤器等其他参数
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query"); // 如果清空了，就删掉参数
    }

    // 导航到新的 URL
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
      <Search className="text-gray-500 mr-2" />
      <Input
        type="text"
        placeholder="搜索商品..."
        className="border-none focus:ring-0 flex-1"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <Button variant="default" size="sm" onClick={handleSearch}>
        搜索
      </Button>
    </div>
  );
}
