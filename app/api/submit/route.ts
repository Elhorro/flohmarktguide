import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase-server';

// Graz-Mitte als Fallback wenn Geocoding fehlschlägt
const FALLBACK_LAT = 47.0707;
const FALLBACK_LNG = 15.4395;

const schema = z.object({
  titel: z.string().min(3).max(200),
  typ: z.enum(['Flohmarkt', 'Fetzenmarkt', 'Hausflohmarkt', 'Antikmarkt']),
  datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  uhrzeit_start: z.string().regex(/^\d{2}:\d{2}$/),
  uhrzeit_ende: z.string().regex(/^\d{2}:\d{2}$/),
  adresse: z.string().min(3).max(200),
  stadt: z.string().min(2).max(100),
  beschreibung: z.string().min(10).max(1000),
  kontakt: z.string().max(200).optional(),
  // Optional manual coordinates from LocationPicker
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

async function geocode(adresse: string, stadt: string): Promise<{ lat: number; lng: number }> {
  const query = encodeURIComponent(`${adresse}, ${stadt}, Austria`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=at`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FlohmarktKalender/1.0 (leopold.kumpusch@gmail.com)' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);

    const results: Array<{ lat: string; lon: string }> = await res.json();
    if (results.length === 0) throw new Error('Keine Koordinaten gefunden');

    return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
  } catch (err) {
    console.warn('[geocode] Fallback auf Graz-Mitte:', (err as Error).message);
    return { lat: FALLBACK_LAT, lng: FALLBACK_LNG };
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ungültige Daten', details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const d = parsed.data;

  // Use manually provided coordinates if present, otherwise geocode
  let coords: { lat: number; lng: number };
  if (d.lat !== undefined && d.lng !== undefined) {
    coords = { lat: d.lat, lng: d.lng };
  } else {
    coords = await geocode(d.adresse, d.stadt);
  }

  const supabase = createServerClient();

  const { error } = await supabase.from('flohmärkte').insert([
    {
      titel: d.titel,
      typ: d.typ,
      datum: d.datum,
      uhrzeit_start: d.uhrzeit_start,
      uhrzeit_ende: d.uhrzeit_ende,
      adresse: d.adresse,
      stadt: d.stadt,
      beschreibung: d.beschreibung,
      kontakt: d.kontakt ?? null,
      lat: coords.lat,
      lng: coords.lng,
      freigegeben: false,
    },
  ]);

  if (error) {
    console.error('[submit] Supabase error:', error.message);
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
