import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import AdminPanel from './AdminPanel';

export const metadata = { title: 'Admin – Flohmarkt Kalender' };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { secret?: string };
}) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || searchParams.secret !== adminSecret) {
    redirect('/');
  }

  const supabase = createServerClient();
  const { data: märkte, error } = await supabase
    .from('fm_flea_markets')
    .select('*')
    .order('erstellt_am', { ascending: false });

  if (error) throw error;

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
