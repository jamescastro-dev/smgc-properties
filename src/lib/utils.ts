export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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

export function formatPrice(price: number, type: "sale" | "rent"): string {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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