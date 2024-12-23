"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Breadcrumb = function () {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  console.log({ paths, pathNames });

  if (pathNames.length === 0) return null;

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
    {
      title: "Digitale Werke",
      link: "/werke/digitale-werke",
    },
    {
      title: "Aquarelle",
      link: "/werke/aquarelle",
    },
    {
      title: "Gemälde",
      link: "/werke/gemaelde",
    },
    {
      title: "Pastellarbeiten",
      link: "/werke/pastellarbeiten",
    },
  ];

  return (
    <nav
      aria-label="breadcrumb"
      className="flex w-full px-2 items-center justify-center bg-white bg-opacity-80 shadow-sm sm:px-10"
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
          const itemLink = menuItems.find((item) => item.link === href)?.title;
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
