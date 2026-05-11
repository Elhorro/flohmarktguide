-- Add columns that the app expects but were not in the initial schema.
-- Safe to run multiple times (uses IF NOT EXISTS).
--
-- Run this once in Supabase Dashboard → SQL Editor

ALTER TABLE fm_flea_markets
  ADD COLUMN IF NOT EXISTS address           TEXT,
  ADD COLUMN IF NOT EXISTS plz               TEXT,
  ADD COLUMN IF NOT EXISTS organizer_contact TEXT,
  ADD COLUMN IF NOT EXISTS lat               DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lng               DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS date_end          DATE;

-- date_end is optional: NULL means single-day market.
-- For multi-day markets, date_end must be >= date.
ALTER TABLE fm_flea_markets
  DROP CONSTRAINT IF EXISTS fm_flea_markets_date_range_check;
ALTER TABLE fm_flea_markets
  ADD CONSTRAINT fm_flea_markets_date_range_check
  CHECK (date_end IS NULL OR date_end >= date);
