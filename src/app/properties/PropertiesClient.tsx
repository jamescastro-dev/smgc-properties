"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PropertyCard from "@/components/ui/PropertyCard";
import { Property } from "@/types";

const PROPERTY_TYPES = [
  "All Types",
  "House & Lot",
  "Condominium",
  "Townhouse",
  "Vacant Lot",
  "Commercial",
] as const;

const LOCATIONS = [
  "All Locations",
  "San Jose del Monte",
  "Meycauayan",
  "Marilao",
  "Bocaue",
  "Caloocan",
  "Quezon City",
] as const;

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Featured First", value: "featured" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const ITEMS_PER_PAGE = 6;

interface Props {
  initialProperties: Property[];
}

export default function PropertiesClient({ initialProperties }: Props) {
  const searchParams = useSearchParams();

  const [listing, setListing] = useState<"all" | "sale" | "rent">(
    searchParams.get("listing") === "For Sale"
      ? "sale"
      : searchParams.get("listing") === "For Rent"
      ? "rent"
      : "all"
  );
  const [type, setType] = useState(searchParams.get("type") || "All Types");
  const [location, setLocation] = useState(
    searchParams.get("location") || "All Locations"
  );
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [sort, setSort] = useState<SortValue>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let results: Property[] = [...initialProperties];

    if (listing !== "all") {
      results = results.filter((p) => p.type === listing);
    }
    if (type !== "All Types") {
      results = results.filter((p) =>
        p.title.toLowerCase().includes(type.toLowerCase())
      );
    }
    if (location !== "All Locations") {
      results = results.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (keyword) {
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword.toLowerCase()) ||
          p.location.toLowerCase().includes(keyword.toLowerCase()) ||
          p.subdivision?.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    switch (sort) {
      case "price_asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "featured":
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        results.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
    }

    return results;
  }, [initialProperties, listing, type, location, keyword, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (fn: () => void) => {
    fn();
    setCurrentPage(1);
  };

  const hasActiveFilters =
    listing !== "all" ||
    type !== "All Types" ||
    location !== "All Locations" ||
    keyword !== "";

  const clearFilters = () => {
    setListing("all");
    setType("All Types");
    setLocation("All Locations");
    setKeyword("");
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
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
            <h1 className="text-4xl font-extrabold text-luxury-50 tracking-tight">
              Properties
            </h1>
            <p className="text-luxury-400 text-sm mt-2">
              Showing{" "}
              <span className="text-luxury-50 font-semibold">
                {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="text-luxury-50 font-semibold">
                {filtered.length}
              </span>{" "}
              propert{filtered.length === 1 ? "y" : "ies"}
            </p>
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-auto">
            <select
              value={sort}
              onChange={(e) =>
                handleFilterChange(() => setSort(e.target.value as SortValue))
              }
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
            onClick={() => handleFilterChange(() => setListing(t))}
            className={`px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 capitalize ${
              listing === t
                ? "bg-gold-500 text-luxury-900 border border-gold-500"
                : "bg-luxury-800 text-luxury-400 border border-luxury-700 hover:border-gold-500/50 hover:text-gold-500"
            }`}>
            {t === "all" ? "All" : `For ${t === "sale" ? "Sale" : "Rent"}`}
          </button>
        ))}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
            showFilters || hasActiveFilters
              ? "bg-gold-500 border-gold-500 text-luxury-900"
              : "bg-luxury-800 border-luxury-700 text-luxury-400 hover:border-gold-500/50 hover:text-gold-500"
          }`}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
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
                onChange={(e) =>
                  handleFilterChange(() => setKeyword(e.target.value))
                }
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
                  value={location}
                  onChange={(e) =>
                    handleFilterChange(() => setLocation(e.target.value))
                  }
                  className="w-full bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-2.5 text-luxury-50 text-sm outline-none appearance-none transition-colors pr-8">
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
                  value={type}
                  onChange={(e) =>
                    handleFilterChange(() => setType(e.target.value))
                  }
                  className="w-full bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-2.5 text-luxury-50 text-sm outline-none appearance-none transition-colors pr-8">
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
              {hasActiveFilters && (
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
      {paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginated.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-luxury-700 text-luxury-400 hover:border-gold-500/50 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-10 h-10 flex items-center justify-center text-luxury-500 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 ${
                      currentPage === page
                        ? "bg-gold-500 text-luxury-900 border border-gold-500"
                        : "border border-luxury-700 text-luxury-400 hover:border-gold-500/50 hover:text-gold-500"
                    }`}>
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-luxury-700 text-luxury-400 hover:border-gold-500/50 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-luxury-800 border border-luxury-700 flex items-center justify-center mb-6">
            <SlidersHorizontal className="w-6 h-6 text-luxury-500" />
          </div>
          <h3 className="text-luxury-50 text-xl font-bold mb-2">
            No Properties Found
          </h3>
          <p className="text-luxury-400 text-sm mb-6 max-w-sm">
            No properties match your current filters.
          </p>
          <button
            onClick={clearFilters}
            className="bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-6 py-3 rounded-lg tracking-wide transition-colors">
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}