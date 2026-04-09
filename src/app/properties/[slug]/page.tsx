import { notFound } from "next/navigation";
import {
  getPropertyBySlug,
  getPropertyById,
  getSimilarProperties,
  getAllProperties,
} from "@/lib/supabase/properties";
import { FEATURED_PROPERTIES } from "@/lib/data";
import { slugify } from "@/lib/utils";
import PropertyDetailClient from "./PropertyDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const properties = await getAllProperties();
    return properties.map((p) => ({ slug: slugify(p.title) }));
  } catch {
    return FEATURED_PROPERTIES.map((p) => ({ slug: slugify(p.title) }));
  }
}

export const revalidate = 60;

async function resolveProperty(slug: string) {
  // Try slug first, fall back to UUID for backward compatibility
  let property = await getPropertyBySlug(slug);
  if (!property) property = await getPropertyById(slug);
  if (!property) property = FEATURED_PROPERTIES.find((p) => slugify(p.title) === slug || p.id === slug) || null;
  return property;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await resolveProperty(slug);
  if (!property) return { title: "Property Not Found" };
  return {
    title: `${property.title} | Broker Shella`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images?.[0] ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await resolveProperty(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(property.id, property.type).catch(() =>
    FEATURED_PROPERTIES.filter(
      (p) => p.id !== property.id && p.type === property.type
    ).slice(0, 3)
  );

  return <PropertyDetailClient property={property} similar={similar} />;
}
