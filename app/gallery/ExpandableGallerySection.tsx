"use client";

import Image from "next/image";
import { useState } from "react";

const IMAGE_SIZES = "(max-width: 767px) 46vw, (max-width: 1279px) 34vw, 18vw";

type ImageItem = {
  src: string;
  alt: string;
};

type Props = {
  title: string;
  caption: string;
  closedImages: readonly ImageItem[];
  openImages: readonly ImageItem[];
};

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative inline-flex h-[clamp(1rem,2vw,1.85rem)] w-[clamp(1rem,2vw,1.85rem)] items-center justify-center overflow-hidden leading-none">
      <span
        aria-hidden
        className={`absolute inset-0 bg-black transition-[clip-path] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(100%_100%_0_0)]"
        }`}
      />

      <span
        className={`relative z-10 text-[clamp(1rem,2.1vw,1.75rem)] font-medium leading-none transition-[transform,opacity,color] duration-520 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "translate-x-[28%] -translate-y-[28%] scale-[0.15] rotate-180 opacity-0 text-black"
            : "translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100 text-black"
        }`}
      >
        +
      </span>

      <span
        aria-hidden
        className={`absolute z-10 text-[clamp(0.92rem,1.95vw,1.55rem)] font-medium leading-none text-white transition-[transform,opacity] duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100 delay-140"
            : "-translate-x-[28%] translate-y-[28%] scale-[0.15] -rotate-180 opacity-0"
        }`}
      >
        ✖
      </span>
    </span>
  );
}

function ClosedHoverImage({
  src,
  alt,
  open,
  onImageClick,
}: ImageItem & {
  open: boolean;
  onImageClick: () => void;
}) {
  const showFullColor = open;
  const hoverRevealActive = !open;

  return (
    <div
      className="group relative aspect-4/5 cursor-pointer overflow-hidden"
      onClick={(event) => {
        event.stopPropagation();
        onImageClick();
      }}
      role="presentation"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-[filter] duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showFullColor ? "grayscale-0" : "grayscale"
        }`}
        sizes={IMAGE_SIZES}
        quality={92}
      />
      {hoverRevealActive ? (
        <div className="pointer-events-none absolute inset-0 opacity-0 [clip-path:inset(0_100%_100%_0)] transition-[clip-path,opacity] duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:[clip-path:inset(0_0_0_0)]">
          <Image
            src={src}
            alt=""
            fill
            aria-hidden
            className="scale-[1.035] object-cover transition-transform duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
            sizes={IMAGE_SIZES}
            quality={92}
          />
        </div>
      ) : null}
    </div>
  );
}

function OpenRevealImage({
  src,
  alt,
  delayMs,
  open,
  onImageClick,
}: ImageItem & {
  delayMs: number;
  open: boolean;
  onImageClick: () => void;
}) {
  const showFullColor = open;
  const hoverRevealActive = !open;

  return (
    <div
      className={`group relative aspect-4/5 cursor-pointer overflow-hidden transition-[clip-path,opacity] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "opacity-0 [clip-path:inset(0_100%_100%_0)]"
      }`}
      style={{ transitionDelay: open ? `${delayMs}ms` : "0ms" }}
      onClick={(event) => {
        event.stopPropagation();
        onImageClick();
      }}
      role="presentation"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-[filter] duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showFullColor ? "grayscale-0" : "grayscale"
        }`}
        sizes={IMAGE_SIZES}
        quality={92}
      />
      {hoverRevealActive ? (
        <div className="pointer-events-none absolute inset-0 opacity-0 [clip-path:inset(0_100%_100%_0)] transition-[clip-path,opacity] duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:[clip-path:inset(0_0_0_0)]">
          <Image
            src={src}
            alt=""
            fill
            aria-hidden
            className="scale-[1.035] object-cover transition-transform duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
            sizes={IMAGE_SIZES}
            quality={92}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function ExpandableGallerySection({
  title,
  caption,
  closedImages,
  openImages,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleToggleHeader = () => {
    setOpen((prev) => !prev);
  };

  /** From closed state: opens section; full color follows `open` (same transition as opening). */
  const handleImageActivate = () => {
    if (!open) setOpen(true);
  };

  return (
    <>
      <div className="group/sectionlabel grid gap-6 py-5 select-none sm:py-6 md:grid-cols-[minmax(12rem,1fr)_minmax(0,3fr)] md:gap-8 lg:py-7">
        <div
          className="grid cursor-pointer grid-cols-[clamp(0.75rem,1.6vw,1.25rem)_1fr] gap-x-[clamp(2.25rem,6vw,5rem)] gap-y-1 sm:gap-y-2"
          onClick={handleToggleHeader}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleToggleHeader();
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={open}
        >
          <ToggleIcon open={open} />
          <p className="cursor-pointer text-[clamp(1.05rem,2.2vw,1.7rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/sectionlabel:translate-x-3">
            {title}
          </p>
          <span aria-hidden />
          <p className="text-[clamp(0.82rem,1.35vw,1.15rem)] leading-[1.1] tracking-[-0.03em] text-black/90">
            {caption}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {closedImages.map((img) => (
            <ClosedHoverImage
              key={img.src}
              src={img.src}
              alt={img.alt}
              open={open}
              onImageClick={handleImageActivate}
            />
          ))}
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity,margin] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "mt-1 max-h-136 opacity-100 sm:mt-1.5 md:max-h-152" : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <div className="grid md:grid-cols-[minmax(12rem,1fr)_minmax(0,3fr)] md:gap-8">
          <div className="md:col-start-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {openImages.map((img, idx) => (
                <OpenRevealImage
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  delayMs={idx * 140}
                  open={open}
                  onImageClick={handleImageActivate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`border-t border-black/35 transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "mt-10 sm:mt-12 md:mt-14" : "mt-18 sm:mt-20 md:mt-22"
        }`}
      />
    </>
  );
}
