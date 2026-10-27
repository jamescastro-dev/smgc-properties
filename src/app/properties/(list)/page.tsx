import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertiesClient from "./PropertiesClient";
import PropertyCard from "@/components/ui/PropertyCard";
import { getAllProperties } from "@/lib/supabase/properties";
import {
  ITEMS_PER_PAGE,
  PropertyQuery,
  filterProperties,
  hasFilters,
  parsePropertyQuery,
  propertiesHref,
} from "@/lib/propertyQuery";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = parsePropertyQuery(await searchParams);
  // Filtered/sorted views are the same listings reshuffled — point them at the
  // main list. Plain pagination is unique content, so each page is its own
  // canonical (Google's guidance; canonicalising page 2 to page 1 hides it).
  const paginatedOnly = !hasFilters(q) && q.page > 1;
  return {
    title: paginatedOnly ? `Properties — Page ${q.page}` : "Properties",
    description:
      "Browse all available properties for sale and rent in Bulacan and Luzon.",
    alternates: { canonical: paginatedOnly ? `/properties?page=${q.page}` : "/properties" },
  };
}

export default async function PropertiesPage({ searchParams }: Props) {
  const q = parsePropertyQuery(await searchParams);
  const filtered = filterProperties(await getAllProperties(), q);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  if (q.page > totalPages) notFound();

  const start = (q.page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[89px]">
      <PropertiesClient
        query={q}
        total={filtered.length}
        from={Math.min(start + 1, filtered.length)}
        to={start + paginated.length}>
        {paginated.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginated.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {totalPages > 1 && <Pagination query={q} totalPages={totalPages} />}
          </>
        )}
      </PropertiesClient>
    </main>
  );
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

// Real <a href> links — the old client-side buttons left pages 2+ invisible to
// crawlers, so only the first 6 listings were discoverable from this page.
function Pagination({ query, totalPages }: { query: PropertyQuery; totalPages: number }) {
  const hrefFor = (page: number) => propertiesHref({ ...query, page });
  const arrow =
    "w-10 h-10 rounded-lg flex items-center justify-center border border-luxury-700 text-luxury-400 transition-all";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      {query.page > 1 ? (
        <Link
          href={hrefFor(query.page - 1)}
          aria-label="Previous page"
          className={`${arrow} hover:border-gold-500/50 hover:text-gold-500`}>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span aria-hidden className={`${arrow} opacity-30`}>
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {pageNumbers(query.page, totalPages).map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-10 h-10 flex items-center justify-center text-luxury-500 text-sm">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={hrefFor(page)}
            aria-current={query.page === page ? "page" : undefined}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${
              query.page === page
                ? "bg-gold-500 text-luxury-900 border border-gold-500"
                : "border border-luxury-700 text-luxury-400 hover:border-gold-500/50 hover:text-gold-500"
            }`}>
            {page}
          </Link>
        )
      )}

      {query.page < totalPages ? (
        <Link
          href={hrefFor(query.page + 1)}
          aria-label="Next page"
          className={`${arrow} hover:border-gold-500/50 hover:text-gold-500`}>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span aria-hidden className={`${arrow} opacity-30`}>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
