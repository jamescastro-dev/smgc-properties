import { MetadataRoute } from "next";
import { getAllProperties, getSubdivisions, getTowns } from "@/lib/supabase/properties";
import { propertySlug } from "@/lib/utils";
import type { Property } from "@/types";

// lastModified must be a real date or nothing: a sitemap that reports the build
// time for every URL teaches Google to ignore its dates. Listings use the
// updated_at trigger column (created_at until that migration has run); pages
// built from listings take their newest listing's date; static pages omit it.
const modified = (p: Property) => p.updated_at ?? p.created_at;

function newest(properties: Property[]): Date | undefined {
  const times = properties
    .map(modified)
    .filter((t): t is string => !!t)
    .map((t) => new Date(t).getTime());
  return times.length ? new Date(Math.max(...times)) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.smgcproperties.com";

  // Sold/rented listings stay reachable for old links but aren't promoted.
  const available = (await getAllProperties()).filter((p) => p.status === "available");
  const latest = newest(available);

  const propertyUrls = available.map((p) => ({
    url: `${baseUrl}/properties/${propertySlug(p)}`,
    lastModified: modified(p) ? new Date(modified(p)!) : undefined,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Development hub pages — these target subdivision-name searches
  // ("St. Agatha Homes"), so they rank above the individual unit pages.
  const subdivisions = await getSubdivisions().catch(() => []);
  const subdivisionUrls = subdivisions.map((s) => ({
    url: `${baseUrl}/subdivisions/${s.slug}`,
    lastModified: newest(s.properties),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Town landing pages — "house and lot for sale in <town>" searches.
  const towns = await getTowns().catch(() => []);
  const townUrls = towns.map((t) => ({
    url: `${baseUrl}/locations/${t.slug}`,
    lastModified: newest(t.properties),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: latest,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: latest,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...townUrls,
    ...subdivisionUrls,
    ...propertyUrls,
  ];
}
