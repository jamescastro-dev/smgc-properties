import HeroSection from "@/components/sections/HeroSection";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import AwardsCarousel from "@/components/sections/AwardsCarousel";
import AccreditedDevelopers from "@/components/sections/AccreditedDevelopers";
import ContactSection from "@/components/sections/ContactSection";
import { SITE_CONFIG } from "@/lib/constants";

const BASE_URL = "https://www.smgcproperties.com";

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

export default function Home() {
  return (
    <main className="pt-16 sm:pt-[89px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brokerJsonLd) }}
      />
      <HeroSection />
      <AccreditedDevelopers />
      <FeaturedProperties />
      <WhyChooseUs />
      <AwardsCarousel />
      <ContactSection />
    </main>
  );
}