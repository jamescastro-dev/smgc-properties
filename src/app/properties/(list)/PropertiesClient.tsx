"use client";

import { useState, useEffect, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ChevronDown, MessageCircle } from "lucide-react";
import Segmented from "@/components/ui/Segmented";
import {
  Facet,
  PropertyFacets,
  PropertyQuery,
  SORT_OPTIONS,
  SortValue,
  hasFilters,
  propertiesHref,
} from "@/lib/propertyQuery";

interface Props {
  query: PropertyQuery;
  /** Locations/types that actually have listings, with counts. */
  facets: PropertyFacets;
  total: number;
  from: number;
  to: number;
  /** Server-rendered result grid + pagination. */
  children: React.ReactNode;
}

/**
 * Filter controls for /properties. Results are rendered on the server from the
 * URL; every control here just navigates to a new URL. useOptimistic keeps the
 * controls showing the new value while the server renders it.
 */
export default function PropertiesClient({ query, facets, total, from, to, children }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useOptimistic(query);

  const update = (changes: Partial<PropertyQuery>) => {
    // Any filter change starts over at page 1.
    const next = { ...current, ...changes, page: 1 };
    startTransition(() => {
      setCurrent(next);
      router.replace(propertiesHref(next), { scroll: false });
    });
  };

  // Keyword typing is debounced. `sent` is the last value we navigated with, so
  // a slow response for "mal" can't clobber "malo" typed meanwhile; any other
  // URL change (footer link, hero search) resets the box to the URL's value.
  const [keyword, setKeyword] = useState(query.keyword);
  const [sent, setSent] = useState(query.keyword);
  const [urlKeyword, setUrlKeyword] = useState(query.keyword);
  if (query.keyword !== urlKeyword) {
    setUrlKeyword(query.keyword);
    if (query.keyword !== sent) {
      setKeyword(query.keyword);
      setSent(query.keyword);
    }
  }

  useEffect(() => {
    if (keyword === sent) return;
    const timer = setTimeout(() => {
      setSent(keyword);
      update({ keyword: keyword.trim() });
    }, 350);
    return () => clearTimeout(timer);
  });

  const filtersActive = hasFilters({ ...current, sort: "newest" });
  const showListingTabs = (facets.rent > 0 && facets.sale > 0) || current.listing !== "all";

  const clearFilters = () => {
    setKeyword("");
    setSent("");
    update({ listing: "all", type: "", location: "", budget: "", keyword: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Page header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-8 h-px bg-gold-500" />
          <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
            All listings
          </span>
        </div>
        <h1 className="text-4xl font-display font-semibold text-luxury-50 tracking-tight">
          Properties
        </h1>
        <p className="text-luxury-400 text-sm mt-2 max-w-xl">
          Pre-selling and ready-for-occupancy homes in Bulacan and Luzon, from
          accredited developers.
        </p>
      </div>

      {/* Filters — always visible: with one inventory and a handful of towns,
          a hidden panel just hid the two filters people actually use. */}
      <div
        className={`bg-luxury-800 border border-luxury-700 rounded-2xl p-3 sm:p-4 mb-6 grid grid-cols-2 gap-3 ${
          showListingTabs
            ? "lg:grid-cols-[minmax(0,1fr)_12rem_10rem_10rem_auto]"
            : "lg:grid-cols-[minmax(0,1fr)_13rem_11rem_11rem]"
        }`}>
        <label className="relative col-span-2 lg:col-span-1">
          <span className="sr-only">Search listings</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-500 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Model, development or town"
            className={`${field} pl-10`}
          />
        </label>

        <FilterSelect
          label="Location"
          value={current.location}
          allLabel="All locations"
          options={withCurrent(facets.locations, current.location)}
          onChange={(location) => update({ location })}
        />
        <FilterSelect
          label="Budget"
          value={current.budget}
          allLabel="Any budget"
          options={facets.budgets}
          onChange={(budget) => update({ budget })}
        />
        <FilterSelect
          label="Property type"
          className="col-span-2 lg:col-span-1"
          value={current.type}
          allLabel="All types"
          options={withCurrent(facets.types, current.type)}
          onChange={(type) => update({ type })}
        />

        {/* Sale/Rent only means something once both exist; until then it
            showed "For Rent" leading to an empty page. /rent links still
            land here with the tab shown so it can be switched back. */}
        {showListingTabs && (
          <Segmented
            label="Listing type"
            className="col-span-2 lg:col-span-1"
            value={current.listing}
            onChange={(v) => update({ listing: v as PropertyQuery["listing"] })}
            options={[
              { value: "all", label: "All" },
              { value: "sale", label: "For Sale" },
              { value: "rent", label: "For Rent" },
            ]}
          />
        )}
      </div>

      {/* Count, clear, sort */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className="text-luxury-400 text-sm min-w-0" aria-live="polite">
          {total > 0 ? (
            <>
              Showing{" "}
              <span className="text-luxury-50 font-semibold tabular-nums">
                {from}–{to}
              </span>{" "}
              of <span className="text-luxury-50 font-semibold tabular-nums">{total}</span>
            </>
          ) : (
            "No matches"
          )}
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="ml-3 inline-flex items-center gap-1 text-gold-500 hover:text-gold-400 font-medium transition-colors">
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </p>

        <div className="relative shrink-0">
          <select
            aria-label="Sort properties"
            value={current.sort}
            onChange={(e) => update({ sort: e.target.value as SortValue })}
            className="bg-transparent border border-luxury-700 hover:border-gold-500/50 rounded-lg pl-3 pr-8 h-9 text-luxury-50 text-sm outline-none appearance-none cursor-pointer transition-colors">
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-luxury-800 text-luxury-50">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-500 pointer-events-none" />
        </div>
      </div>

      {/* Results */}
      <div
        aria-busy={isPending}
        className={`transition-opacity duration-200 ${isPending ? "opacity-50" : ""}`}>
        {total > 0 ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-luxury-800 border border-luxury-700 flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-gold-500" />
            </div>
            <h2 className="text-luxury-50 text-xl font-bold mb-2">
              Not yet updated
            </h2>
            <p className="text-luxury-400 text-sm mb-2 max-w-sm">
              {query.keyword ? (
                <>
                  No listings for{" "}
                  <span className="text-luxury-50 font-semibold">{query.keyword}</span> yet.
                </>
              ) : (
                "No listings match your search yet."
              )}
            </p>
            <p className="text-luxury-400 text-sm mb-8 max-w-sm">
              Contact Broker Shella directly — she may have available units not yet posted.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-6 py-3 rounded-lg tracking-wide transition-colors">
                Contact Broker Shella
              </Link>
              <button
                onClick={clearFilters}
                className="border border-luxury-600 hover:border-gold-500/50 text-luxury-400 hover:text-gold-500 text-sm font-medium px-6 py-3 rounded-lg transition-all">
                Browse All Properties
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

const field =
  "w-full h-11 bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors";

/** Keep a value that came in by link (e.g. an old footer URL) selectable. */
function withCurrent(options: Facet[], value: string): Facet[] {
  return !value || options.some((o) => o.value === value)
    ? options
    : [...options, { value, count: 0 }];
}

function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
  className = "",
}: {
  label: string;
  className?: string;
  value: string;
  allLabel: string;
  options: Facet[];
  onChange: (value: string) => void;
}) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${field} appearance-none cursor-pointer pr-9 truncate ${value ? "border-gold-500/60" : ""}`}>
        <option value="" className="bg-luxury-800 text-luxury-50">
          {allLabel}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-luxury-800 text-luxury-50">
            {o.label ?? o.value} ({o.count})
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none" />
    </div>
  );
}
