import { notFound, permanentRedirect } from "next/navigation";
import {
  getPropertyBySlug,
  getPropertyById,
  getSimilarProperties,
  getAllProperties,
  getSubdivisionBySlug,
} from "@/lib/supabase/properties";
import { propertySlug, slugify, subdivisionName } from "@/lib/utils";
import PropertyDetailClient from "./PropertyDetailClient";
import MobileContactBar from "@/components/layout/MobileContactBar";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const properties = await getAllProperties();
  return properties.map((p) => ({ slug: propertySlug(p) }));
}

export const revalidate = 60;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveProperty(slug: string) {
  // Try slug first, fall back to UUID for backward compatibility
  return (
    (await getPropertyBySlug(slug)) ??
    (UUID.test(slug) ? await getPropertyById(slug) : null)
  );
}

// Listing descriptions are authored for humans — emoji, line breaks and
// financing tables. Google shows ~155 chars, so flatten and clip on a word
// boundary rather than letting it truncate mid-table.
function metaDescription(property: { description?: string | null }): string {
  const flat = (property.description ?? "")
    .replace(/\s+/g, " ")
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/gu,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
  if (flat.length <= 155) return flat;
  const clipped = flat.slice(0, 155);
  return `${clipped.slice(0, clipped.lastIndexOf(" "))}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await resolveProperty(slug);
  if (!property) return { title: "Property Not Found" };
  const description = metaDescription(property);
  return {
    // Bare title — the root layout's template appends the brand. Adding it
    // here too produced "… | Broker Shella | Broker Shella — SMGC Properties".
    title: property.title,
    description,
    alternates: {
      canonical: `/properties/${propertySlug(property)}`,
    },
    openGraph: {
      title: property.title,
      description,
      images: property.images?.[0] ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await resolveProperty(slug);
  if (!property) notFound();

  // Old slugs, title-derived slugs and UUID links all land here — send them to
  // the one canonical URL so shared links keep working and rankings consolidate.
  if (slug !== propertySlug(property)) {
    permanentRedirect(`/properties/${propertySlug(property)}`);
  }

  const similar = await getSimilarProperties(property.id, property.type);

  // Only link the development when it actually has a hub page (>1 listing).
  const subdivisionSlug = property.subdivision
    ? (await getSubdivisionBySlug(slugify(subdivisionName(property.subdivision))))
        ?.slug ?? null
    : null;

  const url = `https://www.smgcproperties.com/properties/${propertySlug(property)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.smgcproperties.com" },
        { "@type": "ListItem", position: 2, name: "Properties", item: "https://www.smgcproperties.com/properties" },
        { "@type": "ListItem", position: 3, name: property.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: property.title,
      description: property.description,
      image: property.images,
      category: property.property_type || "Real Estate",
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "PHP",
        availability:
          property.status === "available"
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url,
        seller: {
          "@type": "RealEstateAgent",
          name: "Broker Shella — SMGC Properties",
        },
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailClient
        property={property}
        similar={similar}
        subdivisionSlug={subdivisionSlug}
      />
      <MobileContactBar />
    </>
  );
}
