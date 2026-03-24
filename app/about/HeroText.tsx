"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import PixelShaderOverlay from "../components/PixelShaderOverlay";

const HERO_TEXT = "Francis Oliver \u2014";

type Props = {
  playIntro?: boolean;
  holdForIntro?: boolean;
  onIntroComplete?: () => void;
};

export default function HeroText({
  playIntro = false,
  holdForIntro = false,
  onIntroComplete,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const introRanRef = useRef(false);
  const onCompleteRef = useRef(onIntroComplete);
  const [shaderEnabled, setShaderEnabled] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onIntroComplete;
  }, [onIntroComplete]);

  useLayoutEffect(() => {
    if (!holdForIntro) return;
    const wrap = wrapRef.current;
    if (wrap) wrap.style.visibility = "hidden";
  }, [holdForIntro]);

  /* Landing Developer line: DOM stays painted; overlay is hover-only (PixelShaderOverlay). */
  useEffect(() => {
    if (holdForIntro) return;
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      const h1 = h1Ref.current;
      if (h1) {
        const outers = h1.querySelectorAll<HTMLElement>(".char-outer");
        outers.forEach((el) => {
          el.style.overflow = "visible";
        });
      }
      setShaderEnabled(true);
    });
    return () => {
      cancelled = true;
    };
  }, [holdForIntro]);

  useEffect(() => {
    if (!playIntro || introRanRef.current) return;
    introRanRef.current = true;

    const wrap = wrapRef.current;
    const h1 = h1Ref.current;
    if (!wrap || !h1) return;

    const inners = h1.querySelectorAll<HTMLElement>(".char-inner");
    if (!inners.length) return;

    h1.style.color = "";
    h1.style.opacity = "1";

    gsap.set(inners, { yPercent: 120, willChange: "transform" });

    wrap.style.visibility = "visible";

    const tl = gsap.timeline();
    tl.to(inners, {
      yPercent: 0,
      duration: 0.82,
      stagger: 0.035,
      ease: "expo.out",
    }).call(
      () => {
        /* Match landing hero: do not strip transforms at rest (avoids subpixel reflow). */
        gsap.set(inners, { clearProps: "willChange" });
        const outers = h1.querySelectorAll<HTMLElement>(".char-outer");
        if (outers.length) gsap.set(outers, { overflow: "visible" });
        onCompleteRef.current?.();
        void document.fonts.ready.then(() => setShaderEnabled(true));
      },
      undefined,
      "+=0.08",
    );

    return () => {
      tl.kill();
    };
  }, [playIntro]);

  return (
    <div ref={wrapRef} className="relative shrink-0 cursor-default">
      <h1
        ref={h1Ref}
        className="px-4 font-semibold uppercase tracking-[-0.055em] text-black
                   text-4xl sm:px-6 sm:text-5xl md:px-8 md:text-6xl lg:px-10 lg:text-8xl xl:text-8xl 2xl:text-[12rem]"
        style={{ lineHeight: 0.80 }}
      >
        {HERO_TEXT.split("").map((char, i) => (
          <span
            key={`${char}-${i}`}
            className="char-outer inline-block overflow-hidden py-[0.14em]"
            style={{ verticalAlign: "bottom" }}
          >
            <span className="char-inner inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </h1>
      <PixelShaderOverlay
        targetRef={h1Ref as RefObject<HTMLElement>}
        displayText={HERO_TEXT}
        enabled={shaderEnabled}
        domCharSelector=".char-inner"
      />
    </div>
  );
}
