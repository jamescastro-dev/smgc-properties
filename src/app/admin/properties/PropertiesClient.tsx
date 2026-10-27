"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, Building2, Search, X, ImageOff } from "lucide-react";
import { formatPrice, propertySlug } from "@/lib/utils";
import DeletePropertyButton from "./DeletePropertyButton";
import Pagination from "@/components/ui/Pagination";
import Segmented from "@/components/ui/Segmented";
import { Property } from "@/types";

const ITEMS_PER_PAGE = 10;

/** Listing cover photo — the quickest way to tell similar titles apart. */
function Thumb({ property, className }: { property: Property; className: string }) {
  return (
    <div className={`relative shrink-0 rounded-xl overflow-hidden bg-luxury-700 border border-luxury-700 ${className}`}>
      {property.images?.[0] ? (
        <Image src={property.images[0]} alt="" fill sizes="96px" className="object-cover" />
      ) : (
        <ImageOff className="absolute inset-0 m-auto w-5 h-5 text-luxury-500" />
      )}
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
] as const;

const TYPE_OPTIONS = [
  { value: "all", label: "Any" },
  { value: "sale", label: "Sale" },
  { value: "rent", label: "Rent" },
] as const;

export default function PropertiesClient({
  properties,
}: {
  properties: Property[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);

  const statusCounts = useMemo(
    () => ({
      all: properties.length,
      available: properties.filter((p) => p.status === "available").length,
      sold: properties.filter((p) => p.status === "sold").length,
      rented: properties.filter((p) => p.status === "rented").length,
    }),
    [properties],
  );

  const filtered = useMemo(() => {
    let result = properties;
    if (status !== "all") result = result.filter((p) => p.status === status);
    if (type !== "all") result = result.filter((p) => p.type === type);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.subdivision?.toLowerCase().includes(q) ?? false),
      );
    }
    return result;
  }, [properties, search, status, type]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const resetPage = () => setPage(1);
  const isFiltered = !!(search || status !== "all" || type !== "all");

  const statusBadge = (s: string) =>
    s === "available"
      ? "bg-green-400/10 text-green-400 border border-green-400/20"
      : s === "sold"
      ? "bg-blue-400/10 text-blue-400 border border-blue-400/20"
      : "bg-purple-400/10 text-purple-400 border border-purple-400/20";

  const typeBadge = (t: string) =>
    t === "sale"
      ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
      : "bg-blue-400/10 text-blue-400 border border-blue-400/20";

  return (
    <div className="flex flex-col gap-5">
      {/* Filter bar — search, then one segmented control per filter. Each
          control is a single non-wrapping row at every width. */}
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3">
          <Segmented
            label="Status"
            value={status}
            onChange={(v) => { setStatus(v); resetPage(); }}
            options={STATUS_OPTIONS.map((s) => ({
              ...s,
              count: statusCounts[s.value as keyof typeof statusCounts],
            }))}
            className="sm:flex-1 lg:flex-none"
          />
          <Segmented
            label="Listing type"
            value={type}
            onChange={(v) => { setType(v); resetPage(); }}
            options={TYPE_OPTIONS}
            className="sm:w-52"
          />
        </div>

        {/* Search */}
        <div className="relative order-first lg:order-last lg:ml-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search properties…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="w-full lg:w-60 bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl pl-10 pr-10 h-11 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); resetPage(); }}
              aria-label="Clear search"
              className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-luxury-500 hover:text-luxury-300 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-luxury-700 border border-luxury-600 flex items-center justify-center mb-6">
              <Building2 className="w-7 h-7 text-luxury-500" />
            </div>
            <h3 className="text-luxury-50 text-lg font-bold mb-2">
              {isFiltered ? "No matching properties" : "No properties yet"}
            </h3>
            <p className="text-luxury-400 text-sm mb-6 max-w-sm">
              {isFiltered
                ? "Try adjusting your search or filters."
                : "Add your first property listing to get started."}
            </p>
            {!isFiltered && (
              <Link
                href="/admin/properties/new"
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-6 py-3 rounded-xl transition-colors">
                <Plus className="w-4 h-4" />
                Add First Property
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* ── Mobile / tablet card list ──
                Tapping the card opens the editor (the common action); view and
                delete are separate 40px buttons so they can't be hit by accident. */}
            <div className="lg:hidden divide-y divide-luxury-700/50">
              {paginated.map((property) => (
                <div key={property.id} className="flex items-start gap-2 p-3 sm:p-4">
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="flex items-start gap-3 min-w-0 flex-1 group">
                    <Thumb property={property} className="w-20 h-20 sm:w-24 sm:h-24" />
                    <div className="min-w-0 flex-1">
                      <p className="text-luxury-50 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-gold-400 transition-colors">
                        {property.title}
                      </p>
                      <p className="text-luxury-500 text-xs mt-1 truncate">
                        {property.location}
                        {property.subdivision && (
                          <span className="text-luxury-600"> · {property.subdivision}</span>
                        )}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-gold-500 text-sm font-bold tabular-nums mr-1">
                          {formatPrice(property.price, property.type)}
                        </span>
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${statusBadge(property.status)}`}>
                          {property.status}
                        </span>
                        {property.type === "rent" && (
                          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${typeBadge(property.type)}`}>
                            Rent
                          </span>
                        )}
                        {property.featured && (
                          <span className="text-gold-500 text-[11px] font-bold">★ Featured</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col shrink-0 -mr-1 -mt-1">
                    <Link
                      href={`/properties/${propertySlug(property)}`}
                      target="_blank"
                      title="View on site"
                      aria-label="View on site"
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-luxury-400 hover:text-gold-500 hover:bg-luxury-700/60 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <DeletePropertyButton id={property.id} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop table ── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-luxury-700 bg-luxury-900/40">
                    {["Property", "Price", "Type", "Status", "Featured", "Date", ""].map((h) => (
                      <th key={h} className="text-left text-luxury-400 text-[11px] font-semibold tracking-widest uppercase px-6 py-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-700/60">
                  {paginated.map((property) => (
                    <tr key={property.id} className="hover:bg-luxury-700/20 transition-colors group">
                      <td className="px-6 py-3">
                        <Link href={`/admin/properties/${property.id}`} className="flex items-center gap-3">
                          <Thumb property={property} className="w-12 h-12" />
                          <div className="min-w-0">
                            <p className="text-luxury-50 text-sm font-semibold max-w-64 truncate group-hover:text-gold-400 transition-colors">
                              {property.title}
                            </p>
                            <p className="text-luxury-500 text-xs mt-0.5 truncate max-w-64">
                              {property.location}
                              {property.subdivision && (
                                <span className="text-luxury-600"> · {property.subdivision}</span>
                              )}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gold-500 text-sm font-bold tabular-nums whitespace-nowrap">
                          {formatPrice(property.price, property.type)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${typeBadge(property.type)}`}>
                          {property.type === "sale" ? "Sale" : "Rent"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${statusBadge(property.status)}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {property.featured ? (
                          <span className="text-gold-500 text-xs font-bold">★ Yes</span>
                        ) : (
                          <span className="text-luxury-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-luxury-500 text-xs whitespace-nowrap">
                          {new Date(property.created_at ?? "").toLocaleDateString("en-PH")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Link href={`/properties/${propertySlug(property)}`} target="_blank" className="w-10 h-10 rounded-lg flex items-center justify-center text-luxury-400 hover:text-gold-500 hover:bg-luxury-700/60 transition-colors" title="View on site" aria-label="View on site">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/properties/${property.id}`} className="w-10 h-10 rounded-lg flex items-center justify-center text-luxury-400 hover:text-gold-500 hover:bg-luxury-700/60 transition-colors" title="Edit" aria-label="Edit listing">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <DeletePropertyButton id={property.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
