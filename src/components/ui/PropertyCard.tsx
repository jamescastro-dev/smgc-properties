import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize2, Star, Car } from "lucide-react";
import { Property } from "@/types";
import { formatPrice, slugify } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${slugify(property.title)}`}
      className="group relative flex flex-col bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Image */}
      <div className="relative overflow-hidden aspect-4/3 bg-luxury-700">
        {property.images?.[0] && (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md ${
              property.type === "sale"
                ? "bg-gold-500 text-luxury-900"
                : "bg-luxury-900 text-gold-500 border border-gold-500/50"
            }`}>
            For {property.type === "sale" ? "Sale" : "Rent"}
          </span>
          {property.featured && (
            <span className="flex items-center gap-1 bg-luxury-900/90 backdrop-blur-sm text-gold-500 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border border-gold-500/30">
              <Star className="w-2.5 h-2.5 fill-gold-500" />
              Featured
            </span>
          )}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <p className="text-luxury-50 font-black text-lg leading-none bg-luxury-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            {formatPrice(property.price, property.type)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-luxury-50 font-bold text-base leading-snug mb-2 group-hover:text-gold-500 transition-colors line-clamp-2">
          {property.title}
        </h3>

        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-1.5 text-luxury-400 text-xs">
            <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          {property.subdivision && (
            <p className="text-luxury-500 text-xs pl-5">
              {property.subdivision}
            </p>
          )}
        </div>

        {(property.bedrooms > 0 || property.bathrooms > 0 || property.area > 0 || (property.garage ?? 0) > 0) && (
          <div className="border-t border-luxury-700 mt-auto pt-4">
            <div className="flex items-center gap-4">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5 text-luxury-300 text-xs">
                  <Bed className="w-3.5 h-3.5 text-gold-500" />
                  <span>{property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5 text-luxury-300 text-xs">
                  <Bath className="w-3.5 h-3.5 text-gold-500" />
                  <span>{property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}</span>
                </div>
              )}
              {property.area > 0 && (
                <div className="flex items-center gap-1.5 text-luxury-300 text-xs">
                  <Maximize2 className="w-3.5 h-3.5 text-gold-500" />
                  <span>{Number.isInteger(property.area) ? property.area : property.area.toFixed(2)} sqm</span>
                </div>
              )}
              {(property.garage ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 text-luxury-300 text-xs">
                  <Car className="w-3.5 h-3.5 text-gold-500" />
                  <span>{property.garage}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
