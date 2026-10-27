// Where a lead came from, so the admin can tell which page, listing or campaign
// produced it. The first touch of each browser session (landing page, UTM tags,
// external referrer) is remembered, then attached to whichever form the visitor
// eventually submits along with the page they submitted from.

const STORAGE_KEY = "smgc_lead_source";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

const LEAD_SOURCE_KEYS = [
  "form",
  "page",
  "landing_page",
  "referrer",
  ...UTM_KEYS,
] as const;

export type LeadSource = Partial<
  Record<(typeof LEAD_SOURCE_KEYS)[number], string>
>;

/** Browser: remember the session's first touch. Safe to call on every mount. */
export function captureLeadSource(): void {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(location.search);
    const touch: LeadSource = { landing_page: location.pathname };
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) touch[key] = value;
    }
    // Only an external referrer says anything about how they found the site.
    if (
      document.referrer &&
      new URL(document.referrer).origin !== location.origin
    ) {
      touch.referrer = document.referrer;
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(touch));
  } catch {
    // Storage blocked (private mode, disabled site data) — source is best-effort.
  }
}

/** Browser: the source to send with a form submission. */
export function getLeadSource(form: string): LeadSource {
  let touch: LeadSource = {};
  try {
    touch = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    // Fall through with just the form and page.
  }
  return { ...touch, form, page: location.pathname };
}

/** Server: keep only known keys with short string values. */
export function sanitizeLeadSource(raw: unknown): LeadSource | null {
  if (!raw || typeof raw !== "object") return null;

  const clean: LeadSource = {};
  for (const key of LEAD_SOURCE_KEYS) {
    const value = (raw as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      clean[key] = value.trim().slice(0, 200);
    }
  }
  return Object.keys(clean).length > 0 ? clean : null;
}

/** Admin: short human label, e.g. "facebook · /properties/pia-model…". */
export function describeLeadSource(source?: LeadSource | null): string | null {
  if (!source) return null;

  let origin = source.utm_source;
  if (!origin && source.referrer) {
    try {
      origin = new URL(source.referrer).hostname.replace(/^(www|m|l|lm)\./, "");
    } catch {
      origin = source.referrer;
    }
  }

  const page = source.page ?? source.landing_page;
  return [origin ?? "direct", page].filter(Boolean).join(" · ");
}
