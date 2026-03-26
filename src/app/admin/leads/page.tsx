import { createClient } from "@/lib/supabase/server";
import LeadsClient from "./LeadsClient";

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  // Manually resolve property titles since FK may not be defined
  const propertyIds = [
    ...new Set(leads?.map((l) => l.property_id).filter(Boolean)),
  ];

  let propertiesMap: Record<string, { title: string }> = {};
  if (propertyIds.length > 0) {
    const { data: props } = await supabase
      .from("properties")
      .select("id, title")
      .in("id", propertyIds);
    props?.forEach((p) => {
      propertiesMap[p.id] = { title: p.title };
    });
  }

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
