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
      <div className="bg-gray-100 w-full h-64 md:h-96 flex items-center justify-center rounded-md">
        无图片
      </div>
    );
  }

  // if heroImage exists, treat it as the main image (but keep thumbnails from images[])
  const mainImage = heroImage ?? images[index];

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 rounded-lg overflow-hidden border bg-linear-to-br from-gray-50 via-white to-gray-100 mb-4 min-h-0">
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <Image
            src={mainImage}
            alt={`image-${index}`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            style={{ objectFit: "contain" }}
            priority={false}
            className="transition-transform duration-200 ease-in-out"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto md:justify-start pb-2">
        {images.map((src, i) => (
          <button
            key={src + i}
            className={`border rounded-lg p-1 bg-white flex items-center justify-center ${i === index ? "ring-2 ring-indigo-400 shadow" : "opacity-90"}`}
            onClick={() => setIndex(i)}
            aria-label={`show-image-${i}`}
          >
            <Image
              src={src}
              alt={`thumb-${i}`}
              width={88}
              height={88}
              className="rounded object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
