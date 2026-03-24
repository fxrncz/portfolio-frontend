import type { Metadata } from "next";
import CloudsExpandableSection from "./CloudsExpandableSection";
import FavoritesExpandableSection from "./FavoritesExpandableSection";
import GallerySmoothScroll from "./GallerySmoothScroll";
import InstagramExpandableSection from "./InstagramExpandableSection";
import TopRightNav from "../about/TopRightNav";

const NAV_ITEMS = [
  { label: "FRANCIS OLIVER", href: "/about", active: false },
  { label: ".GALLERY", href: "/gallery", active: true },
  { label: "RESUME", href: "/resume", active: false },
  { label: "PROJECTS", href: "/#projects", active: false },
] as const;

export const metadata: Metadata = {
  title: "Gallery | Francis Oliver",
  description: "Francis Oliver — Gallery",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <GallerySmoothScroll />
      <header className="relative px-3 pt-3 sm:px-6 sm:pt-5 md:px-8 md:pt-6 lg:px-10">
        <h1
          className="text-[clamp(2.75rem,16vw,9rem)] font-semibold uppercase tracking-[-0.06em]"
          style={{ lineHeight: 0.82 }}
        >
          .GALLERY
        </h1>

        <TopRightNav
          items={NAV_ITEMS}
          className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6"
        />
      </header>

      <section className="px-3 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 md:px-8 md:pt-10 lg:px-10">
        <div className="mt-8 border-t border-black/35 sm:mt-10 md:mt-12" />

        <InstagramExpandableSection />
        <CloudsExpandableSection />
        <FavoritesExpandableSection />

      </section>
    </div>
  );
}
