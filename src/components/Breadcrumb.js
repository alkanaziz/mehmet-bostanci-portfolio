"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import menuItems from "../data/menuItems.json";

const Breadcrumb = function () {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  if (pathNames.length === 0) return null;

  const findMenuItem = (link, items) => {
    for (const item of items) {
      if (item.link.toLowerCase() === link.toLowerCase()) {
        return item.title;
      }
      if (item.subMenu) {
        const subItem = findMenuItem(link, item.subMenu);
        if (subItem) {
          return subItem;
        }
      }
    }
    return null;
  };

  return (
    <nav
      aria-label="breadcrumb"
      className="flex w-full items-center justify-center bg-white bg-opacity-80 px-2 shadow-sm md:px-8 lg:px-10"
    >
      <ul className="flex w-full py-3 sm:py-5">
        <li className="mx-2 font-bold hover:underline">
          <Link href="/">Home</Link>
        </li>
        {pathNames.length > 0 && <span> {">"} </span>}
        {pathNames.map((link, index) => {
          const href = "/" + pathNames.slice(0, index + 1).join("/");
          const itemClasses =
            paths === href
              ? `hover:underline mx-2 font-bold underline`
              : "hover:underline mx-2 font-bold";
          const itemLink = findMenuItem(href, menuItems);
          return (
            <React.Fragment key={href}>
              <li className={itemClasses}>
                <Link href={href}>{itemLink}</Link>
              </li>
              {pathNames.length !== index + 1 && <span> {">"} </span>}
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
