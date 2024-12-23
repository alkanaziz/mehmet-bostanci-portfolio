import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="flex w-full flex-col">
      <div className="inline-flex w-full items-center justify-center">
        <hr className="my-8 h-[1px] w-full rounded border-0 bg-gray-300" />
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
      <div className="m-auto flex w-3/5 flex-col gap-5">
        <div className="font-extrabold">
          <Link href="/impressum">Impressum</Link>
        </div>
        <div>
          <p className="font-extrabold">Address:</p>{" "}
          <span>Erfurt, Deutschland</span>
        </div>
        <div>
          <p className="font-extrabold">Telefon:</p>{" "}
          <span>WhatsApp: 0176 741 759 50</span>
        </div>
        <div>
          <p className="font-extrabold">Email:</p>{" "}
          <span>info@bostanci-art.de</span>
        </div>
        <div>
          <p className="font-extrabold">Soziale Medien:</p>
          <div className="flex flex-col justify-center">
            <a
              href="https://www.instagram.com/aquarelllkunst/"
              target="_blank"
              className="flex items-center gap-2 hover:underline"
            >
              <FaInstagram className="text-xl" />
              @aqueralllkunst
            </a>
            <a
              href="https://www.instagram.com/grafikermehmet/"
              target="_blank"
              className="flex items-center gap-2 hover:underline"
            >
              <FaInstagram className="text-xl" />
              @grafikermehmet
            </a>
            <a
              href="https://www.instagram.com/ebrulikunst/"
              target="_blank"
              className="flex items-center gap-2 hover:underline"
            >
              <FaInstagram className="text-xl" />
              @ebrulikunst
            </a>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <Image
          className="w-72"
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
