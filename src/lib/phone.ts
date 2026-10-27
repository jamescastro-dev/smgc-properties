// Lead-form phone numbers. Visitors pick a country code (Philippines by default,
// plus the main OFW destinations) and type their local number; leads store one
// consistent E.164 string (+639171234567) so every number in the admin dials the
// same way. Shared by the form (validation as you type) and /api/leads.

export interface PhoneCountry {
  iso: string;
  name: string;
  /** Dial code without "+"; empty for "Other" (visitor types the full number). */
  dial: string;
  /** Placeholder in the country's usual grouping. */
  example: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: "PH", name: "Philippines", dial: "63", example: "917 123 4567" },
  { iso: "SA", name: "Saudi Arabia", dial: "966", example: "51 234 5678" },
  { iso: "AE", name: "United Arab Emirates", dial: "971", example: "50 123 4567" },
  { iso: "QA", name: "Qatar", dial: "974", example: "3312 3456" },
  { iso: "KW", name: "Kuwait", dial: "965", example: "500 12345" },
  { iso: "HK", name: "Hong Kong", dial: "852", example: "5123 4567" },
  { iso: "SG", name: "Singapore", dial: "65", example: "8123 4567" },
  { iso: "JP", name: "Japan", dial: "81", example: "90 1234 5678" },
  { iso: "TW", name: "Taiwan", dial: "886", example: "912 345 678" },
  { iso: "US", name: "United States", dial: "1", example: "201 555 0123" },
  { iso: "CA", name: "Canada", dial: "1", example: "506 234 5678" },
  { iso: "GB", name: "United Kingdom", dial: "44", example: "7400 123456" },
  { iso: "IT", name: "Italy", dial: "39", example: "312 345 6789" },
  { iso: "AU", name: "Australia", dial: "61", example: "412 345 678" },
  { iso: "OTHER", name: "Other country", dial: "", example: "+ country code & number" },
];

/** E.164: "+", then 8–15 digits. */
const E164 = /^\+\d{8,15}$/;

/**
 * Turn what the visitor typed into E.164, or explain what's wrong.
 * Forgiving about formatting: spaces/dashes, a leading trunk "0" (0917…,
 * 07400…), and a pasted country code (+63 917…) are all accepted.
 */
export function composePhone(
  country: PhoneCountry,
  typed: string
): { phone: string; error: string | null } {
  const pastedInternational = typed.trim().startsWith("+");
  let digits = typed.replace(/\D/g, "");

  if (!country.dial) {
    const phone = `+${digits}`;
    return E164.test(phone)
      ? { phone, error: null }
      : { phone, error: "Enter your full number starting with + and the country code." };
  }

  if (
    digits.startsWith(country.dial) &&
    (pastedInternational || (country.dial === "63" && digits.length === 12))
  ) {
    digits = digits.slice(country.dial.length);
  }
  digits = digits.replace(/^0+/, "");

  const phone = `+${country.dial}${digits}`;
  const valid =
    country.iso === "PH" ? /^\d{10}$/.test(digits) : /^\d{6,12}$/.test(digits) && E164.test(phone);

  return valid
    ? { phone, error: null }
    : {
        phone,
        error:
          country.iso === "PH"
            ? "Enter your 10-digit mobile number, e.g. 917 123 4567."
            : `Enter your ${country.name} number, e.g. ${country.example}.`,
      };
}

/**
 * Server-side: the stored form of a submitted phone, or null if invalid.
 * Also accepts the old local format (09XXXXXXXXX) from pages cached before
 * the country picker shipped.
 */
export function normalizePhone(raw: unknown): string | null {
  const s = String(raw ?? "").replace(/[\s\-().]/g, "");
  if (/^09\d{9}$/.test(s)) return `+63${s.slice(1)}`;
  return E164.test(s) ? s : null;
}
