import Image from "next/image";

/** Gallery thumbnail: uses the small CMS size, not the full image. */
export default function ImgContainer({ photo }) {
  return (
    <div className="w-62.5 justify-self-end">
      <div className="relative overflow-hidden">
        <Image
          src={photo.thumb}
          alt={photo.alt}
          width={photo.thumbWidth}
          height={photo.thumbHeight}
          placeholder={photo.blurDataUrl ? "blur" : "empty"}
          blurDataURL={photo.blurDataUrl}
          sizes="250px"
          className="border border-gray-300"
        />
        <div className="absolute inset-0 hidden items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100 md:flex">
          <span className="rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-xs">
            Vergrößern
          </span>
        </div>
      </div>
    </div>
  );
}
