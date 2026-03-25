"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import HeroText from "./HeroText";
import TalkButton from "./TalkButton";
import TopRightNav from "./TopRightNav";

const NAV_ITEMS = [
  { label: "FRANCIS OLIVER", href: "/about", active: true },
  { label: ".GALLERY", href: "/gallery", active: false },
  { label: "RESUME", href: "/resume", active: false },
  { label: "PROJECTS", href: "/projects", active: false },
] as const;

const INTRO =
  "Hi! I'm Francis Oliver, a graduating student at STI College. Thanks for stopping by my website. I aspire to create \"Awwwards\"-level websites like this. I specialize in building web applications using Java with Spring Boot. Feel free to reach out if you'd like me to develop a software application for you.";
const INTRO_WORDS = INTRO.split(" ");

const SOCIAL_LINKS = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/il.ahown/" },
  { label: "GITHUB", href: "https://github.com/fxrncz" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/fxrncz/" },
] as const;

/** After top-left block starts; top-right nav tweens begin here (seconds). */
const NAV_INTRO_DELAY_AFTER_LEFT = 0.48;

export default function AboutPageClient() {
  const bottomBarFillRef = useRef<HTMLDivElement>(null);
  const navWrapRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const talkBtnRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  const [fromLanding] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const isFromLanding =
        window.sessionStorage.getItem("about-intro-source") === "landing";
      if (isFromLanding) {
        window.sessionStorage.removeItem("about-intro-source");
      }
      return isFromLanding;
    } catch {
      return false;
    }
  });
  const [playHeroIntro, setPlayHeroIntro] = useState(false);
  const contentTlRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);

  useLayoutEffect(() => {
    if (!fromLanding) return;

    const profile = profileRef.current;
    const para = paraRef.current;
    const navWrap = navWrapRef.current;
    const talkBtn = talkBtnRef.current;
    const socials = socialsRef.current;

    if (profile) gsap.set(profile, { clipPath: "inset(100% 100% 0% 0%)" });

    if (para) {
      const inners = para.querySelectorAll<HTMLElement>(".para-inner");
      gsap.set(inners, { yPercent: 100 });
    }

    if (talkBtn) gsap.set(talkBtn, { autoAlpha: 0, y: 15 });

    if (socials) {
      const outers = socials.querySelectorAll<HTMLElement>(".social-outer");
      const inners = socials.querySelectorAll<HTMLElement>(".social-inner");
      gsap.set(outers, { overflow: "hidden" });
      gsap.set(inners, { yPercent: 120 });
    }

    if (navWrap) {
      const inners = navWrap.querySelectorAll<HTMLElement>(".nav-mask-inner");
      const marker = navWrap.querySelector<HTMLElement>(".nav-marker");
      gsap.set(inners, { yPercent: 120 });
      if (marker) gsap.set(marker, { opacity: 0 });
    }
  }, [fromLanding]);

  useLayoutEffect(() => {
    if (!fromLanding) return;
    const barFill = bottomBarFillRef.current;
    if (!barFill) return;

    gsap.set(barFill, {
      clipPath: "inset(100% 0% 0% 0%)",
      willChange: "clip-path",
    });

    const tl = gsap.timeline();
    tl.to(barFill, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.02,
      ease: "power3.out",
    })
      .set(barFill, { clearProps: "willChange,clipPath" })
      .call(() => {
        setPlayHeroIntro(true);
      });

    return () => {
      tl.kill();
    };
  }, [fromLanding]);

  const handleHeroIntroMidpoint = useCallback(() => {
    if (!fromLanding) return;

    contentTlRef.current?.kill();

    const profile = profileRef.current;
    const paraOuters =
      paraRef.current?.querySelectorAll<HTMLElement>(".para-outer");
    const paraInners =
      paraRef.current?.querySelectorAll<HTMLElement>(".para-inner");
    const navInners =
      navWrapRef.current?.querySelectorAll<HTMLElement>(".nav-mask-inner");
    const navMarker =
      navWrapRef.current?.querySelector<HTMLElement>(".nav-marker");
    const socialOuters =
      socialsRef.current?.querySelectorAll<HTMLElement>(".social-outer");
    const socialInners =
      socialsRef.current?.querySelectorAll<HTMLElement>(".social-inner");
    const talkBtn = talkBtnRef.current;

    if (paraOuters?.length) {
      gsap.set(paraOuters, {
        paddingTop: "0.1em",
        marginTop: "-0.1em",
        paddingBottom: "0.12em",
        marginBottom: "-0.12em",
      });
    }

    /* t=0 aligns with ~half of HeroText letter reveal (onIntroMidpoint). */
    const tl = gsap.timeline();
    contentTlRef.current = tl;
    const leftStart = 0;
    const navStart = NAV_INTRO_DELAY_AFTER_LEFT;

    if (profile) {
      tl.to(
        profile,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.82,
          ease: "power3.out",
        },
        leftStart
      );
    }

    if (paraInners?.length) {
      tl.to(
        paraInners,
        {
          yPercent: 0,
          duration: 0.68,
          stagger: 0.012,
          ease: "expo.out",
        },
        leftStart
      );
    }

    if (talkBtn) {
      tl.to(
        talkBtn,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        leftStart
      );
    }

    if (socialInners?.length) {
      tl.to(
        socialInners,
        {
          yPercent: 0,
          duration: 0.58,
          stagger: 0.04,
          ease: "expo.out",
        },
        leftStart
      );
    }

    if (navInners?.length) {
      tl.to(
        navInners,
        {
          yPercent: 0,
          duration: 0.62,
          stagger: 0.055,
          ease: "expo.out",
        },
        navStart
      );
    }

    if (navMarker) {
      tl.to(
        navMarker,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        navStart
      );
    }

    tl.call(() => {
      if (paraOuters?.length) {
        gsap.set(paraOuters, {
          clearProps: "paddingTop,paddingBottom,marginTop,marginBottom",
        });
      }
      if (paraInners?.length) {
        gsap.set(paraInners, { clearProps: "transform,yPercent" });
      }
      if (socialOuters?.length) {
        gsap.set(socialOuters, { clearProps: "overflow" });
      }
      if (socialInners?.length) {
        gsap.set(socialInners, { clearProps: "transform,yPercent" });
      }
      if (navInners?.length) {
        gsap.set(navInners, { clearProps: "transform,yPercent" });
      }
      if (profile) {
        gsap.set(profile, { clearProps: "clipPath" });
      }
    });
  }, [fromLanding]);

  useEffect(() => {
    return () => {
      contentTlRef.current?.kill();
      contentTlRef.current = null;
    };
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <div className="relative flex w-full shrink-0 flex-col px-4 pt-4 sm:px-6 sm:pt-6 md:px-8 lg:px-10">
        <div ref={navWrapRef}>
          <TopRightNav
            items={NAV_ITEMS}
            className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6"
          />
        </div>

        <div className="pl-3 max-w-[calc(100vw-8rem)] sm:pl-4 sm:max-w-none sm:pr-28 md:pr-36 lg:max-w-[min(72rem,calc(100vw-18rem))] lg:pr-48 xl:pr-56">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10">
            <div
              ref={profileRef}
              className="relative h-32 w-32 shrink-0 overflow-hidden sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-44 lg:w-44 xl:h-72 xl:w-72"
            >
              <Image
                src="/assets/profile1.webp"
                alt="Francis Oliver"
                fill
                className="object-cover grayscale"
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, (max-width: 1280px) 176px, 288px"
                priority
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3 sm:self-stretch sm:min-h-40 md:min-h-48 lg:min-h-44 xl:min-h-72">
              <p
                ref={paraRef}
                className="max-w-5xl leading-snug tracking-[-0.04em] text-black lg:max-w-none text-xs sm:text-sm md:text-sm lg:text-sm xl:text-lg xl:leading-relaxed xl:tracking-[-0.08em]"
              >
                {INTRO_WORDS.map((word, i) => (
                  <Fragment key={i}>
                    <span
                      className="para-outer inline-block overflow-hidden"
                      style={{ verticalAlign: "bottom" }}
                    >
                      <span className="para-inner inline-block">{word}</span>
                    </span>
                    {i < INTRO_WORDS.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </p>
              <div ref={talkBtnRef}>
                <TalkButton />
              </div>
              <div
                ref={socialsRef}
                className="flex flex-wrap gap-3 sm:mt-auto sm:gap-4 xl:gap-6"
              >
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <span
                    key={label}
                    className="social-outer inline-block"
                    style={{ verticalAlign: "bottom" }}
                  >
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-inner relative inline-block text-[0.65rem] font-medium uppercase tracking-tight text-black sm:text-xs xl:text-sm after:absolute after:left-0 after:top-[calc(100%+2px)] after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-black after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100"
                    >
                      {label}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-8 flex-1" />

      <HeroText
        playIntro={playHeroIntro}
        holdForIntro={fromLanding}
        onIntroMidpoint={handleHeroIntroMidpoint}
      />

      <section
        className="relative w-full shrink-0 overflow-hidden"
        style={{ height: "30vh" }}
        aria-hidden
      >
        <div
          ref={bottomBarFillRef}
          className="absolute inset-0 bg-black"
        />
      </section>
    </div>
  );
}
