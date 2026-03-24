"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function GallerySmoothScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.add("gallery-scroll");
    body.classList.add("gallery-scroll");

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 2.2),
      smoothWheel: true,
      gestureOrientation: "vertical",
      wheelMultiplier: 0.8,
      touchMultiplier: 0.95,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      html.classList.remove("gallery-scroll");
      body.classList.remove("gallery-scroll");
    };
  }, []);

  return null;
}
