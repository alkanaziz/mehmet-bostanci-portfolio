import { getPage } from "@/lib/cms";

export const metadata = { title: "Impressum - Mehmet Bostanci Art" };

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
