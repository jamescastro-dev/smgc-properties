"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ExternalLink, Pencil } from "lucide-react";
import UpdateLeadStatus from "./UpdateLeadStatus";
import ContactButtons from "./ContactButtons";
import { type Lead, type LeadStatus, inquiryBadge, leadMessage, leadPropertyTitle } from "./lead";

// Everything lib/leadSource captures, in the order it's useful to read.
const SOURCE_ROWS = [
  ["form", "Form"],
  ["page", "Submitted on"],
  ["landing_page", "Landing page"],
  ["referrer", "Came from"],
  ["utm_source", "Campaign source"],
  ["utm_medium", "Campaign medium"],
  ["utm_campaign", "Campaign"],
  ["utm_content", "Ad / content"],
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-5 border-b border-luxury-700/60 last:border-b-0">
      <h3 className="text-luxury-500 text-[10px] font-bold tracking-widest uppercase mb-3">
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Full view of one lead. A right-hand panel from sm up, a bottom sheet on
 * phones. Stays mounted so it can slide out; `lead` is kept while closing.
 */
export default function LeadDrawer({
  lead,
  open,
  onClose,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const title = lead ? leadPropertyTitle(lead) : null;
  const message = lead ? leadMessage(lead) : null;
  const sourceRows = SOURCE_ROWS.filter(([key]) => lead?.source?.[key]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={lead ? `Lead from ${lead.name}` : "Lead"}
        inert={!open}
        className={`fixed z-50 flex flex-col bg-luxury-800 border-luxury-700 shadow-2xl transition-transform duration-300 ease-out
          left-0 right-0 bottom-0 max-h-[88dvh] rounded-t-2xl border-t
          sm:left-auto sm:top-0 sm:max-h-none sm:w-md sm:rounded-none sm:border-t-0 sm:border-l ${
            open ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"
          }`}>
        {lead && (
          <>
            {/* Header */}
            <div className="shrink-0 px-5 pt-3 sm:pt-[calc(1.25rem+env(safe-area-inset-top))] pb-4 border-b border-luxury-700/80">
              <div className="sm:hidden mx-auto mb-3 h-1 w-10 rounded-full bg-luxury-600" aria-hidden="true" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-luxury-50 text-lg font-bold leading-snug break-words">
                    {lead.name}
                  </h2>
                  <p className="text-luxury-500 text-xs mt-1">
                    {new Date(lead.created_at).toLocaleString("en-PH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close"
                  className="w-10 h-10 -mr-2 -mt-1 shrink-0 rounded-lg flex items-center justify-center text-luxury-400 hover:text-luxury-50 hover:bg-luxury-700/60 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <UpdateLeadStatus
                  key={`${lead.id}-${lead.status}`}
                  id={lead.id}
                  currentStatus={lead.status as LeadStatus}
                />
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${inquiryBadge(lead.type)}`}>
                  {lead.type}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <Section title="Contact">
                <a
                  href={`tel:${lead.phone}`}
                  className="text-luxury-50 text-base font-semibold tabular-nums hover:text-gold-500 transition-colors">
                  {lead.phone}
                </a>
                <ContactButtons phone={lead.phone} className="mt-3" />
              </Section>

              {(lead.location || lead.budget) && (
                <Section title="Looking for">
                  <dl className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-2 text-sm">
                    {lead.location && (
                      <>
                        <dt className="text-luxury-500">Location</dt>
                        <dd className="text-luxury-200">{lead.location}</dd>
                      </>
                    )}
                    {lead.budget && (
                      <>
                        <dt className="text-luxury-500">Budget</dt>
                        <dd className="text-luxury-200">{lead.budget}</dd>
                      </>
                    )}
                  </dl>
                </Section>
              )}

              <Section title="Property">
                {title ? (
                  <>
                    <p className="text-gold-500 text-sm font-medium leading-snug">{title}</p>
                    {lead.property_id && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Link
                          href={`/admin/properties/${lead.property_id}`}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-luxury-600 hover:border-gold-500/50 text-luxury-200 hover:text-gold-500 text-xs font-semibold transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                          Edit listing
                        </Link>
                        {lead.properties?.slug && (
                          <a
                            href={`/properties/${lead.properties.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-luxury-600 hover:border-gold-500/50 text-luxury-200 hover:text-gold-500 text-xs font-semibold transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                            View on site
                          </a>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-luxury-400 text-sm">General inquiry</p>
                )}
              </Section>

              <Section title="Message">
                {message ? (
                  <p className="text-luxury-200 text-sm leading-relaxed whitespace-pre-wrap break-words bg-luxury-900 border border-luxury-700 rounded-xl p-4">
                    {message}
                  </p>
                ) : (
                  <p className="text-luxury-500 text-sm">No message.</p>
                )}
              </Section>

              <Section title="Source">
                {sourceRows.length > 0 ? (
                  <dl className="grid grid-cols-[7.5rem_1fr] gap-x-3 gap-y-2 text-sm">
                    {sourceRows.map(([key, label]) => (
                      <div key={key} className="contents">
                        <dt className="text-luxury-500">{label}</dt>
                        <dd className="text-luxury-200 break-all">{lead.source?.[key]}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-luxury-500 text-sm">Not recorded.</p>
                )}
              </Section>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
