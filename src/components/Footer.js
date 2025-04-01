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
      <div className="m-auto flex w-full flex-col justify-start px-4 sm:px-10 lg:px-12 gap-5">
        <div className="font-extrabold">
          <Link href="/impressum">Impressum</Link>
        </div>
        <div>
          <p className="font-extrabold">Address:</p>{" "}
          <span>Nürnberg, Deutschland</span>
        </div>
        <div>
          <p className="font-extrabold">Email:</p>{" "}
          <span>info@bostanci-art.de</span>
        </div>
        <div>
          <p className="font-extrabold">Soziale Medien:</p>
          <div className="flex flex-col justify-center">
            <Link
              href="https://www.instagram.com/aquarelllkunst/"
              target="_blank"
              className="group flex max-w-max items-center gap-2 hover:underline"
            >
              <FaInstagram className="transform text-xl transition-transform duration-300 group-hover:translate-x-1" />
              @aqueralllkunst
            </Link>
            <Link
              href="https://www.instagram.com/grafikermehmet/"
              target="_blank"
              className="group flex max-w-max items-center gap-2 hover:underline"
            >
              <FaInstagram className="transform text-xl transition-transform duration-300 group-hover:translate-x-1" />
              @grafikermehmet
            </Link>
            <Link
              href="https://www.instagram.com/ebrulikunst/"
              target="_blank"
              className="group flex max-w-max items-center gap-2 hover:underline"
            >
              <FaInstagram className="transform text-xl transition-transform duration-300 group-hover:translate-x-1" />
              @ebrulikunst
            </Link>
          </div>
        </div>
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
