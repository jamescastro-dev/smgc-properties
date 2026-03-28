export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: "sale" | "rent";
  status: "available" | "sold" | "rented";
  bedrooms: number;
  bathrooms: number;
  area: number;
  garage?: number;
  location: string;
  subdivision?: string;
  map_url?: string;
  video_url?: string;
  images: string[];
  featured: boolean;
  created_at?: string;
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