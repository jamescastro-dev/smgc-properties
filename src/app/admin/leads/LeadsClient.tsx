"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";

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
import { Users, Phone, Search, X } from "lucide-react";
import UpdateLeadStatus from "./UpdateLeadStatus";
import Pagination from "@/components/ui/Pagination";

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
}

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
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
        {/* Status tabs with counts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map((s) => {
            const count = counts[s];
            return (
              <button
                key={s}
                onClick={() => { setFilter(s); resetPage(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase border transition-all flex items-center gap-1.5 ${
                  filter === s
                    ? "bg-gold-500 text-luxury-900 border-gold-500"
                    : "text-luxury-400 border-luxury-700 hover:border-gold-500/50 hover:text-luxury-50"
                }`}>
                {s === "all" ? "All" : s}
                <span
                  className={`text-[10px] font-bold tabular-nums ${
                    filter === s ? "text-luxury-900/70" : "text-luxury-600"
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-luxury-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, phone, email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg pl-9 pr-9 py-2 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors w-64"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); resetPage(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-500 hover:text-luxury-300 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-luxury-700 bg-luxury-900/40">
                  {[
                    "Client",
                    "Contact",
                    "Location",
                    "Inquiry",
                    "Budget",
                    "Property",
                    "Message",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-luxury-400 text-[11px] font-semibold tracking-widest uppercase px-6 py-3.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-700/60">
                {paginated.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-luxury-700/20 transition-colors group">
                    {/* Client */}
                    <td className="px-6 py-4">
                      <p className="text-luxury-50 text-sm font-semibold whitespace-nowrap">
                        {lead.name}
                      </p>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1.5 text-luxury-300 text-xs hover:text-gold-500 transition-colors whitespace-nowrap">
                        <Phone className="w-3 h-3 text-gold-500" />
                        {lead.phone}
                      </a>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <span className="text-luxury-300 text-xs whitespace-nowrap">
                        {lead.location || "—"}
                      </span>
                    </td>

                    {/* Inquiry type */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${
                          lead.type === "buy"
                            ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
                            : lead.type === "sell"
                              ? "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                              : "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                        }`}>
                        {lead.type}
                      </span>
                    </td>

                    {/* Budget */}
                    <td className="px-6 py-4">
                      <span className="text-luxury-300 text-sm whitespace-nowrap">
                        {lead.budget || "—"}
                      </span>
                    </td>

                    {/* Property */}
                    <td className="px-6 py-4 max-w-36">
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

                    {/* Message */}
                    <td className="px-6 py-4 max-w-44">
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

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-luxury-500 text-xs whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString("en-PH")}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
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
        )}
      </div>

      {/* Pagination */}
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
