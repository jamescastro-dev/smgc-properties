import HeroSection from "@/components/sections/HeroSection";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import AwardsCarousel from "@/components/sections/AwardsCarousel";
import AccreditedDevelopers from "@/components/sections/AccreditedDevelopers";
import ContactSection from "@/components/sections/ContactSection";
import { SITE_CONFIG } from "@/lib/constants";
import { getSubdivisions } from "@/lib/supabase/properties";
import type { Metadata } from "next";

const BASE_URL = "https://www.smgcproperties.com";

// Title, description and social cards come from the root layout — they were
// written for the home page. Only the canonical lives here, since setting it in
// the layout would make every page without its own claim to be the home page.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const brokerJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${BASE_URL}/#broker`,
  name: "Broker Shella — SMGC Properties",
  image: `${BASE_URL}/shella.jpg`,
  url: BASE_URL,
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  priceRange: "₱₱₱",
  description: SITE_CONFIG.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Malolos",
    addressRegion: "Bulacan",
    addressCountry: "PH",
  },
  areaServed: ["Bulacan", "Metro Manila", "Luzon"],
  sameAs: [
    SITE_CONFIG.social.facebook,
    SITE_CONFIG.social.instagram,
    SITE_CONFIG.facebookPageId,
  ],
};

export default async function Home() {
  const hubs = (await getSubdivisions()).map(({ name, slug }) => ({ name, slug }));

  return (
    <main className="pt-16 sm:pt-[93px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brokerJsonLd) }}
      />
      <HeroSection />
      <FeaturedProperties />
      <AccreditedDevelopers hubs={hubs} />
      <WhyChooseUs />
      <AwardsCarousel />
      <ContactSection />
    </main>
  );
}