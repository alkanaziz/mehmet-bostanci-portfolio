"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import MobileNav from "./MobileNav";

const Nav = () => {
  const pathname = usePathname();
  const [isWerkeOpen, setIsWerkeOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsWerkeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubMenuClick = () => {
    setIsWerkeOpen(false);
  };

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
      subMenu: [
        { title: "Aquarelle", link: "/werke/aquarelle" },
        { title: "Digitale Werke", link: "/werke/digitale-werke" },
        { title: "Gemälde", link: "/werke/gemaelde" },
        { title: "Logo", link: "/werke/logo" },
      ],
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
    <nav className="sticky sm:px-10 top-0 z-40 flex w-full items-center justify-end bg-white bg-opacity-80 shadow-xl">
      <MobileNav menuItems={menuItems} pathname={pathname} />

      <ul className="hidden w-full items-center justify-between gap-4 py-4 lg:flex">
        {menuItems.map((item) => (
          <li key={item.title} className="relative">
            {item.subMenu ? (
              <div ref={dropdownRef}>
                <button
                  onClick={() => setIsWerkeOpen(!isWerkeOpen)}
                  className={`px-2 py-1 font-bold flex items-center gap-1 ${pathname.startsWith(item.link)
                      ? "bg-black text-white"
                      : "hover:underline"
                    }`}
                >
                  {item.title}
                  {isWerkeOpen ? (
                    <IoIosArrowUp className="text-lg" />
                  ) : (
                    <IoIosArrowDown className="text-lg" />
                  )}
                </button>
                {isWerkeOpen && (
                  <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    {item.subMenu.map((subItem) => (
                      <li key={subItem.title}>
                        <Link
                          href={subItem.link}
                          onClick={handleSubMenuClick}
                          className={`block px-4 py-2 hover:bg-gray-100 transition-colors duration-150 ${pathname === subItem.link
                              ? "bg-gray-100 font-bold"
                              : ""
                            }`}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href={item.link}
                className={`px-2 py-1 font-bold ${pathname.split("/")[1] === item.link.split("/")[1]
                    ? "bg-black text-white"
                    : "hover:underline"
                  }`}
              >
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
