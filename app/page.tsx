'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Plus, TrendingUp, Star, Calendar } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MarktCard from '@/components/MarktCard';
import QuickFilter from '@/components/QuickFilter';
import { Flohmarkt, FilterOption } from '@/lib/types';
import { getNext10Flohmärkte, getFeaturedMärkte } from '@/lib/data';

function formatDatumShort(datum: string) {
  return new Date(datum + 'T00:00:00').toLocaleDateString('de-AT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function FeaturedCard({ markt }: { markt: Flohmarkt }) {
  return (
    <Link
      href={`/markt/${markt.id}`}
      className="group relative flex-shrink-0 w-72 bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Gold accent bar */}
      <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full">
            {markt.market_type}
          </span>
          <Star size={14} className="text-amber-400 shrink-0 mt-0.5" fill="currentColor" />
        </div>
        <h3 className="font-bold text-stone-800 text-sm leading-snug mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {markt.titel}
        </h3>
        <div className="space-y-1">
          <p className="text-xs text-stone-500 flex items-center gap-1.5">
            <Calendar size={11} className="text-stone-400" />
            {formatDatumShort(markt.date)} · {markt.time_start.slice(0, 5)} Uhr
          </p>
          <p className="text-xs text-stone-500 flex items-center gap-1.5">
            <MapPin size={11} className="text-stone-400" />
            {markt.location_name}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function Startseite() {
  const [filter, setFilter] = useState<FilterOption>('alle');
  const [märkte, setMärkte] = useState<Flohmarkt[]>([]);
  const [featured, setFeatured] = useState<Flohmarkt[]>([]);
  const [loading, setLoading] = useState(true);

  // Load featured markets once on mount
  useEffect(() => {
    getFeaturedMärkte(6).then(setFeatured).catch(() => setFeatured([]));
  }, []);

  // Load filtered markets on filter change
  useEffect(() => {
    setLoading(true);
    getNext10Flohmärkte(filter)
      .then(setMärkte)
      .catch(() => setMärkte([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-10 right-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-64 bg-amber-200 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <TrendingUp size={14} />
                Steiermark &amp; ganz Österreich
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 leading-tight mb-6">
                Finde{' '}
                <span className="text-orange-500">Flohmärkte</span>
                <br />
                in deiner Nähe
              </h1>

              <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-xl">
                Entdecke regionale Flohmärkte, Antik- und Fetzenmarkte in Österreich.
                Kostenloses Eintragen deines eigenen Markts!
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/karte"
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <MapPin size={18} />
                  Karte öffnen
                </Link>
                <Link
                  href="/eintragen"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 px-6 py-3.5 rounded-xl font-semibold transition-all border border-stone-200 hover:border-stone-300"
                >
                  <Plus size={18} />
                  Markt eintragen
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Markets */}
        {featured.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Star size={14} className="text-amber-500" fill="currentColor" />
                </div>
                <h2 className="text-xl font-bold text-stone-800">Empfehlungen</h2>
              </div>
              <span className="text-sm text-stone-400">Handverlesene Märkte</span>
            </div>

            {/* Horizontal scroll strip */}
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-hide">
              {featured.map((markt) => (
                <FeaturedCard key={markt.id} markt={markt} />
              ))}
            </div>
          </section>
        )}

        {/* Next Markets */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-800">Nächste Märkte</h2>
              <p className="text-stone-400 text-sm mt-0.5">Chronologisch sortiert</p>
            </div>
            <QuickFilter active={filter} onChange={setFilter} />
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-36 bg-stone-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : märkte.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-600 mb-2">Keine Märkte gefunden</h3>
              <p className="text-stone-400 text-sm mb-6">
                Für diesen Zeitraum sind keine Veranstaltungen eingetragen.
              </p>
              <button
                onClick={() => setFilter('alle')}
                className="text-orange-500 font-medium hover:underline text-sm"
              >
                Alle Märkte anzeigen
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {märkte.map((markt) => (
                <MarktCard key={markt.id} markt={markt} />
              ))}
            </div>
          )}

          {!loading && märkte.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/karte"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm hover:underline transition-colors"
              >
                <MapPin size={16} />
                Alle Märkte auf der Karte ansehen
              </Link>
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Eigenen Flohmarkt eintragen?
              </h2>
              <p className="text-green-100 text-base max-w-md">
                Kostenlos, einfach und schnell. Nach kurzer Prüfung wird dein Markt sofort
                freigeschaltet.
              </p>
            </div>
            <Link
              href="/eintragen"
              className="shrink-0 bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
            >
              Jetzt eintragen
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-stone-50 border-t border-stone-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-stone-400 text-sm">
          <p>© 2026 Flohmarkt Kalender Österreich · Alle Angaben ohne Gewähr</p>
        </div>
      </footer>
    </>
  );
}
