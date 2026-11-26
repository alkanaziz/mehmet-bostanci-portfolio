"use client";

import { useCallback } from "react";

/**
 * <img> with srcset from the WordPress image sizes (lib/cms.js toImage), so the
 * browser downloads the size that fits the screen. next/image cannot do this here:
 * the static export serves images unoptimized (no srcset).
 *
 * image: { src, srcSet, width, height, alt, blurDataUrl }
 * sizes: the CSS width the image is shown at, e.g. "(min-width: 1152px) 1152px, 100vw"
 * priority: main image of the page (loads first, not lazily)
 * onLoad: also called when the image was already loaded (e.g. from the cache or a
 *         preload) before React attached the handler.
 */
export default function ResponsiveImage({ image, sizes, alt, priority = false, onLoad, className, style }) {
  const checkComplete = useCallback(
    (img) => {
      if (img && onLoad && img.complete && img.naturalWidth > 0) onLoad();
    },
    [onLoad],
  );

  return (
    <img
      ref={checkComplete}
      src={image.src}
      srcSet={image.srcSet || undefined}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt ?? ""}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onLoad={onLoad}
      className={className}
      style={{
        ...(image.blurDataUrl
          ? { backgroundImage: `url(${image.blurDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : {}),
        ...style,
      }}
    />
  );
}
