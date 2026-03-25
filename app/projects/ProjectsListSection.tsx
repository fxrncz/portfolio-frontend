"use client";

import Image from "next/image";
import { useState } from "react";

const PROJECTS = [
  { num: "01", name: "CourseFinder", src: "/assets/cf1.webp" },
  { num: "02", name: "PressItNow Co.", src: "/assets/p1.webp" },
  { num: "03", name: "VapeCentral", src: "/assets/vp1.webp" },
  { num: "04", name: "FFC Dental Clinic", src: "/assets/ffc1.webp" },
] as const;

export default function ProjectsListSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const activeIndex = hovered ?? 0;
  const active = PROJECTS[activeIndex];

  return (
    <section
      className="relative min-h-[calc(100vh-12rem)] px-3 pb-40 pt-8 sm:min-h-[calc(100vh-10rem)] sm:px-6 sm:pb-36 sm:pt-10 md:px-8 md:pt-12 lg:px-10 lg:pb-32 lg:pt-14"
      onMouseLeave={() => setHovered(null)}
    >
      <ul className="flex max-w-xl flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5">
        {PROJECTS.map((p, i) => {
          const isDimmed = hovered !== null && hovered !== i;
          return (
            <li key={p.num}>
              <button
                type="button"
                className={`w-full text-left transition-colors duration-200 ease-out ${
                  isDimmed ? "text-black/35" : "text-black"
                }`}
                onMouseEnter={() => setHovered(i)}
              >
                <span className="font-regular leading-none tracking-[-0.15em]">
                  <span className="tabular-nums text-[clamp(1.125rem,3.5vw,1.75rem)] sm:text-2xl md:text-[1.75rem]">
                    {p.num}
                  </span>
                <span className="pl-2 text-[clamp(1.2rem,3.4vw,2.05rem)] sm:pl-3 sm:text-[2.35rem] md:text-[2.05rem] lg:text-[2.6rem]">
                    {p.name}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        className="pointer-events-none fixed bottom-4 right-3 z-20 w-[clamp(320px,82vw,520px)] sm:bottom-6 sm:right-4 md:right-8 lg:bottom-10 lg:right-10 lg:w-[clamp(370px,90vw,680px)]"
        aria-hidden
      >
        <div className="border-8 border-black bg-black p-2 sm:border-10 sm:p-3 md:border-12 md:p-4 lg:border-14 lg:p-5">
          <div className="relative aspect-21/13 sm:aspect-21/12 md:aspect-21/12 lg:aspect-21/11 w-full">
            <Image
              key={active.src}
              src={active.src}
              alt={`${active.name} preview`}
              fill
              className="scale-[0.85] object-contain object-center sm:scale-[0.9] md:scale-[0.95] lg:scale-[1.0]"
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 58vw, 680px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
