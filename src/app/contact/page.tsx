import ContactSection from "@/components/sections/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Castro Realty — Broker Shella",
  description:
    "Get in touch with Broker Shella Castro for a free consultation on buying, selling, or renting properties in Bulacan and Metro Manila.",
};

export default function ContactPage() {
  return (
    <main className="pt-[80px]">
      <ContactSection />
    </main>
  );
}