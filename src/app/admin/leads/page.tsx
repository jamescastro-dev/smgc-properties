import { createClient } from "@/lib/supabase/server";
import LeadsClient from "./LeadsClient";

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  // Property titles are resolved by hand since the FK may not be defined.
  // There are only a few dozen listings, so fetch them alongside the leads
  // rather than waiting for the leads to know which ids to ask for.
  const [{ data: leads, error }, { data: props }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("properties").select("id, title, slug"),
  ]);

  if (error) console.error("[admin/leads] query failed:", error.message);

  const propertiesMap: Record<string, { title: string; slug: string | null }> = {};
  props?.forEach((p) => {
    propertiesMap[p.id] = { title: p.title, slug: p.slug };
  });

  const leadsWithProperties = leads?.map((l) => ({
    ...l,
    properties: l.property_id ? (propertiesMap[l.property_id] ?? null) : null,
  }));

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-luxury-50">Leads</h1>
          <p className="text-luxury-400 text-sm mt-1">
            {leads?.length ?? 0} total inquiries
          </p>
        </div>
      </div>

      <LeadsClient leads={leadsWithProperties ?? []} />
    </div>
  );
}
