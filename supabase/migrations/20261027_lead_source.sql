-- Lead-source attribution: which page / listing / campaign produced each lead.
-- Run in the Supabase SQL editor (project → SQL → New query).
--
-- The app tolerates this column being absent (it retries the insert without
-- `source`), so deploy order doesn't matter — but run it soon so attribution
-- starts recording.

-- ── 1. Check first: phone constraints ──────────────────────────────────────
-- The lead forms now accept international numbers (+9715XXXXXXXX, up to 16
-- chars). If a CHECK constraint on `leads.phone` (or the anon INSERT policy's
-- WITH CHECK) only allows 11 digits / "09…", those inserts will be rejected.
-- Run these two SELECTs and look at anything mentioning `phone`:
select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.leads'::regclass and contype = 'c';

select policyname, cmd, roles, with_check
from pg_policies
where schemaname = 'public' and tablename = 'leads';

-- ── 2. Add the column ──────────────────────────────────────────────────────
alter table public.leads
  add column if not exists source jsonb;

-- Same defence as the other lead caps: direct REST inserts can't stuff
-- arbitrary payloads in here. The app sends ~8 short strings (< 2 KB).
alter table public.leads
  add constraint leads_source_size check (source is null or pg_column_size(source) <= 4096);

-- Harmless if anon already has table-level INSERT; required if inserts were
-- granted per-column.
grant insert (source) on public.leads to anon;
