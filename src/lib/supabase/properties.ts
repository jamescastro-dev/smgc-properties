import { createClient } from "@/lib/supabase/server";
import { Property } from "@/types";
import { unstable_cache } from "next/cache";
import { slugify } from "@/lib/utils";

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
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) return [];
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
      .order("created_at", { ascending: false });

    if (error) return [];
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

    if (error) return null;
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

    if (error) return [];
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

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const properties = await getAllProperties();
  return properties.find((p) => slugify(p.title) === slug) ?? null;
}

export async function getSimilarProperties(
  id: string,
  type: string
): Promise<Property[]> {
  const { url, key } = getSupabaseCredentials();
  return fetchSimilarProperties(url, key, id, type);
}