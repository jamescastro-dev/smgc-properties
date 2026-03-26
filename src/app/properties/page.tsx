import { Metadata } from "next";
import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";
import { getAllProperties } from "@/lib/supabase/properties";
import { FEATURED_PROPERTIES } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Properties | Broker Shella — SMGC Properties",
  description:
    "Browse all available properties for sale and rent in Bulacan and Metro Manila.",
};

export default async function PropertiesPage() {
  let properties = await getAllProperties();
  if (properties.length === 0) {
    properties = FEATURED_PROPERTIES;
  }

  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[89px]">
      <Suspense>
        <PropertiesClient initialProperties={properties} />
      </Suspense>
    </main>
  );
}