import JsonLd from "@/components/JsonLd";
import UeberMich from "@/components/UeberMich";
import { getPage, getSettings } from "@/lib/cms";
import { absoluteUrl, artistSchema, breadcrumbSchema, describe, pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = await getPage("ueber-mich");
  return pageMetadata({
    title: "Über mich",
    description: describe(page.html),
    path: "/ueber-mich",
    image: page.image,
    type: "profile",
  });
}

// Text and portrait from the CMS page "ueber-mich".
export default async function UeberMichPage() {
  const [page, settings] = await Promise.all([getPage("ueber-mich"), getSettings()]);
  return (
    <>
      <JsonLd
        items={[
          {
            "@type": "ProfilePage",
            url: absoluteUrl("/ueber-mich"),
            name: "Über mich – Mehmet Bostanci",
            mainEntity: artistSchema({ settings, portrait: page.image }),
          },
          breadcrumbSchema([{ name: "Über mich", path: "/ueber-mich" }]),
        ]}
      />
      <UeberMich page={page} />
    </>
  );
}
