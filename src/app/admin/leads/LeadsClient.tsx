"use client";

import { useState, useMemo, useCallback } from "react";
import { Users, Phone, Search, X } from "lucide-react";
import UpdateLeadStatus from "./UpdateLeadStatus";
import ContactButtons from "./ContactButtons";
import LeadDrawer from "./LeadDrawer";
import Pagination from "@/components/ui/Pagination";
import Segmented from "@/components/ui/Segmented";
import { describeLeadSource } from "@/lib/leadSource";
import {
  type Lead,
  type LeadStatus,
  inquiryBadge,
  leadMessage,
  leadPropertyTitle,
} from "./lead";

const ITEMS_PER_PAGE = 15;
const STATUSES = ["all", "new", "contacted", "closed"] as const;
type StatusFilter = (typeof STATUSES)[number];

// Clicks on a row's own controls (status, call/text, phone link) shouldn't
// also open the drawer.
const stop = (e: React.SyntheticEvent) => e.stopPropagation();

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // openId drives the drawer; shownId keeps its content while it slides out.
  // The lead is looked up from props so a status change shows after refresh.
  const [openId, setOpenId] = useState<string | null>(null);
  const [shownId, setShownId] = useState<string | null>(null);
  const openLead = (id: string) => {
    setOpenId(id);
    setShownId(id);
  };
  const closeLead = useCallback(() => setOpenId(null), []);
  const shownLead = leads.find((l) => l.id === shownId) ?? null;

  const counts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      closed: leads.filter((l) => l.status === "closed").length,
    }),
    [leads],
  );

  const filtered = useMemo(() => {
    let result = leads;
    if (filter !== "all") result = result.filter((l) => l.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.location?.toLowerCase().includes(q) ?? false),
      );
    }
    return result;
  }, [leads, filter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const resetPage = () => setPage(1);

  return (
    <div className="flex flex-col gap-5">
      {/* Filter bar — same layout as the listings page: search, then a
          segmented status control that never wraps. */}
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <Segmented
          label="Lead status"
          value={filter}
          onChange={(v) => { setFilter(v as StatusFilter); resetPage(); }}
          options={STATUSES.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
            count: counts[s],
          }))}
          className="lg:min-w-md"
        />

        <div className="relative order-first lg:order-last lg:ml-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, phone…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="w-full lg:w-64 bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl pl-10 pr-10 h-11 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); resetPage(); }}
              aria-label="Clear search"
              className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-luxury-500 hover:text-luxury-300 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-luxury-700 border border-luxury-600 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-luxury-500" />
            </div>
            <h3 className="text-luxury-50 text-lg font-bold mb-2">
              {search || filter !== "all" ? "No matching leads" : "No leads yet"}
            </h3>
            <p className="text-luxury-400 text-sm max-w-sm">
              {search || filter !== "all"
                ? "Try adjusting your search or filter."
                : "Leads from your contact form will appear here."}
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile / tablet card list — tap a card for the full lead ── */}
            <div className="lg:hidden divide-y divide-luxury-700/50">
              {paginated.map((lead) => {
                const title = leadPropertyTitle(lead);
                const msg = leadMessage(lead);
                return (
                  <div
                    key={lead.id}
                    onClick={() => openLead(lead.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      openId === lead.id ? "bg-luxury-700/30" : "hover:bg-luxury-700/20"
                    }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          onClick={() => openLead(lead.id)}
                          className="block max-w-full text-left text-luxury-50 text-base font-semibold truncate">
                          {lead.name}
                        </button>
                        <p className="text-luxury-400 text-sm tabular-nums mt-0.5">{lead.phone}</p>
                      </div>
                      <div onClick={stop}>
                        <UpdateLeadStatus
                          key={`${lead.id}-${lead.status}`}
                          id={lead.id}
                          currentStatus={lead.status as LeadStatus}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${inquiryBadge(lead.type)}`}>
                        {lead.type}
                      </span>
                      {lead.location && (
                        <span className="text-luxury-400 text-xs">{lead.location}</span>
                      )}
                      {lead.budget && (
                        <span className="text-luxury-400 text-xs">{lead.budget}</span>
                      )}
                    </div>

                    {title && <p className="text-gold-500 text-xs mt-2">{title}</p>}

                    {msg && (
                      <p className="text-luxury-500 text-xs mt-1.5 line-clamp-2">{msg}</p>
                    )}

                    <p className="text-luxury-600 text-xs mt-2 truncate">
                      {new Date(lead.created_at).toLocaleDateString("en-PH")}
                      {describeLeadSource(lead.source) && ` · via ${describeLeadSource(lead.source)}`}
                    </p>

                    {/* Reaching the lead is the whole point of this screen on a
                        phone — make it a thumb-sized button, not 12px text. */}
                    <div onClick={stop}>
                      <ContactButtons phone={lead.phone} className="mt-3" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop table — click a row for the full lead ── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-luxury-700 bg-luxury-900/40">
                    {/* Nine columns didn't fit beside the sidebar — related
                        fields are paired so the table fits a laptop screen. */}
                    {["Client", "Looking for", "Property", "Message", "Received", "Status"].map((h) => (
                      <th key={h} className="text-left text-luxury-400 text-[11px] font-semibold tracking-widest uppercase px-5 py-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-700/60">
                  {paginated.map((lead) => {
                    const title = leadPropertyTitle(lead);
                    const msg = leadMessage(lead);
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => openLead(lead.id)}
                        className={`cursor-pointer transition-colors group ${
                          openId === lead.id ? "bg-luxury-700/30" : "hover:bg-luxury-700/20"
                        }`}>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => openLead(lead.id)}
                            className="block max-w-40 text-left text-luxury-50 text-sm font-semibold truncate group-hover:text-gold-500 transition-colors">
                            {lead.name}
                          </button>
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={stop}
                            className="inline-flex items-center gap-1.5 text-luxury-300 text-xs hover:text-gold-500 transition-colors whitespace-nowrap mt-1">
                            <Phone className="w-3 h-3 text-gold-500" />
                            {lead.phone}
                          </a>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${inquiryBadge(lead.type)}`}>
                            {lead.type}
                          </span>
                          <p className="text-luxury-400 text-xs mt-1.5 max-w-40 truncate">
                            {[lead.location, lead.budget].filter(Boolean).join(" · ") || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4 max-w-36">
                          {title ? (
                            <p className="text-gold-500 text-xs truncate" title={title}>{title}</p>
                          ) : (
                            <span className="text-luxury-600 text-xs">General</span>
                          )}
                        </td>
                        <td className="px-5 py-4 max-w-44">
                          {msg ? (
                            <p className="text-luxury-400 text-xs truncate">{msg}</p>
                          ) : (
                            <span className="text-luxury-600 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-luxury-500 text-xs whitespace-nowrap">
                            {new Date(lead.created_at).toLocaleDateString("en-PH")}
                          </span>
                          {describeLeadSource(lead.source) && (
                            <span
                              className="block text-luxury-600 text-[11px] max-w-40 truncate"
                              title={describeLeadSource(lead.source) ?? undefined}>
                              via {describeLeadSource(lead.source)}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4" onClick={stop}>
                          <UpdateLeadStatus
                            key={`${lead.id}-${lead.status}`}
                            id={lead.id}
                            currentStatus={lead.status as LeadStatus}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setPage}
        />
      )}

      <LeadDrawer lead={shownLead} open={openId !== null} onClose={closeLead} />
    </div>
  );
}
