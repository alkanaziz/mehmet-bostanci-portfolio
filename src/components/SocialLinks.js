import { FaGlobe, FaInstagram } from "react-icons/fa6";

/** Social media links from "Site Ayarları" in the CMS. */
export default function SocialLinks({ links }) {
  return (
    <div className="flex flex-col justify-center">
      {links.map(({ url, label }) => {
        const Icon = url.includes("instagram.com") ? FaInstagram : FaGlobe;
        return (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex max-w-max items-center gap-2 hover:underline"
          >
            <Icon className="transform text-xl transition-transform duration-300 group-hover:translate-x-1" />
            {label}
          </a>
        );
      })}
    </div>
  );
}
