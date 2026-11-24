import Image from "next/image";
import publicImageMeta from "@/data/publicImageMeta";
import { getSettings } from "@/lib/cms";

// Home image from "Site Ayarları" in the CMS; the bundled image is the fallback
// while none is chosen there.
export default async function Home() {
  const fallback = publicImageMeta.hero_img;
  const image = (await getSettings()).homeImage ?? {
    src: fallback.src,
    width: fallback.width,
    height: fallback.height,
    blurDataUrl: fallback.blurDataUrl,
  };

  return (
    <div className="w-full">
      <Image
        className="w-full"
        src={image.src}
        alt="Bostanci Art Home Page Image"
        width={image.width}
        height={image.height}
        placeholder={image.blurDataUrl ? "blur" : "empty"}
        blurDataURL={image.blurDataUrl}
        priority
      />
    </div>
  );
}
