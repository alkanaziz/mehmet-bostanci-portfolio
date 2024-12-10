import Image from "next/image";

const Header = () => {
  return (
    <header className="flex flex-col items-center justify-center">
      <div className="logo_header relative h-52 w-full bg-[url('/banner.png')] bg-cover bg-[center_top_40%]">
        <Image
          className="absolute bottom-0 lg:left-[200px]"
          src="/logo_header.png"
          alt="Bostanci Art"
          width={500}
          height={200}
        />
      </div>
      <nav className="flex w-full max-w-[1080px] items-center justify-center">
        <ul className="flex w-full items-center justify-between space-x-4 p-4 font-bold">
          <li>
            <a href="#werke">Werke</a>
          </li>
          <li>
            <a href="#workshop">Workshop</a>
          </li>
          <li>
            <a href="#shop">Shop</a>
          </li>
          <li>
            <a href="#aktuelle_ausstellung">Aktuelle Ausstellung</a>
          </li>
          <li>
            <a href="#neues">Neues</a>
          </li>
          <li>
            <a href="#wita">Wita</a>
          </li>
          <li>
            <a href="#kontakt">Kontakt</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
