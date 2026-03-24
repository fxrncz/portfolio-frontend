import ExpandableGallerySection from "./ExpandableGallerySection";

const CLOSED_IMAGES = [
  { src: "/assets/img16.webp", alt: "Cloud photo 1" },
  { src: "/assets/img15.webp", alt: "Cloud photo 2" },
  { src: "/assets/img14.webp", alt: "Cloud photo 3" },
  { src: "/assets/img13.webp", alt: "Cloud photo 4" },
] as const;

const OPEN_IMAGES = [
  { src: "/assets/img09.webp", alt: "Cloud expanded photo 1" },
  { src: "/assets/img10.webp", alt: "Cloud expanded photo 2" },
  { src: "/assets/img11.webp", alt: "Cloud expanded photo 3" },
  { src: "/assets/img12.webp", alt: "Cloud expanded photo 4" },
] as const;

export default function CloudsExpandableSection() {
  return (
    <ExpandableGallerySection
      title="Clouds"
      caption="My random shot sky pics .."
      closedImages={CLOSED_IMAGES}
      openImages={OPEN_IMAGES}
    />
  );
}
