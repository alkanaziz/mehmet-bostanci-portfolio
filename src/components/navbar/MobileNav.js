"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ToggleButton from "./ToggleButton";
import Dropdown from "./Dropdown";
import Image from "next/image";

const MobileNav = ({ menuItems, pathname }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full lg:hidden" ref={wrapperRef}>
      <div className="relative z-50 flex w-full items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="mx-4 sm:mx-0"
          />
        </Link>
        <ToggleButton setOpen={setIsMobileMenuOpen} open={isMobileMenuOpen} />
      </div>

      {isMobileMenuOpen && (
        <div className="z-50 bg-white">
          <ul className="flex w-full flex-col px-4">
            {menuItems.map((item) => (
              <li key={item.title} className="w-full">
                {item.subMenu ? (
                  <Dropdown item={item} closeMenu={closeMenu} />
                ) : (
                  <Link
                    href={item.link}
                    onClick={closeMenu}
                    className={`block px-2 py-2 font-bold ${
                      pathname.split("/")[1] === item.link.split("/")[1]
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
