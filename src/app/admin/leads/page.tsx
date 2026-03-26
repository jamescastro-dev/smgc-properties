import { createClient } from "@/lib/supabase/server";
import LeadsClient from "./LeadsClient";

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*, properties(title)")
    .order("created_at", { ascending: false });

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

      <LeadsClient leads={leads ?? []} />
    </div>
  );
}
