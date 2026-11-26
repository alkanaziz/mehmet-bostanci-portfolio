import { fallbackImage, pageMetadata } from "@/lib/seo";

// Placeholder until the page is designed: hidden from search engines and the sitemap.
export async function generateMetadata() {
  return pageMetadata({ title: "Aktuelle Ausstellung", path: "/aktuelle-ausstellung", image: await fallbackImage(), noindex: true });
}

const AktuelleAusstellung = () => {
  return (
    <div className="mx-auto flex h-[calc(100vh-320px)] items-center justify-center">
      In Bearbeitung...
    </div>
  );
};

export default AktuelleAusstellung;
