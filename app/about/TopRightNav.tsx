"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

type Props = {
  items: readonly NavItem[];
  className?: string;
};

export default function TopRightNav({ items, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

  const activeIndex = useMemo(
    () => Math.max(0, items.findIndex((item) => item.active)),
    [items]
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [markerY, setMarkerY] = useState(0);
  const [markerTurns, setMarkerTurns] = useState(0);

  const targetIndex = hoveredIndex ?? activeIndex;

  useEffect(() => {
    const container = containerRef.current;
    const targetEl = rowRefs.current[targetIndex];
    if (!container || !targetEl) return;

    const cRect = container.getBoundingClientRect();
    const tRect = targetEl.getBoundingClientRect();
    const nextY = tRect.top - cRect.top + tRect.height / 2 - 6;
    setMarkerY(nextY);
  }, [targetIndex, items]);

  useEffect(() => {
    const spinTimer = window.setTimeout(() => {
      setMarkerTurns((prev) => prev + 0.35);
    }, 0);
    return () => window.clearTimeout(spinTimer);
  }, [targetIndex]);

  useEffect(() => {
    const onResize = () => {
      const container = containerRef.current;
      const targetEl = rowRefs.current[targetIndex];
      if (!container || !targetEl) return;
      const cRect = container.getBoundingClientRect();
      const tRect = targetEl.getBoundingClientRect();
      setMarkerY(tRect.top - cRect.top + tRect.height / 2 - 6);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [targetIndex]);

  return (
    <nav
      aria-label="Primary"
      className={className}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div
        ref={containerRef}
        className="relative flex flex-col items-end gap-0.5 sm:gap-1 md:gap-1.5"
      >
        <span
          aria-hidden
          className="nav-marker pointer-events-none absolute right-0 h-3 w-3 bg-black will-change-transform"
          style={{
            transform: `translate3d(0, ${markerY}px, 0) rotate(${markerTurns * 360}deg)`,
            transition: "transform 780ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {items.map((item, idx) => {
          const isHoveredTarget = hoveredIndex === idx;
          const shouldSlide = isHoveredTarget && !item.active;
          return (
            <div
              key={item.label}
              ref={(el) => {
                rowRefs.current[idx] = el;
              }}
              className="flex items-center justify-end gap-2"
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <Link
                href={item.href}
                className={`inline-block transform-gpu text-right text-[0.62rem] font-medium uppercase leading-none tracking-[-0.035em] sm:text-xs md:text-sm ${
                  item.active
                    ? "font-semibold text-black"
                    : "text-[#979797] hover:text-black"
                } ${shouldSlide ? "-translate-x-1.5" : "translate-x-0"}`}
                style={{
                  willChange: "transform",
                  transition:
                    "transform 760ms cubic-bezier(0.16, 1, 0.3, 1), color 280ms ease-out",
                }}
              >
                <span
                  className="nav-mask-outer inline-block overflow-hidden"
                  style={{ verticalAlign: "top" }}
                >
                  <span className="nav-mask-inner inline-block">
                    {item.label}
                  </span>
                </span>
              </Link>
              <span aria-hidden className="h-3 w-3 shrink-0 opacity-0" />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
