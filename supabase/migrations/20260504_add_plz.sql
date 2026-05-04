-- Add optional PLZ (postal code) field to flea markets table
ALTER TABLE fm_flea_markets ADD COLUMN IF NOT EXISTS plz VARCHAR(10) DEFAULT NULL;
