import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import SocialLinks from "@/components/SocialLinks";
import { getPage, getSettings } from "@/lib/cms";

export const metadata = { title: "Kontakt - Mehmet Bostanci Art" };

// Intro text from the CMS page "kontakt", contact data from "Site Ayarları".
export default async function Kontakt() {
  const [page, settings] = await Promise.all([getPage("kontakt"), getSettings()]);

  return (
    <div className="px-4 py-8 sm:px-10 lg:px-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-serif text-3xl font-bold">{page.title}</h1>
        <div className="cms-content mx-auto text-gray-600" dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8 rounded-lg bg-gray-50">
          <div className="m-4 space-y-6">
            <h2 className="text-center font-serif text-xl font-semibold">Kontaktinformationen</h2>

            {settings.email && (
              <div className="flex items-start space-x-4">
                <MdEmail className="mt-1 size-6 text-gray-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${settings.email}`} className="hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>
            )}

            {settings.address && (
              <div className="flex items-start space-x-4">
                <MdLocationOn className="mt-1 size-6 text-gray-600" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p>{settings.address}</p>
                </div>
              </div>
            )}

            {settings.social.length > 0 && (
              <div className="flex items-start space-x-4">
                <FaInstagram className="mt-1 size-6 text-gray-600" />
                <div>
                  <p className="font-medium">Social Media</p>
                  <SocialLinks links={settings.social} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
