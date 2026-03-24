import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "Francis Oliver",
  description: "Francis Oliver — Portfolio",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
