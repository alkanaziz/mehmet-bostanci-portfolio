import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { getPage, getSettings, pageExists } from "@/lib/cms";
import { ARTIST_ID, absoluteUrl, breadcrumbSchema, describe, fallbackImage, pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = await getPage("kontakt");
  return pageMetadata({
    title: "Kontakt",
    description: describe(page.html),
    path: "/kontakt",
    image: await fallbackImage(),
  });
}

// Intro text from the CMS page "kontakt"; the form is handled by public/api/kontakt.php.
// Contact data from "Site Ayarları" is shown in the footer.
export default async function Kontakt() {
  const [page, settings, hasPrivacyPage] = await Promise.all([
    getPage("kontakt"),
    getSettings(),
    pageExists("datenschutz"),
  ]);

  return (
    <div className="px-4 py-8 sm:px-10 lg:px-12">
      <JsonLd
        items={[
          { "@type": "ContactPage", url: absoluteUrl("/kontakt"), name: "Kontakt – Mehmet Bostanci", about: { "@id": ARTIST_ID } },
          breadcrumbSchema([{ name: "Kontakt", path: "/kontakt" }]),
        ]}
      />
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-serif text-3xl font-bold">{page.title}</h1>
        <div
          className="cms-content mx-auto text-gray-600"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ContactForm
          email={settings.email}
          privacyHref={hasPrivacyPage ? "/datenschutz" : null}
        />
      </div>
    </div>
  );
}
