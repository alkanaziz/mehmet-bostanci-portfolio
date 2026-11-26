// Hamburger / close icon of the mobile menu. Animated with CSS (the path "d"
// transition; browsers without it simply switch the icon), so no animation
// library has to be loaded on every page.
const LINES = {
  top: { closed: "M 2 2.5 L 20 2.5", open: "M 3 16.5 L 17 2.5" },
  bottom: { closed: "M 2 16.346 L 20 16.346", open: "M 3 2.5 L 17 16.346" },
};

const lineProps = { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3 };
const transition = "d 0.3s ease, opacity 0.2s ease";

const ToggleButton = ({ setOpen, open }) => {
  const state = open ? "open" : "closed";
  return (
    <button
      type="button"
      aria-label={open ? "Menü schließen" : "Menü öffnen"}
      aria-expanded={open}
      className="z-20 flex size-7 items-center justify-center rounded-full text-black hover:scale-110 active:scale-95"
      onClick={() => setOpen((prev) => !prev)}
    >
      <svg
        className="flex size-7 items-center justify-center"
        fill="none"
        stroke="currentColor"
        viewBox="0 -1 22 22"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path {...lineProps} d={LINES.top[state]} style={{ d: `path("${LINES.top[state]}")`, transition }} />
        <path {...lineProps} d="M 2 9.423 L 20 9.423" style={{ opacity: open ? 0 : 1, transition }} />
        <path {...lineProps} d={LINES.bottom[state]} style={{ d: `path("${LINES.bottom[state]}")`, transition }} />
      </svg>
    </button>
  );
};

export default ToggleButton;
