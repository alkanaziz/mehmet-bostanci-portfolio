import JsonLd from "@/components/JsonLd";
import ResponsiveImage from "@/components/ResponsiveImage";
import publicImageMeta from "@/data/publicImageMeta";
import { getPage, getSettings } from "@/lib/cms";
import { DEFAULT_DESCRIPTION, artistSchema, pageMetadata, websiteSchema } from "@/lib/seo";

export async function generateMetadata() {
  const { homeImage } = await getSettings();
  return pageMetadata({ description: DEFAULT_DESCRIPTION, path: "/", image: homeImage });
}

// Home image from "Site Ayarları" in the CMS; the bundled image is the fallback
// while none is chosen there. Its alt text is the image's "Alternatif metin" in WordPress.
export default async function Home() {
  const [settings, aboutPage] = await Promise.all([getSettings(), getPage("ueber-mich")]);
  const fallback = publicImageMeta.hero_img;
  const image = settings.homeImage ?? {
    src: fallback.src,
    width: fallback.width,
    height: fallback.height,
    blurDataUrl: fallback.blurDataUrl,
    alt: "",
  };

  return (
    <div className="w-full">
      <JsonLd items={[websiteSchema(), artistSchema({ settings, portrait: aboutPage.image })]} />
      {/* The page has no visible heading; this one is for search engines and screen readers. */}
      <h1 className="sr-only">Mehmet Bostanci – Künstler und Grafikdesigner aus Nürnberg</h1>
      {/* Main image of the page (LCP): high priority, size chosen by screen width */}
      <ResponsiveImage
        image={image}
        alt={image.alt || "Aquarell von Mehmet Bostanci"}
        sizes="(min-width: 1152px) 1152px, 100vw"
        priority
        className="h-auto w-full"
      />
    </div>
  );
}
