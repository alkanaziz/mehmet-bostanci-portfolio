import ContactForm from "@/components/ContactForm";
import { getPage, getSettings, pageExists } from "@/lib/cms";

export const metadata = { title: "Kontakt - Mehmet Bostanci Art" };

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
