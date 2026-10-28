import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize2, Star, Car } from "lucide-react";
import { Property } from "@/types";
import {
  formatPriceCompact,
  propertySlug,
  subdivisionName,
  unavailableLabel,
} from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  /**
   * First-row cards on a listing grid load their photo eagerly instead of
   * lazily after layout. "lcp" marks the one card (the first) whose photo is
   * the page's LCP element and also gets high fetch priority — giving three
   * photos high priority made them compete for a phone's bandwidth.
   */
  aboveFold?: boolean | "lcp";
}

const sqm = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} sqm`;

const TYPE_LABEL: Record<string, string> = {
  Condominium: "Condo",
  "House & Lot": "House & Lot",
  Townhouse: "Townhouse",
  "Vacant Lot": "Lot",
  Commercial: "Commercial",
};

export default function PropertyCard({ property, aboveFold = false }: PropertyCardProps) {
  const offMarket = unavailableLabel(property);

  // Titles are written for Facebook ("PIA Model – 2BR … | St. Agatha Homes,
  // Malolos Bulacan"); the part after "|" repeats the location line below, so
  // the card shows only the model name. The full title stays in the alt text
  // and on the listing page.
  const title = property.title.split(" | ")[0];
  const development = property.subdivision ? subdivisionName(property.subdivision) : "";
  const place = [development, property.location].filter(Boolean).join(" · ");

  const specs = [
    property.bedrooms > 0 && { icon: Bed, text: `${property.bedrooms} ${property.bedrooms === 1 ? "Bed" : "Beds"}` },
    property.bathrooms > 0 && { icon: Bath, text: `${property.bathrooms} ${property.bathrooms === 1 ? "Bath" : "Baths"}` },
    property.area > 0 && { icon: Maximize2, text: sqm(property.area) },
    (property.lot_area ?? 0) > 0 && { icon: Maximize2, text: `${sqm(property.lot_area!)} lot` },
    (property.garage ?? 0) > 0 && { icon: Car, text: `${property.garage} ${property.garage === 1 ? "car" : "cars"}` },
  ].filter((s): s is { icon: typeof Bed; text: string } => Boolean(s));

  // Only badges that tell the buyer something: almost everything is for sale,
  // so "For Sale" on every photo was just covering the flyer.
  const badge = offMarket ?? (property.type === "rent" ? "For Rent" : null);

  return (
    <Link
      href={`/properties/${propertySlug(property)}`}
      className="group relative flex flex-col bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Photo — kept clear: the price used to sit on top of flyer text. */}
      <div className="relative overflow-hidden aspect-4/3 bg-luxury-700">
        {property.images?.[0] && (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            // Thumbnails: quality 60, and on phones a ~66vw slot so a 3x screen
            // gets a ~2x image (828px, not 1200px) — the extra pixels aren't
            // visible at card size but cost ~half the bytes on mobile data.
            // Full-quality photos are on the listing page.
            quality={60}
            sizes="(max-width: 640px) 66vw, (max-width: 1024px) 50vw, 400px"
            loading={aboveFold ? "eager" : undefined}
            fetchPriority={aboveFold === "lcp" ? "high" : undefined}
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
              offMarket ? "grayscale opacity-60" : ""
            }`}
          />
        )}

        {(badge || property.featured) && (
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {badge && (
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md ${
                  offMarket
                    ? "bg-luxury-50 text-luxury-900"
                    : "bg-luxury-900/90 text-gold-500 border border-gold-500/50"
                }`}>
                {badge}
              </span>
            )}
            {property.featured && !offMarket && (
              <span className="flex items-center gap-1 bg-gold-500 text-luxury-900 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-sm">
                <Star className="w-2.5 h-2.5 fill-luxury-900" />
                Featured
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Price leads: it's what buyers compare first. */}
        <div className="flex items-baseline justify-between gap-3">
          <p
            className={`text-2xl font-black tracking-tight tabular-nums leading-none ${
              offMarket ? "text-luxury-400 line-through decoration-1" : "text-gold-500"
            }`}>
            {formatPriceCompact(property.price, property.type)}
          </p>
          {property.property_type && (
            <span className="text-luxury-400 text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">
              {TYPE_LABEL[property.property_type] ?? property.property_type}
            </span>
          )}
        </div>

        <h3 className="mt-2.5 text-luxury-50 font-semibold text-[15px] leading-snug group-hover:text-gold-400 transition-colors line-clamp-2">
          {title}
        </h3>

        {place && (
          <p className="mt-1.5 flex items-center gap-1.5 text-luxury-400 text-xs min-w-0">
            <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" aria-hidden="true" />
            <span className="truncate">{place}</span>
          </p>
        )}

        {/* mt-auto pins the specs to the card bottom so a row of cards lines up. */}
        {specs.length > 0 && (
          <div className="mt-auto pt-4">
            <ul className="pt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-luxury-700/70">
              {specs.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 text-luxury-300 text-xs whitespace-nowrap">
                  <Icon className="w-3.5 h-3.5 text-gold-500/80" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Link>
  );
}
