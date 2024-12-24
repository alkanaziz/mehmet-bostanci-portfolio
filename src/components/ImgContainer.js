"use client";

import Image from "next/image";

export default function ImgContainer({ photo }) {
  const heightWidthRatio = photo.height / photo.width;
  const galleryHeight = Math.ceil(250 * heightWidthRatio);
  const photoSpans = Math.ceil(galleryHeight / 10) + 1;

  return (
    <div
      className="w-[250px] justify-self-end"
      style={{ gridRow: `span ${photoSpans}` }}
    >
      <div className="rounded-lg overflow-hidden group">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          placeholder="blur"
          blurDataURL={photo.blurredDataUrl}
          sizes="250px"
          className="group-hover:opacity-75"
        />
      </div>
    </div>
  );
}
