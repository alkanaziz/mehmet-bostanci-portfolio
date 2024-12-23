"use client";

import Image from "next/image";

export default function ImgContainer({ photo }) {
  const heightWidthRatio = photo.height / photo.width;
  const galleryHeight = Math.ceil(250 * heightWidthRatio);
  const photoSpans = Math.ceil(galleryHeight / 10) + 1;

  return (
    <div
      className="w-[250px] justify-self-center"
      style={{ gridRow: `span ${photoSpans}` }}
    >
      <div className="rounded-2xl overflow-hidden group">
        <Image
          src={photo.src.large}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          placeholder="blur"
          blurDataURL={photo.blurredDataUrl}
          sizes="250px"
          className="group-hover:opacity-75 object-cover clip-path-inset"
          style={{
            clipPath: 'inset(7px 7px 12px 7px)'
          }}
        />
      </div>
    </div>
  );
}
