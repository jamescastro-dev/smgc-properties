import HeroSection from "@/components/sections/HeroSection";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import AwardsCarousel from "@/components/sections/AwardsCarousel";
import AccreditedDevelopers from "@/components/sections/AccreditedDevelopers";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="pt-16 sm:pt-[89px]">
      <HeroSection />
      <AccreditedDevelopers />
      <FeaturedProperties />
      <WhyChooseUs />
      <AwardsCarousel />
      <ContactSection />
    </main>
  );
}