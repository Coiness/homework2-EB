"use client";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  images: string[];
  defaultIndex?: number;
}

/**
 * Client component: simple image gallery.
 * - TODO: replace with a proper carousel lib if you want (e.g., Embla, Swiper)
 * - Keep UI behaviour minimal so testing / customization is easy.
 */
export default function ProductImageGallery({
  images,
  defaultIndex = 0,
}: Props) {
  const [index, setIndex] = useState(defaultIndex);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 w-full h-96 flex items-center justify-center">
        无图片
      </div>
    );
  }

  return (
    <div>
      <div className="w-full h-[520px] rounded overflow-hidden border bg-white flex items-center justify-center mb-4">
        {/* 主图 */}
        <Image
          loading="lazy"
          src={images[index]}
          alt={`image-${index}`}
          className="max-h-full object-contain"
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
              loading="lazy"
              src={src}
              alt={`thumb-${i}`}
              className="w-20 h-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
