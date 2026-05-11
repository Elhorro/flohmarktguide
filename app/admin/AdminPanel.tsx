'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Star, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Flohmarkt } from '@/lib/types';

type Tab = 'pending' | 'approved' | 'all';

interface AdminPanelProps {
  märkte: Flohmarkt[];
  adminSecret: string;
}

import { formatDateRange, formatTime } from '@/lib/format';

const typColors: Record<string, string> = {
  Flohmarkt: 'bg-orange-100 text-orange-700',
  Fetzenmarkt: 'bg-purple-100 text-purple-700',
  Hausflohmarkt: 'bg-blue-100 text-blue-700',
  Antikmarkt: 'bg-amber-100 text-amber-700',
};

export default function AdminPanel({ märkte, adminSecret }: AdminPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [localFeatured, setLocalFeatured] = useState<Record<string, boolean>>({});

  const pending = useMemo(() => märkte.filter((m) => !m.freigegeben), [märkte]);
  const approved = useMemo(() => märkte.filter((m) => m.freigegeben), [märkte]);

  const filtered = useMemo(() => {
    const base = tab === 'pending' ? pending : tab === 'approved' ? approved : märkte;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.location_name.toLowerCase().includes(q) ||
        m.market_type.toLowerCase().includes(q),
    );
  }, [tab, search, märkte, pending, approved]);

  async function approve(id: string) {
    setLoadingId(id + ':approve');
    await fetch(`/api/admin/approve/${id}`, {
      method: 'PATCH',
      headers: { 'x-admin-secret': adminSecret },
    });
    setLoadingId(null);
    router.refresh();
  }

  async function reject(id: string) {
    if (!confirm('Markt wirklich löschen?')) return;
    setLoadingId(id + ':reject');
    await fetch(`/api/admin/reject/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-secret': adminSecret },
    });
    setLoadingId(null);
    router.refresh();
  }

  async function toggleFeatured(markt: Flohmarkt) {
    const current =
      localFeatured[markt.id] !== undefined ? localFeatured[markt.id] : markt.featured;
    const next = !current;
    setLoadingId(markt.id + ':feature');
    setLocalFeatured((prev) => ({ ...prev, [markt.id]: next }));
    await fetch(`/api/admin/feature/${markt.id}`, {
      method: 'PATCH',
      headers: { 'x-admin-secret': adminSecret, 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: next }),
    });
    setLoadingId(null);
  }

  function TabButton({ t, label, count }: { t: Tab; label: string; count: number }) {
    const active = tab === t;
    return (
      <button
        onClick={() => setTab(t)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
          active
            ? 'bg-orange-500 text-white shadow-sm'
            : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
        }`}
      >
        {label}
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
            active ? 'bg-orange-400 text-white' : 'bg-stone-100 text-stone-500'
          }`}
        >
          {count}
        </span>
      </button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Wartend', value: pending.length, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
          { label: 'Freigeschaltet', value: approved.length, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
          { label: 'Gesamt', value: märkte.length, color: 'text-stone-700', bg: 'bg-stone-50 border-stone-200' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 border`}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          <TabButton t="pending" label="Wartend" count={pending.length} />
          <TabButton t="approved" label="Freigeschaltet" count={approved.length} />
          <TabButton t="all" label="Alle" count={märkte.length} />
        </div>
        <div className="sm:ml-auto relative w-full sm:w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Titel, Stadt oder Typ..."
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          />
        </div>
      </div>

      {/* Market list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center shadow-sm">
          <p className="text-stone-400">
            {search ? 'Keine Ergebnisse für deine Suche.' : 'Keine Märkte in dieser Kategorie.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((markt) => {
            const isFeatured =
              localFeatured[markt.id] !== undefined
                ? localFeatured[markt.id]
                : markt.featured;
            const isLoading = (key: string) => loadingId === `${markt.id}:${key}`;
            const anyLoading = loadingId !== null;

            return (
              <div
                key={markt.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm transition-all ${
                  !markt.freigegeben ? 'border-orange-100' : 'border-stone-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          typColors[markt.market_type] ?? 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {markt.market_type}
                      </span>
                      {!markt.freigegeben && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                          Wartend
                        </span>
                      )}
                      {isFeatured && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                          <Star size={10} fill="currentColor" />
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-stone-800 text-base truncate">{markt.title}</h3>
                    <p className="text-sm text-stone-500 mt-0.5">
                      📅 {formatDateRange(markt.date, markt.date_end)} · ⏰ {formatTime(markt.time_start)}–{formatTime(markt.time_end)} Uhr
                    </p>
                    <p className="text-sm text-stone-500">
                      📍 {markt.address}{markt.plz ? ` ${markt.plz}` : ''} {markt.location_name}
                    </p>
                    {markt.organizer_contact && (
                      <p className="text-sm text-stone-400 mt-0.5">📞 {markt.organizer_contact}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {markt.freigegeben && (
                      <button
                        onClick={() => toggleFeatured(markt)}
                        disabled={anyLoading}
                        title={isFeatured ? 'Featured entfernen' : 'Als Featured markieren'}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                          isFeatured
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isLoading('feature') ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Star size={14} fill={isFeatured ? 'currentColor' : 'none'} />
                        )}
                        {isFeatured ? 'Featured' : 'Featured?'}
                      </button>
                    )}

                    {!markt.freigegeben && (
                      <button
                        onClick={() => approve(markt.id)}
                        disabled={anyLoading}
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {isLoading('approve') ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        Freischalten
                      </button>
                    )}

                    <button
                      onClick={() => reject(markt.id)}
                      disabled={anyLoading}
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {isLoading('reject') ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {!markt.freigegeben ? 'Ablehnen' : 'Löschen'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-400 mt-3 line-clamp-2 border-t border-stone-50 pt-2">
                  {markt.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
