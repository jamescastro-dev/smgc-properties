-- Stable listing URLs. Until now a listing's URL was derived from its title,
-- so renaming a listing broke every link already posted to Facebook. Now the
-- slug is stored once, at creation, and survives title edits. If a slug is ever
-- changed by hand (Supabase table editor), the old one is kept in
-- `previous_slugs` and the site 308-redirects it to the current URL.
--
-- Run in the Supabase SQL editor (project → SQL → New query). The app tolerates
-- these columns being absent (it falls back to the title-derived slug), so
-- deploy order doesn't matter.

-- ── 1. Slugify, matching slugify() in src/lib/utils.ts ─────────────────────
-- Must stay byte-for-byte compatible with the JS version: the backfill below
-- has to reproduce today's URLs exactly.
create or replace function public.slugify(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select regexp_replace(
           regexp_replace(
             regexp_replace(
               regexp_replace(lower(value), '[^a-z0-9\s-]', '', 'g'),
               '^\s+|\s+$', '', 'g'),
             '\s+', '-', 'g'),
           '-+', '-', 'g');
$$;

-- ── 2. Columns ─────────────────────────────────────────────────────────────
alter table public.properties
  add column if not exists slug text,
  add column if not exists previous_slugs text[] not null default '{}';

-- ── 3. Backfill with today's URLs ──────────────────────────────────────────
-- Same order the site resolves slugs in (getAllProperties), so if two titles
-- ever slugify alike, the one that currently owns the URL keeps it.
with ranked as (
  select id,
         public.slugify(title) as base,
         row_number() over (
           partition by public.slugify(title)
           order by sort_order asc nulls last, created_at desc
         ) as n
  from public.properties
  where slug is null
)
update public.properties p
set slug = case when r.n = 1 then r.base else r.base || '-' || r.n end
from ranked r
where p.id = r.id;

alter table public.properties alter column slug set not null;
create unique index if not exists properties_slug_key on public.properties (slug);

-- ── 4. Keep slugs stable ───────────────────────────────────────────────────
-- Insert: generate from the title if none given, suffixing -2, -3… on clash.
-- Update: a title edit never touches the slug. A blank slug keeps the old one.
-- A changed slug archives the old one so its links keep working.
create or replace function public.properties_set_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
  candidate text;
  n int := 1;
begin
  if tg_op = 'UPDATE' then
    if new.slug is null or btrim(new.slug) = '' then
      new.slug := old.slug;
    end if;
    new.slug := public.slugify(new.slug);
    if new.slug is distinct from old.slug then
      new.previous_slugs := array_remove(
        array_append(coalesce(old.previous_slugs, '{}'), old.slug), new.slug);
    end if;
    return new;
  end if;

  base := public.slugify(coalesce(nullif(btrim(new.slug), ''), new.title));
  if base = '' then
    base := 'listing';
  end if;
  candidate := base;
  while exists (
    select 1 from public.properties p
    where p.slug = candidate or candidate = any (p.previous_slugs)
  ) loop
    n := n + 1;
    candidate := base || '-' || n;
  end loop;
  new.slug := candidate;
  return new;
end;
$$;

drop trigger if exists properties_set_slug on public.properties;
create trigger properties_set_slug
  before insert or update of slug on public.properties
  for each row execute function public.properties_set_slug();

-- ── 5. Check ───────────────────────────────────────────────────────────────
-- Every listing should have a slug matching its current URL on the site.
select title, slug from public.properties order by sort_order nulls last, created_at desc;
