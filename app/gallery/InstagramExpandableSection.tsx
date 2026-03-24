import ExpandableGallerySection from "./ExpandableGallerySection";

const CLOSED_IMAGES = [
  { src: "/assets/img05.webp", alt: "Instagram photo 1" },
  { src: "/assets/img08.webp", alt: "Instagram photo 2" },
  { src: "/assets/img04.webp", alt: "Instagram photo 3" },
  { src: "/assets/img07.webp", alt: "Instagram photo 4" },
] as const;

const OPEN_IMAGES = [
  { src: "/assets/img01.webp", alt: "Instagram expanded photo 1" },
  { src: "/assets/img02.webp", alt: "Instagram expanded photo 2" },
  { src: "/assets/img03.webp", alt: "Instagram expanded photo 3" },
  { src: "/assets/img06.webp", alt: "Instagram expanded photo 4" },
] as const;

export default function InstagramExpandableSection() {
  return (
    <ExpandableGallerySection
      title="Instagram"
      caption="My latest post in instagram"
      closedImages={CLOSED_IMAGES}
      openImages={OPEN_IMAGES}
    />
  );
}
