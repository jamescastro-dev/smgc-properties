import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import PropertiesClient from "./PropertiesClient";

export default async function AdminPropertiesPage() {
  const supabase = await createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-luxury-50">Properties</h1>
          <p className="text-luxury-400 text-sm mt-1">
            {properties?.length ?? 0} total listings
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      <PropertiesClient properties={properties ?? []} />
    </div>
  );
}
