export interface Property {
  id: string;
  title: string;
  /** Stable URL slug, set once at creation (see supabase/migrations). */
  slug?: string;
  /** Slugs this listing used to have — kept so old links can redirect. */
  previous_slugs?: string[];
  description: string;
  price: number;
  type: "sale" | "rent";
  status: "available" | "sold" | "rented";
  bedrooms: number;
  bathrooms: number;
  area: number;
  lot_area?: number;
  garage?: number;
  property_type?: string;
  location: string;
  subdivision?: string;
  map_url?: string;
  video_url?: string;
  images: string[];
  featured: boolean;
  sort_order?: number;
  created_at?: string;
}

/** A development (e.g. St. Agatha Homes) with every listing we carry in it. */
export interface Subdivision {
  name: string;
  slug: string;
  /** Distinct municipalities the development's listings sit in. */
  locations: string[];
  properties: Property[];
  minPrice: number;
  maxPrice: number;
}

/** A town/city with listings from several developments (e.g. Malolos, Bulacan). */
export interface Town {
  /** The listing `location` value, e.g. "Malolos, Bulacan". */
  name: string;
  slug: string;
  properties: Property[];
  /** Developments in town, largest first; `hubSlug` set when it has a hub page. */
  developments: { name: string; hubSlug: string | null; count: number; minPrice: number }[];
  minPrice: number;
  maxPrice: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  avatarUrl?: string;
}

export interface LeadForm {
  name: string;
  phone: string;
  message: string;
  type: "buy" | "sell" | "rent";
  location?: string;
  budget?: string;
}