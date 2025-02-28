"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import menuItems from "@/data/menuItems";
import MobileNav from "./MobileNav";
import Dropdown from "./Dropdown";

const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 flex w-full items-center justify-end bg-white bg-opacity-80 shadow-xl sm:px-10">
      <MobileNav menuItems={menuItems} pathname={pathname} />
      <ul className="hidden w-full items-center justify-between gap-4 py-4 lg:flex">
        {menuItems.map((item) => (
          <li key={item.title} className="relative">
            {item.subMenu ? (
              <Dropdown item={item} />
            ) : (
              <Link
                href={item.link}
                className={`px-2 py-3 font-bold ${
                  pathname.split("/")[1] === item.link.split("/")[1]
                    ? "bg-black text-white"
                    : "hover:bg-gray-300 transition-all duration-500"
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
