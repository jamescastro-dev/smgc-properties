import ContactSection from "@/components/sections/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | SMGC Properties — Broker Shella",
  description:
    "Get in touch with Broker Shella Castro for a free consultation on buying, selling, or renting properties in Bulacan and Luzon.",
};

export default function ContactPage() {
  return (
    <main className="pt-[80px]">
      <ContactSection />
    </main>
  );
}