-- Real "last modified" dates for the sitemap. Until now every sitemap URL
-- reported the build time, which Google learns to ignore. `updated_at` is set
-- on every change to a listing, whichever tool makes it (admin form, Supabase
-- table editor, SQL).
--
-- Run in the Supabase SQL editor (project → SQL → New query). The app falls
-- back to `created_at` when the column is absent, so deploy order doesn't matter.

-- Existing rows start at now(): all 26 listing descriptions were rewritten on
-- 2026-11-03, so that's accurate for today's data.
alter table public.properties
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.properties_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists properties_touch_updated_at on public.properties;
create trigger properties_touch_updated_at
  before update on public.properties
  for each row execute function public.properties_touch_updated_at();

-- Check:
select title, updated_at from public.properties order by updated_at desc limit 5;
