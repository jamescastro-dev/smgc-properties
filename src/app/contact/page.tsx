import ContactSection from "@/components/sections/ContactSection";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Broker Shella Castro for a free consultation on buying, selling, or renting properties in Bulacan and Luzon.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="pt-[80px]">
      <ContactSection headingLevel="h1" />
    </main>
  );
}
