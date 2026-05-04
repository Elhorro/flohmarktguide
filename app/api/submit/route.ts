import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase-server';

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
});

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
      lat: 47.0707,
      lng: 15.4395,
      freigegeben: false,
    },
  ]);

  if (error) {
    console.error('[submit] Supabase error:', error.message);
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
