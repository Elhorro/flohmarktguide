import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import AdminActions from './AdminActions';

function formatDatum(datum: string) {
  return new Date(datum + 'T00:00:00').toLocaleDateString('de-AT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { secret?: string };
}) {
  const adminSecret = process.env.ADMIN_SECRET;

  // Passwortschutz: ?secret=xxx in der URL
  if (!adminSecret || searchParams.secret !== adminSecret) {
    redirect('/');
  }

  const supabase = createServerClient();
  const { data: pending, error } = await supabase
    .from('flohmärkte')
    .select('*')
    .eq('freigegeben', false)
    .order('erstellt_am', { ascending: true });

  if (error) throw error;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Admin – Wartende Märkte</h1>
            <p className="text-stone-400 text-sm mt-1">
              {pending?.length ?? 0} Märkte warten auf Freigabe
            </p>
          </div>
          <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
            Moderationsansicht
          </span>
        </div>

        {!pending || pending.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center shadow-sm">
            <p className="text-stone-400 text-lg">Alles erledigt – keine wartenden Märkte 🎉</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((markt) => (
              <div
                key={markt.id}
                className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
                        {markt.typ}
                      </span>
                      <span className="text-xs text-stone-400">
                        Eingereicht {new Date(markt.erstellt_am).toLocaleDateString('de-AT')}
                      </span>
                    </div>
                    <h2 className="font-bold text-stone-800 text-base mb-1">{markt.titel}</h2>
                    <p className="text-sm text-stone-500">
                      📅 {formatDatum(markt.datum)} · ⏰ {markt.uhrzeit_start.slice(0, 5)}–{markt.uhrzeit_ende.slice(0, 5)} Uhr
                    </p>
                    <p className="text-sm text-stone-500">
                      📍 {markt.adresse}, {markt.stadt}
                    </p>
                    {markt.kontakt && (
                      <p className="text-sm text-stone-500">📞 {markt.kontakt}</p>
                    )}
                    <p className="text-sm text-stone-400 mt-2 line-clamp-2">
                      {markt.beschreibung}
                    </p>
                  </div>
                  <AdminActions id={markt.id} adminSecret={adminSecret} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
