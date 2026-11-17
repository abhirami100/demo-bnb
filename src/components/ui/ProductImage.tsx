"use client";

import { useEffect, useRef, useState } from "react";
import { imgSrc, imgSrcSet, itemLabel } from "@/data/collections";
import type { GalleryItem } from "@/data/types";
import { cn } from "@/lib/cn";

type Props = {
  item: GalleryItem;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Blend white studio backgrounds into the surface below. */
  blend?: boolean;
  fit?: "contain" | "cover";
};

/** Genuine product photo with responsive webp variants, lazy loading and a soft fade-in. */
export function ProductImage({ item, sizes = "(min-width: 1024px) 25vw, 50vw", className, imgClassName, priority, blend = true, fit = "contain" }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);
  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <img
        ref={ref}
        src={imgSrc(item)}
        srcSet={imgSrcSet(item)}
        sizes={sizes}
        width={item.w}
        height={item.h}
        alt={itemLabel(item)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        onLoad={() => setLoaded(true)}
        className={cn(
          "size-full transition-[opacity,filter,scale] duration-700 ease-out-expo",
          fit === "contain" ? "object-contain" : "object-cover",
          blend && "on-paper",
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md scale-[1.03]",
          imgClassName,
        )}
      />
    </span>
  );
}
