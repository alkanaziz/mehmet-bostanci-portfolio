import Image from "next/image";
import Link from "next/link";
import SocialLinks from "./SocialLinks";

/** settings: contact data from "Site Ayarları" in the CMS (see lib/cms.js). */
const Footer = ({ settings }) => {
  return (
    <footer className="flex w-full flex-col">
      <div className="inline-flex w-full items-center justify-center">
        <hr className="my-8 h-px w-full rounded-sm border-0 bg-gray-300" />
        <div className="absolute left-1/2 -translate-x-1/2 bg-white px-1">
          <Image
            className="w-48"
            src="/logo_footer.png"
            alt="Bostanci Art"
            width={500}
            height={200}
          />
        </div>
      </div>
      <div className="m-auto flex w-full flex-col justify-start gap-5 px-4 sm:px-10 lg:px-12">
        <div className="font-extrabold">
          <Link href="/impressum">Impressum</Link>
        </div>
        {settings.address && (
          <div>
            <p className="font-extrabold">Address:</p>{" "}
            <span>{settings.address}</span>
          </div>
        )}
        {settings.email && (
          <div>
            <p className="font-extrabold">Email:</p>{" "}
            <a className="hover:underline" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </div>
        )}
        {settings.social.length > 0 && (
          <div>
            <p className="font-extrabold">Soziale Medien:</p>
            <SocialLinks links={settings.social} />
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <Image
          className="w-48"
          src="/logo_footer.png"
          alt="Bostanci Art"
          width={500}
          height={200}
        />
        <p className="text-sm text-gray-500">
          {new Date().getFullYear()} &copy; Alle Rechte vorbehalten
        </p>
      </div>
    </footer>
  );
};

export default Footer;
