import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, message, type, location, budget, property_id, property_name } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
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
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}