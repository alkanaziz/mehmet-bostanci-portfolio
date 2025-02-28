"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { usePathname } from "next/navigation";

export default function Dropdown({ item, closeMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <div
        className={`flex cursor-pointer items-center gap-1 px-2 py-2 font-bold transition-colors duration-200 ${
          pathname.startsWith(item.link)
            ? "bg-black text-white"
            : `hover:bg-gray-300 transition-all duration-500 ${isOpen ? "bg-gray-300" : ""}`
        }`}
      >
        <Link href={item.link} onClick={closeMenu} className="flex-grow">
          {item.title}
        </Link>
        {item.subMenu && (
          <button
            onClick={toggle}
            aria-label="Toggle submenu"
            className="flex-shrink-0"
          >
            {isOpen ? (
              <IoIosArrowUp className="text-lg" />
            ) : (
              <IoIosArrowDown className="text-lg" />
            )}
          </button>
        )}
      </div>
      {isOpen && item.subMenu && (
        <ul className="absolute left-0 z-10 w-full min-w-max border border-l-8 border-gray-300 bg-gray-50 shadow-lg">
          {item.subMenu.map((subItem) => (
            <li key={subItem.title}>
              <Link
                href={subItem.link}
                onClick={() => {
                  toggle();
                  if (closeMenu) closeMenu();
                }}
                className={`block px-4 py-2 transition-colors duration-200 hover:bg-gray-200 ${
                  pathname === subItem.link ? "bg-gray-100 font-bold" : ""
                }`}
              >
                {subItem.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
