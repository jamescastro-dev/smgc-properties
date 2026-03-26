import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Clock,
  Home,
  ArrowRight,
  CheckCircle,
  Phone,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: properties }, { data: leads }] = await Promise.all([
    supabase.from("properties").select("id, status"),
    supabase
      .from("leads")
      .select("id, name, phone, type, status, budget, location, created_at")
      .order("created_at", { ascending: false }),
  ]);

  // Property counts
  const allProperties = properties ?? [];
  const totalProperties = allProperties.length;
  const available = allProperties.filter((p) => p.status === "available").length;
  const sold = allProperties.filter((p) => p.status === "sold").length;
  const rented = allProperties.filter((p) => p.status === "rented").length;

  // Lead counts
  const allLeads = leads ?? [];
  const totalLeads = allLeads.length;
  const newLeads = allLeads.filter((l) => l.status === "new");
  const contactedCount = allLeads.filter((l) => l.status === "contacted").length;
  const closedCount = allLeads.filter((l) => l.status === "closed").length;
  const newCount = newLeads.length;

  const conversionRate =
    totalLeads > 0 ? Math.round((closedCount / totalLeads) * 100) : 0;

  const followUpLeads = newLeads.slice(0, 5);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-gold-500/80 text-xs font-semibold tracking-widest uppercase mb-1">
            {dateStr}
          </p>
          <h1 className="text-2xl font-extrabold text-luxury-50 leading-tight">
            {greeting}, Shella!
          </h1>
          <p className="text-luxury-400 text-sm mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Leads */}
        <Link
          href="/admin/leads"
          className="group relative bg-luxury-800 border border-luxury-700 hover:border-purple-400/40 rounded-2xl p-5 transition-all hover:-translate-y-0.5 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-purple-400/60 rounded-t-2xl" />
          <div className="w-9 h-9 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center mb-4">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-luxury-50 tabular-nums leading-none mb-1">
            {totalLeads}
          </p>
          <p className="text-luxury-400 text-sm">Total Leads</p>
        </Link>

        {/* Needs Follow-up */}
        <Link
          href="/admin/leads"
          className={`group relative rounded-2xl p-5 transition-all hover:-translate-y-0.5 overflow-hidden ${
            newCount > 0
              ? "bg-amber-500/8 border border-amber-500/30 hover:border-amber-500/50"
              : "bg-luxury-800 border border-luxury-700 hover:border-gold-500/30"
          }`}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl ${
              newCount > 0 ? "bg-amber-400/70" : "bg-luxury-600/40"
            }`}
          />
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${
              newCount > 0
                ? "bg-amber-500/15 border border-amber-500/25"
                : "bg-luxury-700 border border-luxury-600"
            }`}
          >
            <Clock
              className={`w-4 h-4 ${newCount > 0 ? "text-amber-400" : "text-luxury-500"}`}
            />
          </div>
          <div className="flex items-end gap-2 mb-1">
            <p
              className={`text-3xl font-black tabular-nums leading-none ${
                newCount > 0 ? "text-amber-400" : "text-luxury-50"
              }`}
            >
              {newCount}
            </p>
            {newCount > 0 && (
              <span className="text-amber-500/70 text-[10px] font-bold uppercase mb-0.5">
                urgent
              </span>
            )}
          </div>
          <p className="text-luxury-400 text-sm">Follow-up</p>
        </Link>

        {/* Conversion Rate */}
        <div className="relative bg-luxury-800 border border-luxury-700 rounded-2xl p-5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-500/60 rounded-t-2xl" />
          <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4">
            <TrendingUp className="w-4 h-4 text-gold-500" />
          </div>
          <p className="text-3xl font-black text-luxury-50 tabular-nums leading-none mb-1">
            {conversionRate}%
          </p>
          <p className="text-luxury-400 text-sm">Conversion</p>
          <p className="text-luxury-600 text-xs mt-0.5">
            {closedCount} of {totalLeads} closed
          </p>
        </div>

        {/* Available */}
        <Link
          href="/admin/properties"
          className="group relative bg-luxury-800 border border-luxury-700 hover:border-green-400/40 rounded-2xl p-5 transition-all hover:-translate-y-0.5 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-400/60 rounded-t-2xl" />
          <div className="w-9 h-9 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center mb-4">
            <Home className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-3xl font-black text-luxury-50 tabular-nums leading-none mb-1">
            {available}
          </p>
          <p className="text-luxury-400 text-sm">Available</p>
          <p className="text-luxury-600 text-xs mt-0.5">{totalProperties} total</p>
        </Link>
      </div>

      {/* ── Pipeline + Inventory ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Lead Pipeline */}
        <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-luxury-50 font-bold text-sm">Lead Pipeline</h2>
              <p className="text-luxury-500 text-xs mt-0.5">{totalLeads} total leads</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-gold-500 text-xs font-semibold hover:text-gold-400 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none" stroke="currentColor" strokeWidth="3"
                  className="text-luxury-700"
                />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none" stroke="currentColor" strokeWidth="3"
                  strokeDasharray={`${conversionRate} ${100 - conversionRate}`}
                  strokeLinecap="round"
                  className="text-gold-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-black text-luxury-50 leading-none">
                  {conversionRate}%
                </p>
                <p className="text-luxury-500 text-[9px] mt-0.5">closed</p>
              </div>
            </div>

            {/* Stage bars */}
            <div className="flex-1 flex flex-col gap-3.5">
              {[
                { label: "New", count: newCount, bar: "bg-amber-400", color: "text-amber-400" },
                { label: "Contacted", count: contactedCount, bar: "bg-blue-400", color: "text-blue-400" },
                { label: "Closed", count: closedCount, bar: "bg-gold-500", color: "text-gold-500" },
              ].map((s) => {
                const pct = totalLeads > 0 ? Math.round((s.count / totalLeads) * 100) : 0;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-luxury-400 text-xs">{s.label}</span>
                      <span className={`text-xs font-bold tabular-nums ${s.color}`}>
                        {s.count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-luxury-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Property Inventory */}
        <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-luxury-50 font-bold text-sm">Inventory</h2>
              <p className="text-luxury-500 text-xs mt-0.5">{totalProperties} total listings</p>
            </div>
            <Link
              href="/admin/properties"
              className="text-gold-500 text-xs font-semibold hover:text-gold-400 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            {[
              { label: "Available", count: available, bar: "bg-gold-500", color: "text-gold-500" },
              { label: "Sold", count: sold, bar: "bg-blue-400", color: "text-blue-400" },
              { label: "Rented", count: rented, bar: "bg-purple-400", color: "text-purple-400" },
            ].map((item) => {
              const pct = totalProperties > 0 ? Math.round((item.count / totalProperties) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-luxury-300 text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-luxury-600 text-xs tabular-nums">{pct}%</span>
                      <span className={`text-sm font-bold tabular-nums w-6 text-right ${item.color}`}>
                        {item.count}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-luxury-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.bar} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-4 border-t border-luxury-700 flex items-center justify-between">
              <span className="text-luxury-500 text-xs">Total listings</span>
              <span className="text-luxury-50 text-sm font-bold tabular-nums">
                {totalProperties}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Needs Follow-up ── */}
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl">
        <div className="px-6 py-4 border-b border-luxury-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-luxury-50 font-bold text-sm">Needs Follow-up</h2>
            {newCount > 0 && (
              <span className="bg-amber-500/15 text-amber-400 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-amber-500/25">
                {newCount} new
              </span>
            )}
          </div>
          <Link
            href="/admin/leads"
            className="text-gold-500 text-xs font-semibold hover:text-gold-400 transition-colors flex items-center gap-1"
          >
            All leads <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {followUpLeads.length === 0 ? (
          <div className="px-6 py-14 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-luxury-50 text-sm font-semibold">All caught up!</p>
            <p className="text-luxury-500 text-xs mt-1">
              No uncontacted leads right now.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-luxury-700/60 bg-luxury-900/30">
                  {["Client", "Phone", "Type", "Budget", "Received"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-luxury-500 text-[10px] font-bold tracking-widest uppercase px-6 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-700/40">
                {followUpLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-luxury-700/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-luxury-50 text-sm font-semibold">
                        {lead.name}
                      </p>
                      {lead.location && (
                        <p className="text-luxury-500 text-xs mt-0.5">
                          {lead.location}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1.5 text-luxury-300 text-sm hover:text-gold-500 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-gold-500/70 shrink-0" />
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                          lead.type === "buy"
                            ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
                            : lead.type === "sell"
                              ? "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                              : "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                        }`}
                      >
                        {lead.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-luxury-300 text-sm">
                        {lead.budget || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-luxury-500 text-xs whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString("en-PH")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
