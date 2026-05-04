import { createServerClient } from '@/lib/supabase-server';
import AdminPanel from './AdminPanel';

export const metadata = { title: 'Admin – Flohmarkt Kalender' };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { secret?: string };
}) {
  const adminSecret = process.env.ADMIN_SECRET;

  // ADMIN_SECRET nicht konfiguriert
  if (!adminSecret) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="font-bold text-stone-800 text-lg mb-2">ADMIN_SECRET nicht gesetzt</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            Die Umgebungsvariable <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs font-mono">ADMIN_SECRET</code> ist
            in Coolify nicht konfiguriert. Bitte unter{' '}
            <strong>Environment Variables</strong> hinzufügen und neu deployen.
          </p>
        </div>
      </div>
    );
  }

  // Falsches oder fehlendes Secret in der URL
  if (searchParams.secret !== adminSecret) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-stone-100 p-8 max-w-md text-center shadow-sm">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="font-bold text-stone-800 text-lg mb-2">Zugang verweigert</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            Bitte mit korrektem Secret aufrufen:
          </p>
          <code className="block bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-xs font-mono text-stone-600 mt-3">
            /admin?secret=DEIN_ADMIN_SECRET
          </code>
        </div>
      </div>
    );
  }

  const supabase = createServerClient();
  const { data: märkte, error } = await supabase
    .from('fm_flea_markets')
    .select('*')
    .order('erstellt_am', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💾</span>
          </div>
          <h2 className="font-bold text-stone-800 text-lg mb-2">Datenbankfehler</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-3">
            Die Tabelle konnte nicht geladen werden:
          </p>
          <code className="block bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 text-xs font-mono text-red-600 text-left break-all">
            {error.message}
          </code>
          <p className="text-stone-400 text-xs mt-4">
            Prüfe ob <code className="bg-stone-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> korrekt gesetzt ist
            und die Tabelle <code className="bg-stone-100 px-1 rounded">fm_flea_markets</code> existiert.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Admin Panel</h1>
            <p className="text-stone-400 text-sm mt-1">Verwaltung aller Flohmärkte</p>
          </div>
          <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
            Admin
          </span>
        </div>
        <AdminPanel märkte={märkte ?? []} adminSecret={adminSecret} />
      </div>
    </div>
  );
}
