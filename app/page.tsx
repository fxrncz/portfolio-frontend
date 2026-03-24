"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import PixelShaderOverlay from "./components/PixelShaderOverlay";

function formatTime(date: Date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

const SPLIT_TEXT = "FRANCIS OLIVER";
const HERO_TITLE = "Full-Stack";
const HERO_PARA =
  "Information Technology student driven by a deep curiosity for technology and its potential to solve real-world challenges. Throughout my academic journey, I\u2019ve built a strong foundation in programming and system development, while actively exploring emerging technologies to continuously expand my skills.";
const HERO_PARA_WORDS = HERO_PARA.split(" ");

const NAV_HEIGHT_REM = 3;
const NAV_MARGIN_REM = 9;
const SHRUNK_RECT_WIDTH_REM = 16;

export default function Home() {
  const router = useRouter();
  const [now, setNow] = useState<Date | null>(null);
  const [showLanding, setShowLanding] = useState(false);
  const [shaderEnabled, setShaderEnabled] = useState(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);

  // ── Overlay
  const overlayRef       = useRef<HTMLDivElement>(null);
  const blackRef         = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const francisBlockRef  = useRef<HTMLDivElement>(null);
  const routeCurtainRef  = useRef<HTMLDivElement>(null);
  const routeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // ── Landing
  const heroRef          = useRef<HTMLElement>(null);
  const heroTitleRef     = useRef<HTMLHeadingElement>(null);
  const heroParagraphRef = useRef<HTMLParagraphElement>(null);
  const developerH2Ref   = useRef<HTMLHeadingElement>(null);
  const navRef           = useRef<HTMLElement>(null);
  const bottomLeftRef    = useRef<HTMLDivElement>(null);
  const bottomRightRef   = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    // Avoid SSR/CSR hydration mismatches by only rendering the clock after mount.
    const initialId = window.setTimeout(() => setNow(new Date()), 0);
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const black         = blackRef.current;
    const textContainer = textContainerRef.current;
    const overlay       = overlayRef.current;
    const francisBlock  = francisBlockRef.current;
    if (!black || !textContainer || !overlay || !francisBlock) return;

    const rem     = 16;
    const vw      = window.innerWidth;
    const vh      = window.innerHeight;
    const navH    = NAV_HEIGHT_REM * rem;
    const shrunkW = Math.min(SHRUNK_RECT_WIDTH_REM * rem, vw - NAV_MARGIN_REM * rem);
    const topPx   = (vh - navH) / 2;
    const leftPx  = (vw - shrunkW) / 2;
    const shrunkClip = `inset(${topPx}px ${leftPx}px ${topPx}px ${leftPx}px)`;

    // ── Overlay initial states
    gsap.set(black,         { clipPath: "inset(0px 0px 0px 0px)" });
    gsap.set(textContainer, { opacity: 0, clipPath: shrunkClip });
    gsap.set(francisBlock,  { left: vw / 2, xPercent: -50 });

    // ── Landing initial states (hidden under z-100 overlay until Phase 3)
    const hero        = heroRef.current;
    const nav         = navRef.current;
    const titleChars  = heroTitleRef.current
      ?.querySelectorAll<HTMLElement>(".hero-title-char");
    const paraWords   = heroParagraphRef.current
      ?.querySelectorAll<HTMLElement>(".hero-para-word");
    const devChars    = developerH2Ref.current
      ?.querySelectorAll<HTMLElement>(".dev-char-inner");

    if (hero)  gsap.set(hero, { clipPath: "inset(0% 0% 100% 0%)" });
    if (nav)   gsap.set(nav,  { y: 90, opacity: 0, rotation: -1.5, skewX: 3, transformOrigin: "center bottom" });
    if (bottomLeftRef.current)  gsap.set(bottomLeftRef.current,  { opacity: 0 });
    if (bottomRightRef.current) gsap.set(bottomRightRef.current, { opacity: 0 });
    if (titleChars?.length)  gsap.set([...titleChars],  { yPercent: 120 });
    if (paraWords?.length)   gsap.set([...paraWords],   { yPercent: 120 });
    // Developer — chars drop from above
    if (devChars?.length)    gsap.set([...devChars],    { yPercent: -120 });

    const tl = gsap.timeline();

    // ── Phase 1: full-screen black shrinks to narrow centred strip
    tl.to(black, { clipPath: shrunkClip, duration: 1.2, ease: "expo.inOut" });

    // ── Phase 2: FRANCIS OLIVER mask-split
    tl.to(textContainer, { opacity: 1, duration: 0.15 }, "-=0.1");
    const francisInners = textContainer.querySelectorAll<HTMLElement>(
      ".startup-francis .startup-char-inner"
    );
    tl.fromTo(
      francisInners,
      { yPercent: 110, skewX: 12 },
      { yPercent: 0, skewX: 0, duration: 0.6, stagger: 0.045, ease: "expo.out" },
      "-=0.05"
    );

    // ── Phase 3: rectangle slides down past the screen (0.35s pause first)
    tl.to(overlay, { y: vh + navH * 2, duration: 0.9, ease: "power3.inOut" }, "+=0.35");
    tl.call(
      () => {
        setShowLanding(true);
        // Keep shader disabled until hero text is actually revealed.
        setShaderEnabled(false);
      },
      undefined, "<"
    );

    // ── Phase 4: hero black section sweeps down from top — fluid deceleration
    if (hero) {
      tl.to(hero, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.3,
        ease: "expo.out",
      }, "-=0.2");
    }

    // ── Phase 4b + 4d + nav: "FULL-STACK", "Developer —", and nav all start together
    tl.addLabel("heroText", "-=0.55");

    if (titleChars?.length) {
      tl.fromTo([...titleChars],
        { yPercent: 115, skewX: -12, rotation: -2 },
        {
          yPercent: 0, skewX: 0, rotation: 0,
          duration: 0.75,
          stagger: { each: 0.055, ease: "power2.in" },
          ease: "expo.out",
        },
        "heroText"
      );
    }

    if (devChars?.length) {
      tl.fromTo([...devChars],
        { yPercent: -120, skewX: -8 },
        { yPercent: 0, skewX: 0, duration: 0.8, stagger: 0.1, ease: "expo.out" },
        "heroText"
      );
    }

    if (nav) {
      tl.to(nav, {
        y: 0, opacity: 1, rotation: 0, skewX: 0,
        duration: 1.1,
        ease: "expo.out",
      }, "heroText");
    }

    // ── Phase 4c: paragraph words mask-split — tight cascade
    if (paraWords?.length) {
      tl.fromTo([...paraWords],
        { yPercent: 120, skewX: 6 },
        { yPercent: 0, skewX: 0, duration: 0.5, stagger: 0.012, ease: "expo.out" },
        "-=0.25"
      );
    }

    // ── Phase 4e: bottom labels fade in
    if (bottomLeftRef.current && bottomRightRef.current) {
      tl.to(
        [bottomLeftRef.current, bottomRightRef.current],
        { opacity: 1, duration: 0.4, ease: "power1.out" },
        "-=0.3"
      );
    }

    // Only enable hover shader once the landing content is visible.
    tl.call(() => {
      overlay.style.pointerEvents = "none";
      overlay.style.display = "none";
      setShaderEnabled(true);
    });
  }, []);

  const timestamp = useMemo(() => (now ? formatTime(now) : ""), [now]);

  useEffect(() => {
    return () => {
      routeTimelineRef.current?.kill();
    };
  }, []);

  const handleFrancisClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isTransitioningOut) return;

    const nav = navRef.current;
    const hero = heroRef.current;
    const curtain = routeCurtainRef.current;
    if (!nav || !curtain || !hero) {
      router.push("/about");
      return;
    }

    setIsTransitioningOut(true);
    setShaderEnabled(false);
    try {
      window.sessionStorage.setItem("about-intro-source", "landing");
    } catch {
      // Ignore storage errors and continue navigation animation.
    }

    const titleChars = heroTitleRef.current?.querySelectorAll<HTMLElement>(".hero-title-char");
    const paraWords = heroParagraphRef.current?.querySelectorAll<HTMLElement>(".hero-para-word");
    const devChars = developerH2Ref.current?.querySelectorAll<HTMLElement>(".dev-char-inner");
    const movingItems = [bottomLeftRef.current, bottomRightRef.current].filter(
      Boolean
    ) as HTMLElement[];

    routeTimelineRef.current?.kill();
    const tl = gsap.timeline({
      onComplete: () => {
        router.push("/about");
      },
    });
    routeTimelineRef.current = tl;

    gsap.set(curtain, { clipPath: "inset(100% 0% 0% 0%)" });

    tl.to(
      nav,
      {
        y: 180,
        opacity: 0,
        duration: 0.8,
        ease: "expo.inOut",
      },
      0
    );

    if (movingItems.length) {
      tl.to(
        movingItems,
        {
          y: 70,
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        0
      );
    }

    if (titleChars?.length) {
      tl.to(
        [...titleChars],
        {
          yPercent: 130,
          skewX: 9,
          duration: 0.55,
          stagger: 0.03,
          ease: "power3.in",
        },
        0.02
      );
    }

    if (devChars?.length) {
      tl.to(
        [...devChars],
        {
          yPercent: 130,
          skewX: 8,
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.in",
        },
        0.04
      );
    }

    if (paraWords?.length) {
      tl.to(
        [...paraWords],
        {
          yPercent: 130,
          skewX: 6,
          duration: 0.42,
          stagger: 0.01,
          ease: "power2.in",
        },
        0.08
      );
    }

    // Near-half black section retracts upward before bottom curtain rise.
    tl.to(
      hero,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.58,
        ease: "expo.inOut",
      },
      0.14
    );

    // Fluid two-step curtain: middle slowdown then continuous rise (no hard stop), then ungrow upward.
    tl.to(
      curtain,
      {
        keyframes: [
          {
            clipPath: "inset(46% 0% 0% 0%)",
            duration: 0.86,
            ease: "power2.out",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.78,
            ease: "power2.inOut",
          },
        ],
      },
      0.72
    ).to(
      curtain,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.72,
        ease: "power3.inOut",
      },
      "+=0.06"
    );
  };

  return (
    <div className="relative min-h-screen bg-white text-black max-sm:h-screen max-sm:min-h-0 max-sm:overflow-hidden">

      {/* ── Startup overlay ─────────────────────────────────────────── */}
      <div ref={overlayRef} className="fixed inset-0 z-100" aria-hidden={showLanding}>
        <div ref={blackRef} className="absolute inset-0 bg-black" />
        <div ref={textContainerRef} className="absolute inset-0 flex items-center opacity-0">
          <div
            ref={francisBlockRef}
            className="startup-francis absolute flex overflow-hidden text-xs font-medium
                       uppercase tracking-tight text-white sm:text-sm
                       lg:text-lg lg:tracking-tighter"
          >
            {SPLIT_TEXT.split("").map((char, i) => (
              <span key={i} className="startup-char-wrap inline-block overflow-hidden leading-tight">
                <span className="startup-char-inner inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={routeCurtainRef}
        className="pointer-events-none fixed inset-0 z-120 bg-black will-change-[clip-path]"
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        aria-hidden
      />

      {/* ── Landing ─────────────────────────────────────────────────── */}
      <div className={showLanding ? (isTransitioningOut ? "pointer-events-none" : "") : "pointer-events-none"}>

        {/* Hero: near-half black section sweeps down from top */}
        <section
          ref={heroRef as React.RefObject<HTMLElement>}
          aria-label="Hero"
          className="absolute inset-x-0 top-0 h-[45vh] bg-black"
        >
          {/* Paragraph – word-level mask-split */}
          <p
            ref={heroParagraphRef}
            className="absolute right-4 top-1/2 max-w-xs -translate-y-1/2 text-right
                       text-xs font-regular leading-snug tracking-tight text-white/90
                       sm:right-6 sm:max-w-sm sm:text-sm
                       md:max-w-md md:text-base
                       lg:right-8 lg:max-w-lg lg:text-base
                       xl:right-10 xl:max-w-xl xl:text-xl xl:tracking-[-0.08em] xl:leading-tight"
          >
            {HERO_PARA_WORDS.map((word, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden"
                style={{ verticalAlign: "bottom" }}
              >
                <span className="hero-para-word inline-block leading-snug">{word}</span>
                {i < HERO_PARA_WORDS.length - 1 && "\u00A0"}
              </span>
            ))}
          </p>

          {/* FULL-STACK – single-block mask reveal (no per-char clipping) */}
          <h1
            ref={heroTitleRef}
            className="absolute bottom-[-0.08em] left-4 text-4xl font-semibold uppercase
                       tracking-[-0.06em] text-white select-none cursor-default
                       sm:left-6 sm:text-6xl
                       md:left-8 md:text-7xl
                       lg:left-8 lg:text-8xl
                       xl:left-10 xl:text-9xl xl:tracking-[-0.07em]"
            style={{ lineHeight: 1 }}
          >
            {HERO_TITLE.split("").map((char, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                  paddingLeft: "0.09em",
                  paddingRight: "0.09em",
                  marginLeft: "-0.09em",
                  marginRight: "-0.09em",
                }}
              >
                <span className="hero-title-char" style={{ display: "inline-block" }}>
                  {char}
                </span>
              </span>
            ))}
          </h1>
        </section>

        {/* Developer — · word-level mask-split drops from above */}
        <h2
          ref={developerH2Ref}
          className="absolute left-3 top-[45vh] -translate-y-2
                     text-[3.5rem] font-semibold uppercase select-none cursor-default
                     tracking-[-0.06em] text-black
                     sm:left-4 sm:text-[5.5rem]
                     md:left-6 md:text-[9rem]
                     lg:left-6 lg:text-[11em]
                     xl:left-7.5 xl:text-[16em] xl:tracking-[-0.07em]"
          style={{ lineHeight: 1 }}
        >
          {["Developer\u00A0", "\u2014"].map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden"
              style={{ verticalAlign: "bottom" }}
            >
              <span className="dev-char-inner inline-block">{word}</span>
            </span>
          ))}
        </h2>

        {/* Pixel-shader hover overlays */}
        {showLanding && shaderEnabled && (
          <>
            <PixelShaderOverlay
              targetRef={heroTitleRef as RefObject<HTMLElement>}
              displayText={HERO_TITLE}
            />
            <PixelShaderOverlay
              targetRef={developerH2Ref as RefObject<HTMLElement>}
              displayText={"Developer\u00A0\u2014"}
            />
          </>
        )}

        {/* Nav – warp in from below */}
        <nav
          ref={navRef as React.RefObject<HTMLElement>}
          aria-label="Primary"
          className="fixed bottom-16 left-1/2 z-50 flex h-12 w-full max-w-[calc(100vw-6rem)] -translate-x-1/2 items-center
                     bg-black px-4
                     sm:bottom-8 sm:w-md sm:max-w-[calc(100vw-9rem)] sm:px-8
                     lg:bottom-10 lg:px-10"
        >
          <ul className="flex w-full items-center justify-center gap-4 sm:gap-8 lg:gap-10">
            <li>
              <a
                href="/about"
                onClick={handleFrancisClick}
                className="text-xs font-medium uppercase tracking-tight text-white
                           hover:text-white/80 sm:text-sm lg:text-lg lg:tracking-tighter"
              >
                Francis Oliver
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className="text-xs font-medium uppercase tracking-tight text-white
                           hover:text-white/80 sm:text-sm lg:text-lg lg:tracking-tighter"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#gallery"
                className="text-xs font-medium uppercase tracking-tight text-white
                           hover:text-white/80 sm:text-sm lg:text-lg lg:tracking-tighter"
              >
                <span className="inline-block align-baseline text-base leading-none sm:text-lg lg:text-2xl">
                  .
                </span>
                Gallery
              </a>
            </li>
          </ul>
        </nav>

        <div
          ref={bottomLeftRef}
          className="fixed bottom-3 left-4 z-40 text-xs font-medium tracking-tight
                     text-black sm:bottom-8 sm:left-6 sm:text-sm
                     lg:bottom-10 lg:left-10 lg:tracking-tighter"
        >
          {timestamp}
        </div>
        <div
          ref={bottomRightRef}
          className="fixed bottom-3 right-4 z-40 text-xs font-medium tracking-tight
                     text-black sm:bottom-8 sm:right-6 sm:text-sm
                     lg:bottom-10 lg:right-10 lg:tracking-tighter"
        >
          FULL-STACK DEV
        </div>
      </div>
    </div>
  );
}
