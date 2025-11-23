import React from "react";
import Link from "next/link";
import { ShoppingCart, Store } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
// 不需要 useSearchParams 了，因为 Menu 本身不处理参数

export function NavigationMenu() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl">
        <Store />
        <span>MyShop</span>
      </Link>

      <div className="flex-1 max-w-md mx-4">
        <SearchBar />
      </div>

      <Link href="/cart">
        <div className="p-2 hover:bg-gray-100 rounded-full">
          <ShoppingCart />
        </div>
      </Link>
    </div>
  );
}
