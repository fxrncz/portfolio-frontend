import ExpandableGallerySection from "./ExpandableGallerySection";

const CLOSED_IMAGES = [
  { src: "/assets/img20.webp", alt: "Favorite photo 1" },
  { src: "/assets/img21.webp", alt: "Favorite photo 2" },
  { src: "/assets/img24.webp", alt: "Favorite photo 3" },
  { src: "/assets/img22.webp", alt: "Favorite photo 4" },
] as const;

const OPEN_IMAGES = [
  { src: "/assets/img17.webp", alt: "Favorite expanded photo 1" },
  { src: "/assets/img18.webp", alt: "Favorite expanded photo 2" },
  { src: "/assets/img19.webp", alt: "Favorite expanded photo 3" },
  { src: "/assets/img23.webp", alt: "Favorite expanded photo 4" },
] as const;

export default function FavoritesExpandableSection() {
  return (
    <ExpandableGallerySection
      title="Favorites"
      caption="My personal fav photos of me"
      closedImages={CLOSED_IMAGES}
      openImages={OPEN_IMAGES}
    />
  );
}
