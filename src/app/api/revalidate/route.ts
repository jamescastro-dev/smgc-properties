import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Expire immediately so an edited or deleted listing is gone on the very
    // next request. ("max" would serve the stale copy once; an unknown profile
    // name throws inside Next and expires nothing.)
    revalidateTag("properties", { expire: 0 });
    return NextResponse.json({ revalidated: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}