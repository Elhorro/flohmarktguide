import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const auth = request.headers.get('x-admin-secret');
  return auth === secret;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from('fm_flea_markets')
    .delete()
    .eq('id', params.id);

  if (error) {
    console.error('[reject]', error.message);
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
