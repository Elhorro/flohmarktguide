import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

function isAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  return secret && req.headers.get('x-admin-secret') === secret;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAuthorized(request))
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });

  const { featured } = await request.json() as { featured: boolean };
  const supabase = createServerClient();

  const { error } = await supabase
    .from('fm_flea_markets')
    .update({ featured })
    .eq('id', params.id);

  if (error) {
    console.error('[feature]', error.message);
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, featured });
}
