"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Über mich",
      link: "/ueber-mich",
    },
    {
      title: "Werke",
      link: "/werke",
    },
    {
      title: "Workshop",
      link: "/workshop",
    },
    {
      title: "Shop",
      link: "/shop",
    },
    {
      title: "Aktuelle Ausstellung",
      link: "/aktuelle-ausstellung",
    },
    {
      title: "Neues",
      link: "/neues",
    },
    {
      title: "Wita",
      link: "/wita",
    },
    {
      title: "Kontakt",
      link: "/kontakt",
    },
  ];

  return (
    <header className="flex w-full flex-col items-center justify-center">
      <div className="logo_header relative h-52 w-full bg-[url('/banner.png')] bg-cover bg-[center_top_40%]">
        <Image
          className="absolute bottom-0 lg:left-[200px]"
          src="/logo_header.png"
          alt="Bostanci Art"
          width={500}
          height={200}
        />
      </div>
      <nav className="flex w-full max-w-screen-lg items-center justify-center">
        <ul className="flex w-full flex-col items-center justify-between gap-4 py-4 font-bold lg:flex-row">
          {menuItems.map((item) => (
            <li key={item.title}>
              <a
                href={item.link}
                className={`rounded-md px-2 py-1 font-extrabold ${
                  pathname.split("/")[1] === item.link.split("/")[1]
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
