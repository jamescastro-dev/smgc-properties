import { Metadata } from "next";
import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";
import { getAllProperties } from "@/lib/supabase/properties";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Browse all available properties for sale and rent in Bulacan and Luzon.",
};

export default async function PropertiesPage() {
  const properties = await getAllProperties();

  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[89px]">
      <Suspense>
        <PropertiesClient initialProperties={properties} />
      </Suspense>
    </main>
  );
}