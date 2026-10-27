import { Property } from "@/types";

/**
 * The /properties listing state lives entirely in the URL so the page can be
 * server-rendered and every page of results is a real, crawlable link. Param
 * names match the links already pointing here (/buy, /rent, footer, hero
 * search, developer logos) — keep them stable.
 */

export const ITEMS_PER_PAGE = 6;

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Featured First", value: "featured" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface PropertyQuery {
  listing: "all" | "sale" | "rent";
  type: string;
  location: string;
  keyword: string;
  sort: SortValue;
  page: number;
}

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.trim() ?? "";

export function parsePropertyQuery(params: SearchParams): PropertyQuery {
  const listing = first(params.listing);
  const sort = first(params.sort);
  const page = Number.parseInt(first(params.page), 10);
  const type = first(params.type);
  const location = first(params.location);

  return {
    listing:
      listing === "For Sale" ? "sale" : listing === "For Rent" ? "rent" : "all",
    // "All …" is what the hero search sends when nothing is picked.
    type: type === "All Types" ? "" : type,
    location: location === "All Locations" ? "" : location,
    keyword: first(params.keyword),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortValue) : "newest",
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

/** Anything that narrows or reorders the full list (pagination aside). */
export function hasFilters(q: PropertyQuery): boolean {
  return (
    q.listing !== "all" || !!q.type || !!q.location || !!q.keyword || q.sort !== "newest"
  );
}

/** Build a /properties URL, omitting defaults so the plain URL stays canonical. */
export function propertiesHref(q: PropertyQuery): string {
  const params = new URLSearchParams();
  if (q.listing !== "all") params.set("listing", q.listing === "sale" ? "For Sale" : "For Rent");
  if (q.type) params.set("type", q.type);
  if (q.location) params.set("location", q.location);
  if (q.keyword) params.set("keyword", q.keyword);
  if (q.sort !== "newest") params.set("sort", q.sort);
  if (q.page > 1) params.set("page", String(q.page));
  const qs = params.toString();
  return qs ? `/properties?${qs}` : "/properties";
}

export function filterProperties(properties: Property[], q: PropertyQuery): Property[] {
  const keyword = q.keyword.toLowerCase();
  const location = q.location.toLowerCase();

  const results = properties.filter(
    (p) =>
      (q.listing === "all" || p.type === q.listing) &&
      (!q.type || p.property_type === q.type) &&
      (!location || p.location.toLowerCase().includes(location)) &&
      (!keyword ||
        p.title.toLowerCase().includes(keyword) ||
        p.location.toLowerCase().includes(keyword) ||
        !!p.subdivision?.toLowerCase().includes(keyword))
  );

  switch (q.sort) {
    case "price_asc":
      return results.sort((a, b) => a.price - b.price);
    case "price_desc":
      return results.sort((a, b) => b.price - a.price);
    case "featured":
      return results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    default:
      return results.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
  }
}
