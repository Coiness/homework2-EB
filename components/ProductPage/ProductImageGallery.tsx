"use client";
import Image from "next/image";
// Use next/image with `fill` for the main image (better optimization).
// Parent container must be position:relative and have explicit height so fill doesn't
// expand to the viewport. Thumbnails use Image with fixed width/height.
import React, { useState, useEffect, useMemo, useRef } from "react";

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
  const initialIndex = heroImage ? 0 : defaultIndex;
  const [index, setIndex] = useState(initialIndex);

  // combine hero image (if provided) with images list, ensuring heroImage is shown first
  const galleryImages = useMemo(() => {
    if (!images || images.length === 0) return images ?? [];
    if (heroImage) return [heroImage, ...images.filter((i) => i !== heroImage)];
    return images;
  }, [images, heroImage]);

  // NOTE: render fallback placeholder in JSX; do not early return to keep Hooks consistent

  const mainImage = galleryImages[index] ?? galleryImages[0];

  // Keep index valid when galleryImages change (e.g., heroImage toggles)
  // Only reset index to 0 if heroImage actually changed, not on every render.
  const prevHeroRef = useRef<string | null>(null);
  useEffect(() => {
    if (!galleryImages || galleryImages.length === 0) return;

    // If heroImage changed new value -> reset to first image
    if (heroImage !== prevHeroRef.current) {
      prevHeroRef.current = heroImage ?? null;
      if (heroImage) {
        setIndex(0);
        return;
      }
    }

    // If galleryImages shrunk and current index is out-of-bounds, reset index
    if (index >= galleryImages.length) {
      setIndex(0);
    }
    // intentionally do not include `index` in deps to avoid resetting when index changes
  }, [galleryImages, heroImage]);

  return (
    <div className="flex flex-col h-full">
      {galleryImages.length === 0 ? (
        <div className="bg-gray-100 w-full h-64 md:h-96 flex items-center justify-center rounded-md">
          无图片
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border bg-linear-to-br from-gray-50 via-white to-gray-100 mb-4 w-full h-[360px] sm:h-[420px] md:h-[520px] lg:h-[640px]">
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

          {/* 左右切换按钮 */}
          {galleryImages.length > 1 && (
            <>
              <button
                aria-label="prev image"
                onClick={() =>
                  setIndex(
                    (idx) =>
                      (idx - 1 + galleryImages.length) % galleryImages.length
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/75 dark:bg-black/60 text-slate-800 hover:bg-white rounded-full p-2 shadow-md"
              >
                ‹
              </button>
              <button
                aria-label="next image"
                onClick={() =>
                  setIndex((idx) => (idx + 1) % galleryImages.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/75 dark:bg-black/60 text-slate-800 hover:bg-white rounded-full p-2 shadow-md"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto md:justify-start pb-2">
        {galleryImages.map((src, i) => (
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
