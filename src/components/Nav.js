"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = () => {
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
      title: "Kontakt",
      link: "/kontakt",
    },
  ];
  return (
    <nav className="sticky sm:px-10 top-0 z-50 flex w-full items-center justify-center bg-white bg-opacity-80 shadow-xl ">
      <ul className="hidden w-full items-center justify-between gap-4 py-4 lg:flex">
        {menuItems.map((item) => (
          <li key={item.title}>
            <Link
              href={item.link}
              className={`rounded-md px-2 py-1 font-bold ${
                pathname.split("/")[1] === item.link.split("/")[1]
                  ? "bg-black text-white"
                  : "hover:underline"
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
