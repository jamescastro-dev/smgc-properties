import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PropertyForm from "../PropertyForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (!property) notFound();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-extrabold text-luxury-50">
          Edit Property
        </h1>
        <p className="text-luxury-400 text-sm mt-1">
          Update the details for this listing.
        </p>
      </div>
      <PropertyForm property={property} />
    </div>
  );
}