import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/ui/PropertyCard";
import { getFeaturedProperties } from "@/lib/supabase/properties";

export default async function FeaturedProperties() {
  // Hide the section rather than show placeholder listings that aren't for sale.
  const properties = await getFeaturedProperties();
  if (properties.length === 0) return null;

  return (
    <section className="bg-luxury-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
                Hand-picked listings
              </span>
            </div>
            <h2 className="text-4xl font-display font-semibold text-luxury-50 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-luxury-400 text-base mt-3 max-w-lg">
              Carefully selected properties that offer the best value across
              Bulacan and Luzon.
            </p>
          </div>
          <Link
            href="/properties"
            className="hidden sm:flex items-center gap-2 text-gold-500 hover:text-gold-400 text-sm font-semibold tracking-wide transition-colors shrink-0 group">
            View all properties
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Property grid — a swipe row on phones (next card peeks in), so six
            stacked cards don't push the rest of the page 4 screens down. */}
        <ul className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-px-4 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
          {properties.map((property) => (
            <li key={property.id} className="grid shrink-0 w-[85%] sm:w-auto snap-start">
              <PropertyCard property={property} />
            </li>
          ))}
        </ul>

        <Link
          href="/properties"
          className="sm:hidden mt-6 flex items-center justify-center gap-2 border border-gold-500 text-gold-500 text-sm font-bold tracking-wide px-5 py-3 rounded-sm">
          View all properties
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>
    </section>
  );
}