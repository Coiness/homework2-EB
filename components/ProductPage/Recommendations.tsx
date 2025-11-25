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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="block border rounded p-3 hover:shadow-sm"
          >
            <div className="w-full h-32 relative mb-2">
              <Image
                src={p.image}
                alt={p.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="text-sm font-medium">{p.name}</div>
            <div className="text-xs text-gray-500">¥{p.price}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
