export function formatPrice(price: number, type: "sale" | "rent"): string {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(price);

  return type === "rent" ? `${formatted}/mo` : formatted;
}