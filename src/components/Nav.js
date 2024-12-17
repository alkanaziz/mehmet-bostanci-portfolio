"use client";

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
    <nav className="sticky top-0 z-50 flex w-full items-center justify-center bg-white bg-opacity-80 shadow-xl">
      <ul className="flex w-full max-w-screen-lg flex-col items-center justify-between gap-4 py-4 font-bold lg:flex-row">
        {menuItems.map((item) => (
          <li key={item.title}>
            <a
              href={item.link}
              className={`rounded-md px-2 py-1 font-extrabold ${
                pathname.split("/")[1] === item.link.split("/")[1]
                  ? "bg-black text-white"
                  : "hover:underline"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
