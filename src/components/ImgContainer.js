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
      <div className="relative overflow-hidden">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          placeholder="blur"
          blurDataURL={photo.blurDataUrl}
          sizes="250px"
          className="border border-gray-300"
        />
        <div className="absolute inset-0 hidden items-center justify-center bg-black bg-opacity-0 opacity-0 transition-opacity duration-300 hover:bg-opacity-20 hover:opacity-100 md:flex">
          <span className="rounded-full bg-black bg-opacity-50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            Vergrößern
          </span>
        </div>
      </div>
    </div>
  );
}
