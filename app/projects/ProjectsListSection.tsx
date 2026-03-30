"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function MaskSplitText({
  text,
  state,
  delayMs = 0,
  className,
}: {
  text: string;
  state: "shown" | "hidden" | "exit";
  delayMs?: number;
  className?: string;
}) {
  const transform =
    state === "hidden"
      ? "translate3d(0, 120%, 0) skewX(10deg)"
      : state === "exit"
        ? "translate3d(0, 130%, 0) skewX(9deg)"
        : "translate3d(0, 0%, 0) skewX(0deg)";

  return (
    <span
      className={`inline-block overflow-hidden ${className ?? ""}`}
      style={{
        verticalAlign: "bottom",
        paddingTop: "0.14em",
        paddingBottom: "0.14em",
      }}
    >
      <span
        className="inline-block"
        style={{
          transform,
          transformOrigin: "top center",
          transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: `${delayMs}ms`,
          willChange: "transform",
          lineHeight: 1,
          backfaceVisibility: "hidden",
        }}
      >
        {text}
      </span>
    </span>
  );
}

function Frame({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="border-8 border-black bg-black p-2 sm:border-10 sm:p-3 md:border-12 md:p-4 lg:border-14 lg:p-5">
        <div className="relative aspect-21/13 sm:aspect-21/12 md:aspect-21/12 lg:aspect-21/11 w-full">
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            className="scale-[0.85] object-contain object-center sm:scale-[0.9] md:scale-[0.95] lg:scale-[1.0]"
            sizes={sizes}
          />
        </div>
      </div>
    </div>
  );
}

const PROJECTS = [
  {
    num: "01",
    name: "CourseFinder",
    src: "/assets/cf1.webp",
    description:
      "CourseFinder is a web-based career guidance system that helps undecided students identify suitable academic and career paths based on their personality, interests, and strengths. Using structured assessments like RIASEC and Jungian-based evaluations, it provides personalized recommendations, including suggested courses, career options, and key strengths, helping students make informed decisions about their future.",
    stack: ["Spring Boot", "Next.js", "PostgreSQL"],
    links: [
      { label: "Visit Website", href: "#" },
      { label: "Repository Here", href: "#" },
    ],
    dateLabel: "June 2025",
    openFrames: {
      top: "/assets/cf2.webp",
      left: "/assets/cf4.webp",
    },
  },
  { num: "02", name: "PressItNow Co.", src: "/assets/p1.webp" },
  { num: "03", name: "VapeCentral", src: "/assets/vp1.webp" },
  { num: "04", name: "FFC Dental Clinic", src: "/assets/ffc1.webp" },
] as const;

