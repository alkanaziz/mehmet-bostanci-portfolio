import { fallbackImage, pageMetadata } from "@/lib/seo";

// Placeholder until the page is designed: hidden from search engines and the sitemap.
export async function generateMetadata() {
  return pageMetadata({ title: "Neues", path: "/neues", image: await fallbackImage(), noindex: true });
}

const Neues = () => {
  return (
    <div className="mx-auto flex h-[calc(100vh-320px)] items-center justify-center">
      In Bearbeitung...
    </div>
  );
};

export default Neues;
