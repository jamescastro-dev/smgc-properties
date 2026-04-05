export function formatPrice(price: number, type: "sale" | "rent"): string {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return type === "rent" ? `${formatted}/mo` : formatted;
}