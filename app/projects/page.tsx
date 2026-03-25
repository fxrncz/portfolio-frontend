import type { Metadata } from "next";
import TopRightNav from "../about/TopRightNav";
import ProjectsListSection from "./ProjectsListSection";

const NAV_ITEMS = [
  { label: "FRANCIS OLIVER", href: "/about", active: false },
  { label: ".GALLERY", href: "/gallery", active: false },
  { label: "RESUME", href: "/resume", active: false },
  { label: "PROJECTS", href: "/projects", active: true },
] as const;

export const metadata: Metadata = {
  title: "Projects | Francis Oliver",
  description: "Francis Oliver — Projects",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="relative px-3 pt-3 sm:px-6 sm:pt-5 md:px-8 md:pt-6 lg:px-10">
        <h1
          className="text-[clamp(2.75rem,16vw,9rem)] font-semibold uppercase tracking-[-0.06em]"
          style={{ lineHeight: 0.82 }}
        >
          PROJECTS
        </h1>

        <TopRightNav
          items={NAV_ITEMS}
          className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6"
        />
      </header>

      <ProjectsListSection />
    </div>
  );
}
