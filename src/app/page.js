import Image from "next/image";
import publicImageMeta from "@/data/publicImageMeta";

export default async function Home() {
  return (
    <div className="w-full">
      <Image
        className="w-full"
        src={publicImageMeta.hero_img.src}
        alt="Bostanci Art Home Page Image"
        width={publicImageMeta.hero_img.width}
        height={publicImageMeta.hero_img.height}
        placeholder="blur"
        blurDataURL={publicImageMeta.hero_img.blurDataUrl}
      />
    </div>
  );
}
