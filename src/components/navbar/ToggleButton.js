import { motion } from "framer-motion";

const ToggleButton = ({ setOpen, open }) => {
  return (
    <button
      className="z-20 flex size-7 items-center justify-center rounded-full text-black hover:scale-110 active:scale-95"
      onClick={() => setOpen((prev) => !prev)}
    >
      <svg
        className="flex size-7 items-center justify-center"
        fill="none"
        stroke="currentColor"
        viewBox="0 -1 22 22"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          initial={{ d: "M 2 2.5 L 20 2.5" }}
          animate={open ? "open" : "closed"}
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M 2 9.423 L 20 9.423"
          initial={{ opacity: 1 }}
          animate={open ? "open" : "closed"}
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
        />
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          initial={{ d: "M 2 16.346 L 20 16.346" }}
          animate={open ? "open" : "closed"}
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
    </button>
  );
};

export default ToggleButton;
