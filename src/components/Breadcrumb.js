"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/** titles: path -> page title (menu, categories), read at build time in the root layout. */
const Breadcrumb = function ({ titles }) {
  const paths = usePathname();
  const allNames = paths.split("/").filter((path) => path);
  // An artwork page (/werke/aquarelle/<slug>) shows the same breadcrumb as its
  // gallery: a last segment without a known title is left out.
  const lastHref = "/" + allNames.join("/");
  const pathNames = allNames.length > 1 && !titles[lastHref] ? allNames.slice(0, -1) : allNames;
  const currentHref = "/" + pathNames.join("/");

  if (pathNames.length === 0) return null;

  const titleFor = (href, segment) => titles[href] ?? decodeURIComponent(segment);

  return (
    <nav
      aria-label="breadcrumb"
      className="flex w-full items-center justify-center bg-white px-2 shadow-xs md:px-8 lg:px-10"
    >
      <ul className="flex w-full py-3 sm:py-5">
        <li className="mx-2 font-bold hover:underline">
          <Link href="/">Home</Link>
        </li>
        {pathNames.length > 0 && <span> {">"} </span>}
        {pathNames.map((link, index) => {
          const href = "/" + pathNames.slice(0, index + 1).join("/");
          const itemClasses =
            currentHref === href
              ? `hover:underline mx-2 font-bold underline`
              : "hover:underline mx-2 font-bold";
          const itemLink = titleFor(href, link);
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
