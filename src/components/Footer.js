import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="inline-flex w-full items-center justify-center">
        <hr className="my-8 h-[2px] w-full rounded border-0 bg-black" />
        <div className="absolute left-1/2 -translate-x-1/2 bg-slate-100 px-1">
          <Image
            className="w-32"
            src="/logo_footer.png"
            alt="Bostanci Art"
            width={500}
            height={200}
          />
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-start">
        <div className="font-extrabold">
          <a href="/impressum">Impressum</a>
        </div>
        <div>
          <p className="font-extrabold">Address:</p>{" "}
          <span>Erfurt, Deutschland</span>
        </div>
        <div>
          <p className="font-extrabold">Email:</p>{" "}
          <span>info@bostanci-art.de</span>
        </div>
        <div>
          <p className="font-extrabold">Telefon:</p>{" "}
          <span>+49 123 456 789</span>
        </div>
        <div>
          <p className="font-extrabold">Soziale Medien:</p>
          <div className="flex justify-center gap-3">
            <span>@aqueralllkunst</span>
            <span>@grafikermehmet</span>
            <span>@ebrulikunst</span>
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
