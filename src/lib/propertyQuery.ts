import { Property } from "@/types";

/**
 * The /properties listing state lives entirely in the URL so the page can be
 * server-rendered and every page of results is a real, crawlable link. Param
 * names match the links already pointing here (/buy, /rent, footer, hero
 * search, developer logos) — keep them stable.
 */

// Divisible by 2 and 3 so full pages fill every row of the grid.
export const ITEMS_PER_PAGE = 12;

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Featured First", value: "featured" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/**
 * Purchase-price ranges, split where the current inventory naturally groups
 * (entry townhouses ~₱3M, mid models ~₱5–7M, premium ₱10M+). Sale prices
 * only — a monthly rent would land in "Under ₱4M".
 */
export const BUDGETS = [
  { value: "under-4m", label: "Under ₱4M", min: 0, max: 4_000_000 },
  { value: "4m-7m", label: "₱4M – ₱7M", min: 4_000_000, max: 7_000_000 },
  { value: "7m-10m", label: "₱7M – ₱10M", min: 7_000_000, max: 10_000_000 },
  { value: "10m-up", label: "₱10M and up", min: 10_000_000, max: Infinity },
] as const;

export interface PropertyQuery {
  listing: "all" | "sale" | "rent";
  type: string;
  location: string;
  /** A BUDGETS value, or "" for any price. */
  budget: string;
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
  const budget = first(params.budget);

  return {
    listing:
      listing === "For Sale" ? "sale" : listing === "For Rent" ? "rent" : "all",
    // "All …" is what the hero search sends when nothing is picked.
    type: type === "All Types" ? "" : type,
    location: location === "All Locations" ? "" : location,
    budget: BUDGETS.some((b) => b.value === budget) ? budget : "",
    keyword: first(params.keyword),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortValue) : "newest",
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

export interface Facet {
  value: string;
  count: number;
  /** Shown instead of the value when set. */
  label?: string;
}

export interface PropertyFacets {
  locations: Facet[];
  types: Facet[];
  budgets: Facet[];
  sale: number;
  rent: number;
}

/**
 * Filter options built from the listings themselves, so a dropdown never
 * offers a town or type that leads to an empty page.
 */
export function propertyFacets(properties: Property[]): PropertyFacets {
  const tally = (values: (string | null | undefined)[]): Facet[] => {
    const counts = new Map<string, number>();
    for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
    return [...counts]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  };
  return {
    locations: tally(properties.map((p) => p.location?.trim())),
    types: tally(properties.map((p) => p.property_type)),
    budgets: BUDGETS.map((b) => ({
      value: b.value,
      label: b.label,
      count: properties.filter((p) => p.type === "sale" && p.price >= b.min && p.price < b.max).length,
    })).filter((b) => b.count > 0),
    sale: properties.filter((p) => p.type === "sale").length,
    rent: properties.filter((p) => p.type === "rent").length,
  };
}

/** Anything that narrows or reorders the full list (pagination aside). */
export function hasFilters(q: PropertyQuery): boolean {
  return (
    q.listing !== "all" ||
    !!q.type ||
    !!q.location ||
    !!q.budget ||
    !!q.keyword ||
    q.sort !== "newest"
  );
}

/** Build a /properties URL, omitting defaults so the plain URL stays canonical. */
export function propertiesHref(q: PropertyQuery): string {
  const params = new URLSearchParams();
  if (q.listing !== "all") params.set("listing", q.listing === "sale" ? "For Sale" : "For Rent");
  if (q.type) params.set("type", q.type);
  if (q.location) params.set("location", q.location);
  if (q.budget) params.set("budget", q.budget);
  if (q.keyword) params.set("keyword", q.keyword);
  if (q.sort !== "newest") params.set("sort", q.sort);
  if (q.page > 1) params.set("page", String(q.page));
  const qs = params.toString();
  return qs ? `/properties?${qs}` : "/properties";
}

export function filterProperties(properties: Property[], q: PropertyQuery): Property[] {
  const keyword = q.keyword.toLowerCase();
  const location = q.location.toLowerCase();
  const budget = BUDGETS.find((b) => b.value === q.budget);

  const results = properties.filter(
    (p) =>
      (q.listing === "all" || p.type === q.listing) &&
      (!q.type || p.property_type === q.type) &&
      (!location || p.location.toLowerCase().includes(location)) &&
      (!budget || (p.type === "sale" && p.price >= budget.min && p.price < budget.max)) &&
      (!keyword ||
        p.title.toLowerCase().includes(keyword) ||
        p.location.toLowerCase().includes(keyword) ||
        !!p.subdivision?.toLowerCase().includes(keyword))
  );

  const bySort = (a: Property, b: Property): number => {
    switch (q.sort) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  };

  // Sold/rented listings stay browsable but always sort after available ones,
  // so a just-closed sale doesn't take a page-1 slot.
  const offMarket = (p: Property) => (p.status === "available" ? 0 : 1);
  return results.sort((a, b) => offMarket(a) - offMarket(b) || bySort(a, b));
}
