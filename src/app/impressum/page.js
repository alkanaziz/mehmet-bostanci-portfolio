import { getPage } from "@/lib/cms";
import { fallbackImage, pageMetadata } from "@/lib/seo";

// Legal page: a fixed description reads better in search results than the legal text.
export async function generateMetadata() {
  return pageMetadata({
    title: "Impressum",
    description: "Impressum und Kontaktangaben von Mehmet Bostanci Art, Künstler und Grafikdesigner aus Nürnberg.",
    path: "/impressum",
    image: await fallbackImage(),
  });
}

// Text from the CMS page "impressum".
export default async function Impressum() {
  const page = await getPage("impressum");

  return (
    <div className="mx-auto min-h-[calc(100vh-320px)] max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{page.title}</h1>
      <div
        className="cms-content text-gray-700 [&_a]:hover:underline"
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </div>
  );
}
