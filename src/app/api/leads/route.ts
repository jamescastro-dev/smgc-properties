import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { sanitizeLeadSource } from "@/lib/leadSource";

// Best-effort in-memory rate limit (per warm serverless instance).
// For stricter limits across instances, back this with Upstash/Supabase.
const RATE_LIMIT = 5; // max submissions per window per IP
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Bound memory growth
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      message,
      type,
      location,
      budget,
      property_id,
      property_name,
      source,
      company, // honeypot — must stay empty
    } = body;

    // Honeypot: real users never see/fill this. Pretend success, store nothing.
    if (typeof company === "string" && company.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Rate limit per IP (best-effort)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }

    // Basic length guards against abuse / oversized payloads
    if (
      String(name).length > 120 ||
      String(phone).length > 20 ||
      (message && String(message).length > 4000) ||
      (location && String(location).length > 120) ||
      (budget && String(budget).length > 60) ||
      (property_name && String(property_name).length > 200)
    ) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    // Stored as E.164 (+639171234567); the form's own check can be bypassed.
    const validPhone = normalizePhone(phone);
    if (!validPhone) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    // Constrain type to the known set; anything else falls back to "buy"
    const ALLOWED_TYPES = ["buy", "sell", "rent"];
    const validType = ALLOWED_TYPES.includes(type) ? type : "buy";

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validPropertyId = property_id && UUID_REGEX.test(property_id) ? property_id : null;

    // Embed property name as a parseable prefix so admin always sees it
    const storedMessage = property_name
      ? `[PROPERTY:${property_name}]${message ? `\n${message}` : ""}`
      : message || null;

    const lead = {
      name,
      phone: validPhone,
      message: storedMessage,
      type: validType,
      location: location || null,
      budget: budget || null,
      property_id: validPropertyId,
      status: "new",
    };

    const supabase = await createClient();
    let { error } = await supabase
      .from("leads")
      .insert({ ...lead, source: sanitizeLeadSource(source) });

    // If the `source` column hasn't been added yet (PGRST204 = unknown column),
    // save the lead without it — attribution is nice to have, the lead is not.
    if (error?.code === "PGRST204") {
      console.error("[leads] source column missing; saving without it");
      ({ error } = await supabase.from("leads").insert(lead));
    }

    if (error) {
      console.error("[leads] insert failed:", error.message);
      return NextResponse.json(
        { error: "Could not submit your inquiry. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[leads] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
