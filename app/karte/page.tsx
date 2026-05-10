'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { List, Map, ChevronRight, X, Calendar, MapPin, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import TypeBadge from '@/components/TypeBadge';
import { Flohmarkt } from '@/lib/types';
import { getAlleFlohmärkte } from '@/lib/data';

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone-500 text-sm">Karte wird geladen...</p>
      </div>
    </div>
  ),
});

function formatDatum(datum: string): string {
  const date = new Date(datum + 'T00:00:00');
  return date.toLocaleDateString('de-AT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

export default function KartenAnsicht() {
  const [märkte, setMärkte] = useState<Flohmarkt[]>([]);
  const [loading, setLoading] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function laden() {
    setLoading(true);
    setFehler(null);
    getAlleFlohmärkte()
      .then(setMärkte)
      .catch((err: unknown) => {
        console.error('[KartenAnsicht] Fehler beim Laden:', err);
        setFehler('Märkte konnten nicht geladen werden. Bitte versuche es nochmal.');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    laden();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navigation />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-80 lg:w-96' : 'w-0'
          } transition-all duration-300 bg-white border-r border-stone-100 flex flex-col overflow-hidden z-10 shadow-lg shrink-0`}
        >
          <div className="p-4 border-b border-stone-100 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-bold text-stone-800 text-base">Alle Märkte</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {loading ? '...' : fehler ? 'Fehler beim Laden' : `${märkte.length} Veranstaltungen`}
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-stone-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : fehler ? (
              <div className="p-4 text-center">
                <AlertTriangle size={28} className="text-orange-400 mx-auto mb-3" />
                <p className="text-sm text-stone-500 mb-4">{fehler}</p>
                <button
                  onClick={laden}
                  className="flex items-center gap-2 mx-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw size={14} />
                  Nochmal versuchen
                </button>
              </div>
            ) : märkte.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-stone-400">Keine Märkte gefunden.</p>
              </div>
            ) : (
              märkte.map((markt) => (
                <button
                  key={markt.id}
                  onClick={() => setSelectedId(markt.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedId === markt.id
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-stone-100 hover:border-orange-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1">
                        <TypeBadge typ={markt.market_type} size="sm" />
                      </div>
                      <p className="font-semibold text-stone-800 text-sm leading-snug truncate">
                        {markt.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-stone-400">
                        <Calendar size={10} />
                        <span>{formatDatum(markt.date)}</span>
                        <span className="mx-1">·</span>
                        <Clock size={10} />
                        <span>{formatTime(markt.time_start)}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-stone-400">
                        <MapPin size={10} />
                        <span className="truncate">{markt.location_name}</span>
                      </div>
                    </div>
                    <Link
                      href={`/markt/${markt.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 mt-1 text-orange-400 hover:text-orange-600"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Map area */}
        <div className="flex-1 relative">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 left-4 z-20 bg-white shadow-lg rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors border border-stone-200"
            >
              <List size={16} />
              Liste
            </button>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`absolute top-4 z-20 bg-white shadow-lg rounded-xl p-2.5 text-stone-600 hover:bg-stone-50 transition-colors border border-stone-200 ${
              sidebarOpen ? 'right-4' : 'left-24'
            }`}
          >
            <Map size={18} />
          </button>

          <div className="w-full h-full">
            {!loading && !fehler && (
              <MapView märkte={märkte} selectedId={selectedId} />
            )}
            {!loading && fehler && (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                <div className="text-center">
                  <AlertTriangle size={36} className="text-orange-400 mx-auto mb-3" />
                  <p className="text-stone-500 text-sm">{fehler}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
