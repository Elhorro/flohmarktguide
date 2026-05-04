-- Featured-Spalte für bezahlte/hervorgehobene Flohmärkte
ALTER TABLE flohmärkte ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_flohmärkte_featured ON flohmärkte (featured) WHERE featured = TRUE;
