import { getPage, pageExists } from "@/lib/cms";

export const metadata = { title: "Datenschutzerklärung - Mehmet Bostanci Art" };

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
