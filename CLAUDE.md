# CLAUDE.md

Project context for Claude Code. SMGC Properties — a real estate listings + lead-management site for a PRC-licensed Philippine property broker (Shella Castro, Bulacan & Luzon).

## Commands

```bash
npm run dev     # Next.js dev server (Turbopack) on http://localhost:3000
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint (flat config, eslint-config-next)
```

There is no test suite. Node 18+ (this machine uses nvm4w).

## Stack

- **Next.js 16.2.1** App Router, **Turbopack** dev, React 19.2, TypeScript (strict)
- **Supabase** — Postgres + Auth, via `@supabase/ssr` and `@supabase/supabase-js`
- **Tailwind CSS v4** (`@tailwindcss/postcss`), **next-themes** (dark mode), **lucide-react** icons
- `babel-plugin-react-compiler` is enabled (React Compiler)
- Path alias: `@/*` → `src/*`

## Layout

```
src/
  app/          App Router routes (see below)
  components/   layout/  providers/  sections/  ui/
  lib/          constants.ts, data.ts, utils.ts, supabase/{client,server,properties}.ts
  types/        index.ts  (Property, Lead, Testimonial)
  middleware.ts auth guard for /admin
```

### Routes
- **Public:** `/`, `/about`, `/buy`, `/rent`, `/contact`, `/privacy`, `/properties`, `/properties/[slug]`
- **Admin** (auth-gated): `/admin`, `/admin/login`, `/admin/properties` (list / `new` / `[id]` edit), `/admin/leads`, `/admin/calculator`
- **API:** `POST /api/leads` (public — contact/inquiry form), `POST /api/revalidate` (auth-gated — busts the `properties` cache)
- **SEO:** `sitemap.ts`, `robot.ts`, `not-found.tsx`

## Data layer

- **Reads** go through `src/lib/supabase/properties.ts`. Each fetcher is wrapped in `unstable_cache` with `{ revalidate: 60, tags: ["properties"] }`. These run a plain `supabase-js` client (Supabase URL + anon key passed in as args) because **`unstable_cache` cannot read cookies** — don't call the cookie-based server client inside them.
- **Writes** (admin) mutate Supabase, then `POST /api/revalidate`, which calls `revalidateTag("properties")` so the cached reads refresh.
- **Property pages** use clean slugs: `getPropertyBySlug` matches `slugify(title)`. `/properties/[slug]` falls back UUID → static `FEATURED_PROPERTIES` (`src/lib/data.ts`) when the DB is unavailable, so the site degrades gracefully.
- Tables: `properties`, `leads`. Lead messages embed the property as a `[PROPERTY:<name>]` prefix so admins always see context.

## Auth

`src/middleware.ts` (matcher `/admin/:path*`) checks the Supabase session via `getUser()`: unauthenticated `/admin/*` → redirect to `/admin/login`; authenticated user on `/admin/login` → redirect to `/admin`. Three Supabase clients, pick by context:
- `lib/supabase/client.ts` — browser (client components)
- `lib/supabase/server.ts` — server components / route handlers (cookie-based)
- `lib/supabase/properties.ts` — plain client inside `unstable_cache` (no cookies)

## Conventions

- Client components are suffixed `*Client.tsx` (e.g. `PropertiesClient`, `PropertyDetailClient`, `LeadsClient`); server components fetch data and pass it down. `loading.tsx` files provide skeleton UI.
- Prices: `formatPrice()` in `lib/utils.ts` (PHP currency; appends `/mo` for rentals).
- Site-wide copy/contact/social live in `lib/constants.ts` (`SITE_CONFIG`, `PROPERTY_TYPES`, `LOCATIONS`).
- Remote image hosts are allowlisted in `next.config.ts`: `images.unsplash.com`, `*.supabase.co`.
- Secrets in `.env.local` (gitignored): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public), plus `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SUPABASE_DB_PASSWORD`.

## Gotchas

- **Turbopack `.next` cache corruption** surfaces as a panic loop "Next.js package not found" even though `next` is installed. Fix: stop the dev server, delete `.next`, restart `npm run dev`.
- Next.js 16 warns that the `middleware` file convention is deprecated in favor of `proxy` — `src/middleware.ts` still uses the old name (rename pending).
