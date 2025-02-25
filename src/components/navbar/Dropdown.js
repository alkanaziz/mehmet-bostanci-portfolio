"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { usePathname } from "next/navigation";

export default function Dropdown(props) {
  const { item, closeMenu } = props; // closeMenu is optional
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

  const toggle = () => {
    setIsOpen((old) => !old);
  };

  return (
    <div ref={dropdownRef}>
      <div
        className={`flex items-center justify-center gap-1 px-2 py-1 font-bold ${
          pathname.startsWith(item.link) ? "bg-black text-white" : ""
        }`}
      >
        <Link
          href={item.link}
          onClick={closeMenu ? closeMenu : undefined}
          className={`flex-grow ${
            pathname.startsWith(item.link) ? "font-bold" : "hover:underline"
          }`}
        >
          {item.title}
        </Link>
        <button onClick={toggle} className="flex-shrink-0">
          {isOpen ? (
            <IoIosArrowUp className="text-lg" />
          ) : (
            <IoIosArrowDown className="text-lg" />
          )}
        </button>
      </div>
      {isOpen && (
        <ul className="w-full border-l-8 border-gray-300 bg-white p-1 shadow-lg lg:absolute lg:left-0 lg:m-0 lg:min-w-max">
          {item.subMenu.map((subItem) => (
            <li key={subItem.title}>
              <Link
                href={subItem.link}
                onClick={() => {
                  toggle();
                  if (closeMenu) closeMenu();
                }}
                className={`block px-2 py-2 transition-colors duration-150 hover:bg-gray-100 ${
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
