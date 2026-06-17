import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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
      (message && String(message).length > 4000)
    ) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validPropertyId = property_id && UUID_REGEX.test(property_id) ? property_id : null;

    // Embed property name as a parseable prefix so admin always sees it
    const storedMessage = property_name
      ? `[PROPERTY:${property_name}]${message ? `\n${message}` : ""}`
      : message || null;

    const supabase = await createClient();
    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      message: storedMessage,
      type: type || "buy",
      location: location || null,
      budget: budget || null,
      property_id: validPropertyId,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
