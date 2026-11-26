import { getPage, pageExists } from "@/lib/cms";
import { fallbackImage, pageMetadata } from "@/lib/seo";

// Hidden from search engines while it is only a placeholder.
export async function generateMetadata() {
  const exists = await pageExists("datenschutz");
  return pageMetadata({
    title: "Datenschutzerklärung",
    description: exists ? "Datenschutzerklärung von Mehmet Bostanci Art: welche Daten beim Besuch dieser Website verarbeitet werden." : undefined,
    path: "/datenschutz",
    image: await fallbackImage(),
    noindex: !exists,
  });
}

// Text from the CMS page "datenschutz". Until that page exists, a placeholder is
// shown; footer and contact form only link here once it exists.
export default async function Datenschutz() {
  if (!(await pageExists("datenschutz"))) {
    return (
      <div className="mx-auto flex h-[calc(100vh-320px)] items-center justify-center">In Bearbeitung...</div>
    );
  }
  const page = await getPage("datenschutz");

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