export default function ProjectsListSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "navOut" | "contentIn">("idle");
  /** After paint: start slide so CSS transition runs from 0 → -100% (avoids skipped animation). */
  const [navSlideActive, setNavSlideActive] = useState(false);
  const navOutTimeoutRef = useRef<number | null>(null);
  const navSlideRafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navOutTimeoutRef.current !== null) {
        window.clearTimeout(navOutTimeoutRef.current);
        navOutTimeoutRef.current = null;
      }
      if (navSlideRafRef.current !== null) {
        window.cancelAnimationFrame(navSlideRafRef.current);
        navSlideRafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (openIndex !== 0 || phase !== "navOut") return undefined;

    const raf1 = window.requestAnimationFrame(() => {
      navSlideRafRef.current = window.requestAnimationFrame(() => {
        setNavSlideActive(true);
        navSlideRafRef.current = null;
      });
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      if (navSlideRafRef.current !== null) {
        window.cancelAnimationFrame(navSlideRafRef.current);
        navSlideRafRef.current = null;
      }
    };
  }, [openIndex, phase]);

  /** Slide duration ~0.85s + stagger for last row (04). */
  const NAV_OUT_MS = 1150;

  const activeIndex = openIndex ?? hovered ?? 0;
  const active = PROJECTS[activeIndex];
  const isOpen = openIndex !== null;
  const openedProject =
    openIndex !== null ? (PROJECTS[openIndex] as (typeof PROJECTS)[number]) : null;

  const showContent = openIndex === 0 && phase === "contentIn";

  return (
    <section
      className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-3 pb-40 pt-8 sm:px-6 sm:pb-36 sm:pt-10 md:px-8 md:pt-12 lg:px-10 lg:pb-32 lg:pt-14"
      onMouseLeave={() => setHovered(null)}
    >
      <ul className="flex w-full min-w-0 max-w-full flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 overflow-x-hidden">
        {PROJECTS.map((p, i) => {
          const isDimmed =
            (openIndex !== null && openIndex !== i) || (openIndex === null && hovered !== null && hovered !== i);
          const isRowOpen = openIndex === i;
          /** Open layout (paragraph, stack in row, links) only after nav-out; keeps closed-state width during slide. */
          const courseFinderOpenLayout = openIndex === 0 && phase === "contentIn";
          const isRowOpenForContent = isRowOpen && (i !== 0 || courseFinderOpenLayout);
          const slideOtherNavsOut = openIndex === 0 && i !== 0 && phase === "navOut";

          // Hard-remove non-CourseFinder items after the slide completes.
          if (openIndex === 0 && i !== 0 && phase === "contentIn") return null;

          const navRow = (
            <>
              <span className="w-12 shrink-0 tabular-nums text-[clamp(1.125rem,3.5vw,1.75rem)] sm:text-2xl md:text-[1.75rem]">
                {p.num}
              </span>
              <span className="shrink-0 text-[clamp(1.2rem,3.4vw,2.05rem)] sm:text-[2.35rem] md:text-[2.05rem] lg:text-[2.6rem]">
                {p.name}
              </span>
              {"stack" in p && isRowOpenForContent ? (
                <span className="flex min-w-0 flex-wrap gap-x-3 gap-y-2 pl-4 text-[1.20rem] font-regular leading-[1.45] tracking-[-0.05em] sm:flex-nowrap sm:text-[1.25rem]">
                  {p.stack.map((t) => (
                    <span key={t} className="whitespace-nowrap text-black/75">
                      <MaskSplitText
                        text={`[${t}]`}
                        state={showContent ? "shown" : "hidden"}
                        delayMs={140}
                      />
                    </span>
                  ))}
                </span>
              ) : null}
            </>
          );

          return (
            <li
              key={p.num}
              className={`${openIndex === 0 && i !== 0 ? "pointer-events-none" : ""} ${
                slideOtherNavsOut ? "overflow-x-hidden" : ""
              } w-full max-w-xl`}
            >
              <button
                type="button"
                className={`w-full max-w-xl text-left transition-colors duration-200 ease-out ${
                  isDimmed ? "text-black/35" : "text-black"
                }`}
                onMouseEnter={() => (openIndex === null ? setHovered(i) : undefined)}
                onClick={() => {
                  if (i === 0) {
                    // Toggle CourseFinder open/close with a timed sequence.
                    const isCurrentlyOpen = openIndex === 0;

                    if (navOutTimeoutRef.current !== null) {
                      window.clearTimeout(navOutTimeoutRef.current);
                      navOutTimeoutRef.current = null;
                    }

                    if (isCurrentlyOpen) {
                      setNavSlideActive(false);
                      setPhase("idle");
                      setOpenIndex(null);
                      return;
                    }

                    setNavSlideActive(false);
                    setOpenIndex(0);
                    setPhase("navOut");
                    navOutTimeoutRef.current = window.setTimeout(() => {
                      setNavSlideActive(false);
                      setPhase("contentIn");
                      navOutTimeoutRef.current = null;
                    }, NAV_OUT_MS);
                    return;
                  } else {
                    setOpenIndex((prev) => (prev === i ? null : i));
                    setPhase("idle");
                  }
                }}
              >
                {/* Same wrapper for every row so entering navOut does not swap span→div and reflow mid-slide. */}
                <div
                  className={`w-full min-w-0 ${slideOtherNavsOut ? "overflow-x-hidden" : ""}`}
                >
                  <div
                    className="font-regular inline-flex w-full min-w-0 flex-wrap items-center gap-x-4 gap-y-2 leading-none tracking-[-0.15em] sm:flex-nowrap"
                    style={{
                      transform: slideOtherNavsOut
                        ? navSlideActive
                          ? "translate3d(-100%, 0, 0)"
                          : "translate3d(0, 0, 0)"
                        : "translate3d(0, 0, 0)",
                      transition: slideOtherNavsOut
                        ? "transform 0.88s cubic-bezier(0.22, 1, 0.36, 1)"
                        : undefined,
                      transitionDelay: slideOtherNavsOut ? `${(i - 1) * 55}ms` : undefined,
                      willChange: slideOtherNavsOut ? "transform" : undefined,
                    }}
                  >
                    {navRow}
                  </div>
                </div>
              </button>

              <div className={isRowOpenForContent && "description" in p ? "block" : "hidden"}>
                {"description" in p ? (
                  <div
                    className={`mt-10 w-full max-w-208 pl-16 transition-opacity duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      showContent ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="text-justify text-[1.20rem] font-regular leading-[1.45] tracking-[-0.05em] text-black/85 sm:text-[1.25rem]">
                      {p.description}
                    </p>

                    <div className="font-regular mt-10 flex items-baseline justify-between gap-6 text-[1.18rem] leading-[1.45] tracking-[-0.05em] text-black/80 sm:text-[1.23rem]">
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {p.links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            className="pointer-events-auto underline-offset-4 hover:underline"
                          >
                            <MaskSplitText
                              text={`[ ${l.label} ]`}
                              state={showContent ? "shown" : "hidden"}
                              delayMs={220}
                            />
                          </a>
                        ))}
                      </div>
                      <span className="shrink-0 text-right text-black/70">
                        <MaskSplitText
                          text={`[ ${p.dateLabel} ]`}
                          state={showContent ? "shown" : "hidden"}
                          delayMs={260}
                        />
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <div
        className="pointer-events-none fixed bottom-4 right-3 z-20 w-[clamp(320px,82vw,520px)] sm:bottom-6 sm:right-4 md:right-8 lg:bottom-10 lg:right-10 lg:w-[clamp(370px,90vw,680px)]"
        aria-hidden
      >
        {!isOpen ? (
          <Frame
            src={active.src}
            alt={`${active.name} preview`}
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 58vw, 680px"
          />
        ) : (
          <div className="relative">
            {/* Main (bottom-right) frame defines the base size */}
            <Frame
              src={active.src}
              alt={`${active.name} preview`}
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 58vw, 680px"
            />

            <Frame
              className={`absolute right-0 w-full transition-[clip-path,opacity] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                showContent
                  ? "opacity-100 [clip-path:inset(0_0_0_0)]"
                  : "opacity-0 [clip-path:inset(100%_0_0_100%)]"
              } bottom-[calc(100%+12px)] sm:bottom-[calc(100%+16px)] md:bottom-[calc(100%+20px)]`}
              src={openedProject && "openFrames" in openedProject ? openedProject.openFrames.top : active.src}
              alt={`${active.name} preview top`}
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 58vw, 680px"
            />

            <Frame
              className={`absolute bottom-0 w-full transition-[clip-path,opacity] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                showContent
                  ? "opacity-100 [clip-path:inset(0_0_0_0)]"
                  : "opacity-0 [clip-path:inset(100%_0_0_100%)]"
              } right-[calc(100%+12px)] sm:right-[calc(100%+16px)] md:right-[calc(100%+20px)]`}
              src={openedProject && "openFrames" in openedProject ? openedProject.openFrames.left : active.src}
              alt={`${active.name} preview left`}
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 58vw, 680px"
            />
          </div>
        )}
      </div>
    </section>
  );
}
