import { MetadataRoute } from "next";
import { getAllProperties } from "@/lib/supabase/properties";
import { FEATURED_PROPERTIES } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://brokershella.com";

  let properties = await getAllProperties();
  if (properties.length === 0) properties = FEATURED_PROPERTIES;

  const propertyUrls = properties.map((p) => ({
    url: `${baseUrl}/properties/${p.id}`,
    lastModified: new Date(p.created_at || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
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
    ...propertyUrls,
  ];
}