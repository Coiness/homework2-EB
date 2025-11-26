import React from "react";
import type { ProductSimple } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  items: ProductSimple[];
}

export default function Recommendations({ items }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold mb-4">相关推荐</h3>

      {/* responsive grid: small 2 cols, md 4 cols, lg 6 cols */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="group block border rounded-lg p-3 bg-white hover:shadow-lg transition-shadow duration-150"
          >
            <div className="w-full h-28 relative mb-3 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
              <Image
                src={p.image}
                alt={p.name}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {p.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {p.category}
                </div>
              </div>
              <div className="text-sm font-semibold text-amber-600 whitespace-nowrap">
                ¥{p.price}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {p.tags?.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
