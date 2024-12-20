"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Breadcrumb = function () {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  console.log({ paths, pathNames });

  if (pathNames.length === 0) return null;

  return (
    <nav
      aria-label="breadcrumb"
      className="flex w-full items-center justify-center bg-white bg-opacity-80 shadow-xl sm:px-10"
    >
      <ul className="flex w-full max-w-screen-lg py-3 sm:py-5">
        <li className="mx-2 font-bold hover:underline">
          <Link href="/">Home</Link>
        </li>
        {pathNames.length > 0 && <span key="seperator"> {">"} </span>}
        {pathNames.map((link, index) => {
          const href = "/" + pathNames.slice(0, index + 1).join("/");
          const itemClasses =
            paths === href
              ? `hover:underline mx-2 font-bold underline`
              : "hover:underline mx-2 font-bold";
          const itemLink = link.charAt(0).toUpperCase() + link.slice(1);
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
