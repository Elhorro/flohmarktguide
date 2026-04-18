'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { List, Map, ChevronRight, X, Calendar, MapPin, Clock } from 'lucide-react';
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
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    getAlleFlohmärkte()
      .then(setMärkte)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navigation />

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          className={`${
            sidebarOpen ? 'w-80 lg:w-96' : 'w-0'
          } transition-all duration-300 bg-white border-r border-stone-100 flex flex-col overflow-hidden z-10 shadow-lg shrink-0`}
        >
          <div className="p-4 border-b border-stone-100 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-bold text-stone-800 text-base">Alle Märkte</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {loading ? '...' : `${märkte.length} Veranstaltungen`}
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
                        <TypeBadge typ={markt.typ} size="sm" />
                      </div>
                      <p className="font-semibold text-stone-800 text-sm leading-snug truncate">
                        {markt.titel}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-stone-400">
                        <Calendar size={10} />
                        <span>{formatDatum(markt.datum)}</span>
                        <span className="mx-1">·</span>
                        <Clock size={10} />
                        <span>{formatTime(markt.uhrzeit_start)}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-stone-400">
                        <MapPin size={10} />
                        <span className="truncate">{markt.stadt}</span>
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
            {!loading && (
              <MapView märkte={märkte} selectedId={selectedId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
