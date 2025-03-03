import Image from "next/image";
import publicImageMeta from "@/data/publicImageMeta";

export default async function Home() {
  return (
    <div className="w-full">
      <Image
        className="w-full"
        src={publicImageMeta.banner.src}
        alt="Bostanci Art Home Page Image"
        width={publicImageMeta.banner.width}
        height={publicImageMeta.banner.height}
        placeholder="blur"
        blurDataURL={publicImageMeta.banner.blurDataUrl}
      />
    </div>
  );
}
