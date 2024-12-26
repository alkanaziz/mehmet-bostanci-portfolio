"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ToggleButton from "./sidebar/toggleButton/ToggleButton";

const MobileNav = ({ menuItems, pathname }) => {
  const [isWerkeOpen, setIsWerkeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuRef = useRef(null); // Menü referansı
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setIsWerkeOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="lg:hidden w-full" ref={wrapperRef}>
      <div className="z-50 relative w-full flex justify-end">
        <ToggleButton
          setOpen={setIsMobileMenuOpen}
          open={isMobileMenuOpen}
          onClick={(event) => event.stopPropagation()}
        />
      </div>

      {isMobileMenuOpen && (
        <div className="bg-white z-50" ref={menuRef}>
          <ul className="flex flex-col w-full px-4">
            {menuItems.map((item) => (
              <li key={item.title} className="w-full">
                {item.subMenu ? (
                  <div>
                    <button
                      onClick={() => setIsWerkeOpen(!isWerkeOpen)}
                      className={`w-full text-left px-4 py-2 font-bold flex items-center justify-between ${
                        pathname.startsWith(item.link)
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
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
                      <ul className="ml-4 mt-2 border-l-2 border-gray-200">
                        {item.subMenu.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              href={subItem.link}
                              onClick={() => {
                                setIsWerkeOpen(false);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`block px-4 py-2 hover:bg-gray-100 ${
                                pathname === subItem.link
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2 font-bold ${
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
