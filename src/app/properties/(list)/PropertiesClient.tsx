"use client";

import { useState, useEffect, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, MessageCircle } from "lucide-react";
import { LOCATIONS, PROPERTY_TYPES } from "@/lib/constants";
import {
  PropertyQuery,
  SORT_OPTIONS,
  SortValue,
  hasFilters,
  propertiesHref,
} from "@/lib/propertyQuery";

interface Props {
  query: PropertyQuery;
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
export default function PropertiesClient({ query, total, from, to, children }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useOptimistic(query);
  const [showFilters, setShowFilters] = useState(false);

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

  const clearFilters = () => {
    setKeyword("");
    setSent("");
    update({ listing: "all", type: "", location: "", keyword: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Page header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-8 h-px bg-gold-500" />
          <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
            All listings
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-semibold text-luxury-50 tracking-tight">
              Properties
            </h1>
            <p className="text-luxury-400 text-sm mt-2">
              Showing{" "}
              <span className="text-luxury-50 font-semibold">
                {from}–{to}
              </span>{" "}
              of{" "}
              <span className="text-luxury-50 font-semibold">{total}</span>{" "}
              propert{total === 1 ? "y" : "ies"}
            </p>
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-auto">
            <select
              aria-label="Sort properties"
              value={current.sort}
              onChange={(e) => update({ sort: e.target.value as SortValue })}
              className="w-full bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 rounded-lg px-4 py-2.5 text-luxury-50 text-sm outline-none appearance-none cursor-pointer pr-8 transition-colors">
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-luxury-800 text-luxury-50">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Listing type tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(["all", "sale", "rent"] as const).map((t) => (
          <button
            key={t}
            onClick={() => update({ listing: t })}
            className={`px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 capitalize ${
              current.listing === t
                ? "bg-gold-500 text-luxury-900 border border-gold-500"
                : "bg-luxury-800 text-luxury-400 border border-luxury-700 hover:border-gold-500/50 hover:text-gold-500"
            }`}>
            {t === "all" ? "All" : `For ${t === "sale" ? "Sale" : "Rent"}`}
          </button>
        ))}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
            showFilters || filtersActive
              ? "bg-gold-500 border-gold-500 text-luxury-900"
              : "bg-luxury-800 border-luxury-700 text-luxury-400 hover:border-gold-500/50 hover:text-gold-500"
          }`}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {filtersActive && (
            <span className="w-2 h-2 rounded-full bg-luxury-900" />
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-400 text-xs font-semibold tracking-widest uppercase">
                Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search…"
                className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-2.5 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-400 text-xs font-semibold tracking-widest uppercase">
                Location
              </label>
              <div className="relative">
                <select
                  value={current.location}
                  onChange={(e) => update({ location: e.target.value })}
                  className="w-full bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-2.5 text-luxury-50 text-sm outline-none appearance-none transition-colors pr-8">
                  <option value="" className="bg-luxury-800 text-luxury-50">
                    All Locations
                  </option>
                  {LOCATIONS.map((loc) => (
                    <option
                      key={loc}
                      value={loc}
                      className="bg-luxury-800 text-luxury-50">
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-400 text-xs font-semibold tracking-widest uppercase">
                Property Type
              </label>
              <div className="relative">
                <select
                  value={current.type}
                  onChange={(e) => update({ type: e.target.value })}
                  className="w-full bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-2.5 text-luxury-50 text-sm outline-none appearance-none transition-colors pr-8">
                  <option value="" className="bg-luxury-800 text-luxury-50">
                    All Types
                  </option>
                  {PROPERTY_TYPES.map((t) => (
                    <option
                      key={t}
                      value={t}
                      className="bg-luxury-800 text-luxury-50">
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col justify-end">
              {filtersActive && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-2 border border-luxury-600 hover:border-gold-500/50 text-luxury-400 hover:text-gold-500 rounded-lg px-4 py-2.5 text-sm font-medium transition-all">
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

          </div>
        </div>
      )}

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
            <h3 className="text-luxury-50 text-xl font-bold mb-2">
              Not yet updated
            </h3>
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
            <p className="text-luxury-500 text-sm mb-8 max-w-sm">
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
