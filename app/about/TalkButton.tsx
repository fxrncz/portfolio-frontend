"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

const spring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

const ARROW_CLASSES =
  "flex h-8 w-8 shrink-0 items-center justify-center bg-black text-sm text-white sm:h-9 sm:w-9 sm:text-base xl:h-12 xl:w-12 xl:text-2xl";
const HOVER_DELAY_MS = 140;

export default function TalkButton() {
  const [hovered, setHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);

  const handleEnter = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setHovered(true);
      hoverTimerRef.current = null;
    }, HOVER_DELAY_MS);
  };

  const handleLeave = () => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHovered(false);
  };

  return (
    <motion.div
      layout
      transition={spring}
      className="flex items-center gap-2"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <AnimatePresence mode="popLayout">
        {hovered && (
          <motion.div
            key="arrow-left"
            layout
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={spring}
          >
            <Link href="#" aria-label="Next" className={ARROW_CLASSES}>
              &gt;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout="position" transition={spring}>
        <Link
          href="#"
          className="inline-flex h-8 items-center justify-center bg-black px-3 text-xs font-medium uppercase tracking-tight text-white sm:h-9 sm:px-4 sm:text-sm xl:h-12 xl:px-5 xl:text-base"
        >
          TALK WITH ME
        </Link>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {!hovered && (
          <motion.div
            key="arrow-right"
            layout
            initial={
              hasInteracted ? { opacity: 0, scale: 0 } : false
            }
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 360 }}
            transition={spring}
          >
            <Link href="#" aria-label="Next" className={ARROW_CLASSES}>
              &gt;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
