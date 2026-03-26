import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/ui/PropertyCard";
import { getFeaturedProperties } from "@/lib/supabase/properties";
import { FEATURED_PROPERTIES } from "@/lib/data";

export default async function FeaturedProperties() {
  // Try Supabase first, fall back to dummy data if empty
  let properties = await getFeaturedProperties();
  if (properties.length === 0) {
    properties = FEATURED_PROPERTIES.slice(0, 6);
  }

  return (
    <section className="bg-luxury-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs tracking-widests uppercase font-semibold">
                Hand-picked listings
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-luxury-50 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-luxury-400 text-base mt-3 max-w-lg">
              Carefully selected properties that offer the best value across
              Bulacan and Metro Manila.
            </p>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-2 text-gold-500 hover:text-gold-400 text-sm font-semibold tracking-wide transition-colors shrink-0 group">
            View all properties
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Property grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

      </div>
    </section>
  );
}