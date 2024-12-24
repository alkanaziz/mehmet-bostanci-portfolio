"use client";

import { useState } from "react";
import Links from "./links/Links";
import ToggleButton from "./toggleButton/ToggleButton";
import { delay, motion } from "framer-motion";

const variants = {
  open: {
    clipPath: "circle(1200px at calc(100% - 50px) 50px)",
    transition: {
      type: "spring",
      stiffness: 20,
    },
  },
  closed: {
    clipPath: "circle(0px at calc(100% - 50px) 50px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      delay: 0.5,
    },
  },
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="sidebar bg-white sticky top-0 right-0  w-full lg:hidden"
      animate={open ? "open" : "closed"}
    >
      <div className="flex w-full items-center justify-end">
        <ToggleButton setOpen={setOpen} />
      </div>
      <motion.div
        className={`bg z-20 flex h-1/2 w-full flex-col items-center justify-center ${open ? "flex" : "duration-5000 hidden transition-all ease-in-out"}`}
        variants={variants}
      >
        <Links setOpen={setOpen} />
      </motion.div>
    </motion.div>
  );
};
export default Sidebar;
