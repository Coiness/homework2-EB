"use client";
import Image from "next/image";
// Use next/image with `fill` for the main image (better optimization).
// Parent container must be position:relative and have explicit height so fill doesn't
// expand to the viewport. Thumbnails use Image with fixed width/height.
import React, { useState } from "react";

interface Props {
  images: string[];
  defaultIndex?: number;
  heroImage?: string | null;
}

/**
 * Client component: simple image gallery.
 * - TODO: replace with a proper carousel lib if you want (e.g., Embla, Swiper)
 * - Keep UI behaviour minimal so testing / customization is easy.
 */
export default function ProductImageGallery({
  images,
  defaultIndex = 0,
  heroImage = null,
}: Props) {
  const [index, setIndex] = useState(defaultIndex);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 w-full h-96 flex items-center justify-center">
        无图片
      </div>
    );
  }

  // if heroImage exists, treat it as the main image (but keep thumbnails from images[])
  const mainImage = heroImage ?? images[index];

  return (
    <div>
      <div className="w-full h-[520px] rounded overflow-hidden border bg-white mb-4 relative">
        {/* 主图 - 使用普通 img 保持简单并避免必须提供 width/height */}
        <Image
          src={mainImage}
          alt={`image-${index}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          style={{ objectFit: "contain" }}
          priority={false}
        />
      </div>

      {/* 缩略图列表 */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={src + i}
            className={`border rounded p-1 ${i === index ? "ring-2 ring-indigo-400" : "opacity-80"}`}
            onClick={() => setIndex(i)}
            aria-label={`show-image-${i}`}
          >
            <Image
              src={src}
              alt={`thumb-${i}`}
              width={80}
              height={80}
              className="rounded object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
