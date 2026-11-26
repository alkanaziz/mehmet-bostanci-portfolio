import ArtworkPage, { artworkMetadata, artworkParams } from "@/components/ArtworkPage";

// One static page per workshop photo: /workshop/<WordPress slug>/
export const dynamicParams = false;

export async function generateStaticParams() {
  return artworkParams("workshop");
}

export async function generateMetadata({ params }) {
  return artworkMetadata("workshop", (await params).eser);
}

export default async function WorkshopPhoto({ params }) {
  return <ArtworkPage categorySlug="workshop" slug={(await params).eser} />;
}
