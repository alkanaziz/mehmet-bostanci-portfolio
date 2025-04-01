"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import menuItems from "@/data/menuItems";
import MobileNav from "./MobileNav";
import Dropdown from "./Dropdown";
import Image from "next/image";

const Nav = () => {
  const pathname = usePathname();
  const filteredMenuItems = menuItems.filter(
    (item) => item.title !== "Impressum",
  );

  return (
    <nav className="sticky top-0 z-40 flex w-full items-center justify-end bg-white bg-opacity-80 shadow-xl">
      <MobileNav menuItems={filteredMenuItems} pathname={pathname} />
      <ul className="hidden w-full items-center justify-between px-10 text-[1.2em] lg:flex">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={75}
            height={75}
            className="mx-2"
          />
        </Link>
        <div className="flex items-center justify-between gap-16">
          {filteredMenuItems.map((item) => (
            <li key={item.title} className="relative">
              {item.subMenu ? (
                <Dropdown item={item} />
              ) : (
                <Link
                  href={item.link}
                  className={`px-2 py-3 font-bold ${
                    pathname.split("/")[1] === item.link.split("/")[1]
                      ? "bg-black text-white"
                      : "transition-all duration-500 hover:bg-gray-300"
                  }`}
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </div>
      </ul>
    </nav>
  );
};

export default Nav;
