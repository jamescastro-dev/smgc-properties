import { notFound } from "next/navigation";
import {
  getPropertyById,
  getSimilarProperties,
  getAllProperties,
} from "@/lib/supabase/properties";
import { FEATURED_PROPERTIES } from "@/lib/data";
import PropertyDetailClient from "./PropertyDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const properties = await getAllProperties();
    return properties.map((p) => ({ id: p.id }));
  } catch {
    return FEATURED_PROPERTIES.map((p) => ({ id: p.id }));
  }
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let property = await getPropertyById(id);
  if (!property) {
    property = FEATURED_PROPERTIES.find((p) => p.id === id) || null;
  }
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
  const { id } = await params;

  let property = await getPropertyById(id);
  let similar = [];

  if (property) {
    similar = await getSimilarProperties(id, property.type);
  } else {
    property = FEATURED_PROPERTIES.find((p) => p.id === id) || null;
    if (!property) notFound();
    similar = FEATURED_PROPERTIES.filter(
      (p) => p.id !== id && p.type === property!.type
    ).slice(0, 3);
  }

  return <PropertyDetailClient property={property!} similar={similar} />;
}