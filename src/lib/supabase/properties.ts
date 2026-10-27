import { Property, Subdivision, Town } from "@/types";
import { unstable_cache } from "next/cache";
import { propertySlug, slugify, subdivisionName } from "@/lib/utils";

const fetchFeaturedProperties = unstable_cache(
  async (supabaseUrl: string, supabaseKey: string): Promise<Property[]> => {
    const { createClient: createBrowserClient } = await import(
      "@supabase/supabase-js"
    );
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "available")
      .eq("featured", true)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("[properties] getFeaturedProperties failed:", error.message);
      return [];
    }
    return (data || []) as Property[];
  },
  ["featured-properties"],
  { revalidate: 60, tags: ["properties"] }
);

const fetchAllProperties = unstable_cache(
  async (supabaseUrl: string, supabaseKey: string): Promise<Property[]> => {
    const { createClient: createBrowserClient } = await import(
      "@supabase/supabase-js"
    );
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[properties] getAllProperties failed:", error.message);
      return [];
    }
    return (data || []) as Property[];
  },
  ["all-properties"],
  { revalidate: 60, tags: ["properties"] }
);

const fetchPropertyById = unstable_cache(
  async (
    supabaseUrl: string,
    supabaseKey: string,
    id: string
  ): Promise<Property | null> => {
    const { createClient: createBrowserClient } = await import(
      "@supabase/supabase-js"
    );
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[properties] getPropertyById failed:", error.message);
      return null;
    }
    return data as Property;
  },
  ["property-by-id"],
  { revalidate: 60, tags: ["properties"] }
);

const fetchSimilarProperties = unstable_cache(
  async (
    supabaseUrl: string,
    supabaseKey: string,
    id: string,
    type: string
  ): Promise<Property[]> => {
    const { createClient: createBrowserClient } = await import(
      "@supabase/supabase-js"
    );
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .neq("id", id)
      .eq("type", type)
      .eq("status", "available")
      .limit(3);

    if (error) {
      console.error("[properties] getSimilarProperties failed:", error.message);
      return [];
    }
    return (data || []) as Property[];
  },
  ["similar-properties"],
  { revalidate: 60, tags: ["properties"] }
);

const getSupabaseCredentials = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

export async function getFeaturedProperties(): Promise<Property[]> {
  const { url, key } = getSupabaseCredentials();
  return fetchFeaturedProperties(url, key);
}

export async function getAllProperties(): Promise<Property[]> {
  const { url, key } = getSupabaseCredentials();
  return fetchAllProperties(url, key);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { url, key } = getSupabaseCredentials();
  return fetchPropertyById(url, key, id);
}

/**
 * Resolve a URL slug to a listing. Matches the current slug first, then any
 * slug the listing used to have, then its title-derived slug (links shared
 * before slugs were stored). Callers compare against propertySlug() and
 * redirect when the match wasn't the current one.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const properties = await getAllProperties();
  return (
    properties.find((p) => propertySlug(p) === slug) ??
    properties.find((p) => p.previous_slugs?.includes(slug)) ??
    properties.find((p) => slugify(p.title) === slug) ??
    null
  );
}

export async function getSimilarProperties(
  id: string,
  type: string
): Promise<Property[]> {
  const { url, key } = getSupabaseCredentials();
  return fetchSimilarProperties(url, key, id, type);
}

/**
 * Group available listings by development. Derived from getAllProperties so it
 * reuses that cache entry rather than opening a second query path.
 */
export async function getSubdivisions(): Promise<Subdivision[]> {
  const properties = await getAllProperties();
  const groups = new Map<string, Subdivision>();

  for (const property of properties) {
    if (!property.subdivision || property.status !== "available") continue;
    const name = subdivisionName(property.subdivision);
    if (!name) continue;

    const slug = slugify(name);
    const group = groups.get(slug);

    if (!group) {
      groups.set(slug, {
        name,
        slug,
        locations: property.location ? [property.location] : [],
        properties: [property],
        minPrice: property.price,
        maxPrice: property.price,
      });
      continue;
    }

    group.properties.push(property);
    group.minPrice = Math.min(group.minPrice, property.price);
    group.maxPrice = Math.max(group.maxPrice, property.price);
    if (property.location && !group.locations.includes(property.location)) {
      group.locations.push(property.location);
    }
  }

  // Only developments with more than one listing earn a hub page — a single
  // listing would just duplicate its own detail page and compete with it.
  return [...groups.values()]
    .filter((g) => g.properties.length > 1)
    .sort((a, b) => b.properties.length - a.properties.length);
}

/**
 * Town landing pages ("House and lot for sale in Malolos"), derived from the
 * same cached listing set as the hubs. A town qualifies with 2+ available
 * listings from 2+ developments: a single-development town would duplicate its
 * hub page, whose title already targets "… for Sale in <town>".
 */
export async function getTowns(): Promise<Town[]> {
  const [properties, hubs] = await Promise.all([getAllProperties(), getSubdivisions()]);
  const hubSlugs = new Set(hubs.map((h) => h.slug));
  const groups = new Map<string, Property[]>();

  for (const property of properties) {
    const location = property.location?.trim();
    if (property.status !== "available" || !location || location === "Other") continue;
    groups.set(location, [...(groups.get(location) ?? []), property]);
  }

  const towns: Town[] = [];
  for (const [name, listings] of groups) {
    const devs = new Map<string, Town["developments"][number]>();
    for (const p of listings) {
      // Listings without a development each count as their own entry.
      const dev = (p.subdivision && subdivisionName(p.subdivision)) || p.title;
      const existing = devs.get(dev);
      if (existing) {
        existing.count++;
        existing.minPrice = Math.min(existing.minPrice, p.price);
      } else {
        const hubSlug = p.subdivision ? slugify(dev) : null;
        devs.set(dev, {
          name: dev,
          hubSlug: hubSlug && hubSlugs.has(hubSlug) ? hubSlug : null,
          count: 1,
          minPrice: p.price,
        });
      }
    }
    if (listings.length < 2 || devs.size < 2) continue;

    const prices = listings.map((p) => p.price);
    towns.push({
      name,
      slug: slugify(name),
      properties: listings,
      developments: [...devs.values()].sort((a, b) => b.count - a.count),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    });
  }

  return towns.sort((a, b) => b.properties.length - a.properties.length);
}

export async function getTownBySlug(slug: string): Promise<Town | null> {
  const towns = await getTowns();
  return towns.find((t) => t.slug === slug) ?? null;
}

export async function getSubdivisionBySlug(
  slug: string
): Promise<Subdivision | null> {
  const subdivisions = await getSubdivisions();
  return subdivisions.find((s) => s.slug === slug) ?? null;
}