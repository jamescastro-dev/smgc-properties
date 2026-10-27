import { MetadataRoute } from "next";
import { getAllProperties, getSubdivisions } from "@/lib/supabase/properties";
import { propertySlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.smgcproperties.com";

  const properties = await getAllProperties();

  // Sold/rented listings stay reachable for old links but aren't promoted.
  const propertyUrls = properties.filter((p) => p.status === "available").map((p) => ({
    url: `${baseUrl}/properties/${propertySlug(p)}`,
    lastModified: new Date(p.created_at || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Development hub pages — these target subdivision-name searches
  // ("St. Agatha Homes"), so they rank above the individual unit pages.
  const subdivisions = await getSubdivisions().catch(() => []);
  const subdivisionUrls = subdivisions.map((s) => ({
    url: `${baseUrl}/subdivisions/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...subdivisionUrls,
    ...propertyUrls,
  ];
}