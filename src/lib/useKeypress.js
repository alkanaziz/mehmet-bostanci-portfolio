"use client";

import { useEffect } from "react";

export default function useKeypress(targetKey, handler) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === targetKey) {
        handler(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [targetKey, handler]);
}
