"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Home,
  ChevronDown,
  SlidersHorizontal,
  Tag,
} from "lucide-react";

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

const LISTINGS = ["Buy or Rent", "For Sale", "For Rent"] as const;

interface DropdownProps {
  icon?: React.ReactNode;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  width?: string;
}

function Dropdown({
  icon,
  value,
  options,
  onChange,
  width = "w-[180px]",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${width} shrink-0`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={`w-full flex items-center gap-2 bg-luxury-900 border px-4 py-3 rounded-sm text-sm transition-colors text-left ${
          open
            ? "border-gold-500"
            : "border-luxury-700 hover:border-gold-500/50"
        }`}>
        {icon && <span className="text-gold-500 shrink-0">{icon}</span>}
        <span className="flex-1 text-luxury-50 truncate">{value}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gold-500 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-luxury-800 border border-luxury-700 rounded-sm shadow-2xl overflow-hidden"
          style={{ zIndex: 9999 }}>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === opt
                  ? "bg-gold-500/10 text-gold-500 font-semibold"
                  : "text-luxury-50 hover:bg-luxury-700 hover:text-gold-500"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchBar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState(PROPERTY_TYPES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [listing, setListing] = useState(LISTINGS[0]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (type !== "All Types") params.set("type", type);
    if (location !== "All Locations") params.set("location", location);
    if (listing !== "Buy or Rent") params.set("listing", listing);
    router.push(`/properties?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full bg-luxury-800 border-b border-gold-500/20 shadow-xl relative z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main row */}
        <div className="flex items-center gap-2">
          {/* Keyword input */}
          <div className="flex items-center gap-2 flex-1 bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 rounded-sm px-4 py-3 transition-colors min-w-0">
            <Search className="w-4 h-4 text-gold-500 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search properties..."
              className="flex-1 bg-transparent text-luxury-50 placeholder-luxury-500 text-sm outline-none min-w-0"
            />
          </div>

          {/* Filter toggle — mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`lg:hidden flex items-center gap-2 border px-3 py-3 rounded-sm text-sm font-medium transition-all shrink-0 ${
              showFilters
                ? "bg-gold-500 border-gold-500 text-luxury-900"
                : "bg-luxury-900 border-luxury-700 text-luxury-400 hover:border-gold-500/50"
            }`}>
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Desktop dropdowns */}
          <div className="hidden lg:flex items-center gap-2">
            <Dropdown
              icon={<MapPin className="w-4 h-4" />}
              value={location}
              options={LOCATIONS}
              onChange={(v) => setLocation(v as typeof location)}
              width="w-[185px]"
            />
            <Dropdown
              icon={<Home className="w-4 h-4" />}
              value={type}
              options={PROPERTY_TYPES}
              onChange={(v) => setType(v as typeof type)}
              width="w-[155px]"
            />
            <Dropdown
              icon={<Tag className="w-4 h-4" />}
              value={listing}
              options={LISTINGS}
              onChange={(v) => setListing(v as typeof listing)}
              width="w-[135px]"
            />
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-6 py-3 rounded-sm tracking-wide transition-colors shrink-0">
            Search
          </button>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="lg:hidden mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Dropdown
              icon={<MapPin className="w-4 h-4" />}
              value={location}
              options={LOCATIONS}
              onChange={(v) => setLocation(v as typeof location)}
              width="w-full"
            />
            <Dropdown
              icon={<Home className="w-4 h-4" />}
              value={type}
              options={PROPERTY_TYPES}
              onChange={(v) => setType(v as typeof type)}
              width="w-full"
            />
            <Dropdown
              icon={<Tag className="w-4 h-4" />}
              value={listing}
              options={LISTINGS}
              onChange={(v) => setListing(v as typeof listing)}
              width="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
