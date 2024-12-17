"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
  open: {
    transition: { staggerChildren: 0.1 },
  },
  closed: {
    transition: { staggerChildren: 0.1, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: 50,
    opacity: 0,
  },
};

const Links = ({ setOpen }) => {
  const pathname = usePathname();
  const links = [
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
  ];

  return (
    <motion.div
      className="links flex size-full flex-col items-center justify-center"
      variants={variants}
    >
      {links.map((link) => (
        <motion.a
          className={`rounded-md px-2 py-1 font-extrabold ${
            pathname.split("/")[1] === link.link.split("/")[1]
              ? "bg-black text-white"
              : "hover:underline"
          }`}
          href={`${link.link}`}
          key={link.title}
          variants={itemVariants}
          onClick={() => setOpen(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {link.title}
        </motion.a>
      ))}
    </motion.div>
  );
};
export default Links;
