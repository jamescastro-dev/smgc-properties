export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * A listing's URL slug. Stored in the DB so renaming a listing doesn't break
 * links already shared; falls back to the title for rows predating the column.
 */
export function propertySlug(property: { slug?: string | null; title: string }): string {
  return property.slug || slugify(property.title);
}

/**
 * Canonical subdivision name for grouping. Listings are authored inconsistently
 * — "St. Agatha Homes" and "St. Agatha Homes, Tikay, Malolos, Bulacan" are the
 * same development — so keep only the segment before the first comma, which is
 * the development's actual name.
 */
export function subdivisionName(subdivision: string): string {
  return subdivision.split(",")[0].trim();
}

/** Badge text for a listing that's off the market, or null while available. */
export function unavailableLabel(property: { status: string }): "Sold" | "Rented" | null {
  if (property.status === "sold") return "Sold";
  if (property.status === "rented") return "Rented";
  return null;
}

export function formatPrice(price: number, type: "sale" | "rent"): string {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return type === "rent" ? `${formatted}/mo` : formatted;
}

/**
 * Full peso amount for a listing's own page — "₱8,999,999", or
 * "₱2,529,424.01" when a developer price really has centavos. Cards keep the
 * compact "₱9M" form.
 */
export function formatPriceExact(price: number, type: "sale" | "rent"): string {
  const cents = Math.round(price * 100) % 100 !== 0;
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(price);

  return type === "rent" ? `${formatted}/mo` : formatted;
}

export function formatPriceCompact(price: number, type: "sale" | "rent"): string {
  let formatted: string;

  if (price >= 1_000_000) {
    // Truncate to 1 decimal (never round up) so promo prices like ₱2,999,999
    // stay under the mark → "₱2.9M", not "₱3.0M".
    const millions = Math.floor(price / 100_000) / 10;
    formatted = `₱${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  } else if (price >= 1_000) {
    const thousands = Math.floor(price / 100) / 10;
    formatted = `₱${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  } else {
    formatted = `₱${price.toLocaleString("en-PH")}`;
  }

  return type === "rent" ? `${formatted}/mo` : formatted;
}