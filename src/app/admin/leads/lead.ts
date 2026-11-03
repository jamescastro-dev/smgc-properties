import type { LeadSource } from "@/lib/leadSource";

export type LeadStatus = "new" | "contacted" | "closed";

export interface Lead {
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
  properties?: { title: string; slug?: string | null } | null;
  source?: LeadSource | null;
}

/** The listing a lead asked about: the joined title, else the [PROPERTY:…] prefix the forms embed. */
export const leadPropertyTitle = (lead: Lead) =>
  lead.properties?.title ?? lead.message?.match(/^\[PROPERTY:(.+?)\]/)?.[1] ?? null;

/** The message as the visitor wrote it, without the [PROPERTY:…] prefix. */
export const leadMessage = (lead: Lead) =>
  lead.message?.replace(/^\[PROPERTY:[^\]]+\]\n?/, "") || null;

export const inquiryBadge = (t: string) =>
  t === "buy"
    ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
    : t === "sell"
    ? "bg-blue-400/10 text-blue-400 border border-blue-400/20"
    : "bg-purple-400/10 text-purple-400 border border-purple-400/20";
