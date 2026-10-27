"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Users, Phone, Search, X } from "lucide-react";
import UpdateLeadStatus from "./UpdateLeadStatus";
import ContactButtons from "./ContactButtons";
import Pagination from "@/components/ui/Pagination";
import { describeLeadSource, type LeadSource } from "@/lib/leadSource";

function TooltipCell({
  id,
  text,
  href,
  textClassName = "",
  activeId,
  setActiveId,
}: {
  id: string;
  text: string;
  href?: string;
  textClassName?: string;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}) {
  const open = activeId === id;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setActiveId(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open, setActiveId]);

  return (
    <div
      ref={ref}
      className="relative group"
      onMouseEnter={() => setActiveId(id)}
      onMouseLeave={() => setActiveId(null)}>
      <p
        onClick={() => setActiveId(open ? null : id)}
        className={`truncate cursor-pointer select-none ${textClassName}`}>
        {text}
      </p>
      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-72 bg-luxury-900 border border-luxury-600 rounded-xl p-3 text-xs text-luxury-50 shadow-2xl break-words whitespace-normal">
          <p className="leading-relaxed">{text}</p>
          {href && (
            <Link
              href={href}
              onClick={() => setActiveId(null)}
              className="flex items-center gap-1 mt-2 pt-2 border-t border-luxury-700 text-gold-500 hover:text-gold-400 text-[10px] font-semibold uppercase tracking-widest">
              View Property →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

const ITEMS_PER_PAGE = 15;
const STATUSES = ["all", "new", "contacted", "closed"] as const;
type StatusFilter = (typeof STATUSES)[number];

interface Lead {
  id: string;
  name: string;
  phone: string;
  location?: string | null;
  budget?: string | null;
  message?: string | null;
  type: string;
  status: string;
  created_at: string;
  property_id?: string | null;
  properties?: { title: string } | null;
  source?: LeadSource | null;
}

const inquiryBadge = (t: string) =>
  t === "buy"
    ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
    : t === "sell"
    ? "bg-blue-400/10 text-blue-400 border border-blue-400/20"
    : "bg-purple-400/10 text-purple-400 border border-purple-400/20";

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

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
      {/* Filter bar */}
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap sm:px-5 sm:py-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); resetPage(); }}
              className={`h-10 sm:h-9 px-3.5 rounded-lg text-xs font-bold tracking-widest uppercase border transition-all flex items-center gap-1.5 ${
                filter === s
                  ? "bg-gold-500 text-luxury-900 border-gold-500"
                  : "text-luxury-400 border-luxury-700 hover:border-gold-500/50 hover:text-luxury-50"
              }`}>
              {s === "all" ? "All" : s}
              <span className={`text-[10px] font-bold tabular-nums ${filter === s ? "text-luxury-900/70" : "text-luxury-600"}`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative sm:ml-auto w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-luxury-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, phone…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="w-full sm:w-64 bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg pl-9 pr-10 h-10 sm:h-9 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
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
            {/* ── Mobile / tablet card list ── */}
            <div className="lg:hidden divide-y divide-luxury-700/50">
              {paginated.map((lead) => {
                const title =
                  lead.properties?.title ??
                  lead.message?.match(/^\[PROPERTY:(.+?)\]/)?.[1] ??
                  null;
                const msg = lead.message?.replace(/^\[PROPERTY:[^\]]+\]\n?/, "") || null;
                return (
                  <div key={lead.id} className="p-4 hover:bg-luxury-700/20 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-luxury-50 text-base font-semibold truncate">{lead.name}</p>
                        <p className="text-luxury-400 text-sm tabular-nums mt-0.5">{lead.phone}</p>
                      </div>
                      <UpdateLeadStatus
                        id={lead.id}
                        currentStatus={lead.status as "new" | "contacted" | "closed"}
                      />
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

                    {title && (
                      <p className="text-gold-500 text-xs mt-2">
                        {lead.property_id ? (
                          <Link href={`/admin/properties/${lead.property_id}`} className="hover:text-gold-400">
                            {title}
                          </Link>
                        ) : title}
                      </p>
                    )}

                    {msg && (
                      <p className="text-luxury-500 text-xs mt-1.5 line-clamp-2">{msg}</p>
                    )}

                    <p className="text-luxury-600 text-xs mt-2 truncate">
                      {new Date(lead.created_at).toLocaleDateString("en-PH")}
                      {describeLeadSource(lead.source) && ` · via ${describeLeadSource(lead.source)}`}
                    </p>

                    {/* Reaching the lead is the whole point of this screen on a
                        phone — make it a thumb-sized button, not 12px text. */}
                    <ContactButtons phone={lead.phone} className="mt-3" />
                  </div>
                );
              })}
            </div>

            {/* ── Desktop table ── */}
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
                  {paginated.map((lead) => (
                    <tr key={lead.id} className="hover:bg-luxury-700/20 transition-colors group">
                      <td className="px-5 py-4">
                        <p className="text-luxury-50 text-sm font-semibold max-w-40 truncate">{lead.name}</p>
                        <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 text-luxury-300 text-xs hover:text-gold-500 transition-colors whitespace-nowrap mt-1">
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
                        {(() => {
                          const title =
                            lead.properties?.title ??
                            lead.message?.match(/^\[PROPERTY:(.+?)\]/)?.[1] ??
                            null;
                          return title ? (
                            <TooltipCell
                              id={`${lead.id}-property`}
                              text={title}
                              href={lead.property_id ? `/admin/properties/${lead.property_id}` : undefined}
                              textClassName="text-gold-500 text-xs"
                              activeId={activeTooltip}
                              setActiveId={setActiveTooltip}
                            />
                          ) : (
                            <span className="text-luxury-600 text-xs">General</span>
                          );
                        })()}
                      </td>
                      <td className="px-5 py-4 max-w-44">
                        {(() => {
                          const msg = lead.message?.replace(/^\[PROPERTY:[^\]]+\]\n?/, "") || null;
                          return msg ? (
                            <TooltipCell
                              id={`${lead.id}-message`}
                              text={msg}
                              textClassName="text-luxury-400 text-xs"
                              activeId={activeTooltip}
                              setActiveId={setActiveTooltip}
                            />
                          ) : (
                            <span className="text-luxury-600 text-xs">—</span>
                          );
                        })()}
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
                      <td className="px-5 py-4">
                        <UpdateLeadStatus
                          id={lead.id}
                          currentStatus={lead.status as "new" | "contacted" | "closed"}
                        />
                      </td>
                    </tr>
                  ))}
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
    </div>
  );
}
