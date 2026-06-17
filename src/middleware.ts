import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname.startsWith("/admin/login");

  // Not signed in → bounce to login (login page itself is exempt).
  if (!isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    // Conditional MFA enforcement. needsMfa is only true when the account has a
    // *verified* TOTP factor but the current session is still aal1 — so an
    // account with no factor is never affected (no lockout). getAuthenticator-
    // AssuranceLevel reports nextLevel "aal2" only once a factor is verified.
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const needsMfa =
      aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2";

    // Has a factor but hasn't entered the code yet → finish it on the login page.
    if (!isLoginPage && needsMfa) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Fully authenticated and idling on the login page → go to the dashboard.
    // (When needsMfa is true we deliberately stay so the code can be entered.)
    if (isLoginPage && !needsMfa) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};