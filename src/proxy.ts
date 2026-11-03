import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getClaims verifies the session JWT locally against the project's
  // asymmetric signing keys (JWKS, cached) — unlike getUser it doesn't call
  // Supabase Auth on every admin navigation. It still refreshes an expired
  // session, writing the new cookies through setAll above.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims ?? null;

  const isLoginPage = request.nextUrl.pathname.startsWith("/admin/login");

  // Not signed in → bounce to login (login page itself is exempt).
  if (!isLoginPage && !claims) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    const res = NextResponse.redirect(url);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (claims) {
    // Conditional MFA enforcement. needsMfa is only true when the account has a
    // *verified* TOTP factor but the session is still aal1 — so an account
    // with no factor is never affected (no lockout).
    //
    // The session's level comes from the verified JWT. An aal2 session (every
    // normal click after the code is entered) needs nothing more. Only an aal1
    // session asks Auth for the user's factors — not getAuthenticatorAssurance-
    // Level, which reads them from the cookie's unverified copy of the user,
    // so an edited cookie could hide the factor and skip the code.
    let needsMfa = false;
    if (claims.aal !== "aal2") {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      // Fail closed: if Auth can't confirm the user, send them to log in.
      needsMfa = !user || !!user.factors?.some((f) => f.status === "verified");
    }

    // Has a factor but hasn't entered the code yet → finish it on the login page.
    if (!isLoginPage && needsMfa) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      const res = NextResponse.redirect(url);
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }

    // Fully authenticated and idling on the login page → go to the dashboard.
    // (When needsMfa is true we deliberately stay so the code can be entered.)
    if (isLoginPage && !needsMfa) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      const res = NextResponse.redirect(url);
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }
  }

  supabaseResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};