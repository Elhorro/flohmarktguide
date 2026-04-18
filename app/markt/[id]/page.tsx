'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Share2,
  Navigation as NavIcon,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import TypeBadge from '@/components/TypeBadge';
import { Flohmarkt } from '@/lib/types';
import { getFlohmarktById } from '@/lib/data';

const SmallMap = dynamic(() => import('@/components/map/SmallMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-100 animate-pulse rounded-xl" />
  ),
});

interface Props {
  params: { id: string };
}

function formatDatum(datum: string): string {
  const date = new Date(datum + 'T00:00:00');
  return date.toLocaleDateString('de-AT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

function buildGoogleMapsUrl(markt: Flohmarkt): string {
  const q = encodeURIComponent(`${markt.adresse}, ${markt.stadt}, Austria`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function buildICSContent(markt: Flohmarkt): string {
  const dateParts = markt.datum.split('-');
  const startParts = markt.uhrzeit_start.split(':');
  const endParts = markt.uhrzeit_ende.split(':');

  const dtStart = `${dateParts[0]}${dateParts[1]}${dateParts[2]}T${startParts[0]}${startParts[1]}00`;
  const dtEnd = `${dateParts[0]}${dateParts[1]}${dateParts[2]}T${endParts[0]}${endParts[1]}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${markt.titel}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `LOCATION:${markt.adresse}, ${markt.stadt}`,
    `DESCRIPTION:${markt.beschreibung.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export default function MarktDetailPage({ params }: Props) {
  const [markt, setMarkt] = useState<Flohmarkt | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    getFlohmarktById(params.id)
      .then((data) => {
        if (!data) setNotFound(true);
        else setMarkt(data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleShare = async () => {
    if (markt && navigator.share) {
      try {
        await navigator.share({
          title: markt.titel,
          text: `${markt.titel} – ${formatDatum(markt.datum)} in ${markt.stadt}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleCalendar = () => {
    if (!markt) return;
    const ics = buildICSContent(markt);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${markt.titel.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-4">
          <div className="h-8 w-40 bg-stone-100 rounded-lg animate-pulse" />
          <div className="h-10 w-3/4 bg-stone-100 rounded-xl animate-pulse" />
          <div className="h-64 bg-stone-100 rounded-2xl animate-pulse" />
        </div>
      </>
    );
  }

  if (notFound || !markt) {
    return (
      <>
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} className="text-stone-400" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-3">Markt nicht gefunden</h1>
          <p className="text-stone-400 mb-8">
            Dieser Flohmarkt existiert nicht oder wurde entfernt.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Zurück zur Übersicht
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="bg-orange-50/50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-600 text-sm font-medium mb-6 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Alle Märkte
          </Link>

          <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 px-6 sm:px-8 pt-8 pb-6 border-b border-orange-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-3">
                    <TypeBadge typ={markt.typ} size="md" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 leading-tight">
                    {markt.titel}
                  </h1>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-6">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium mb-0.5">Datum</p>
                    <p className="font-semibold text-stone-800 text-sm">
                      {formatDatum(markt.datum)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium mb-0.5">Uhrzeit</p>
                    <p className="font-semibold text-stone-800 text-sm">
                      {formatTime(markt.uhrzeit_start)} – {formatTime(markt.uhrzeit_ende)} Uhr
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl sm:col-span-2">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium mb-0.5">Adresse</p>
                    <p className="font-semibold text-stone-800 text-sm">
                      {markt.adresse}
                    </p>
                    <p className="text-stone-500 text-sm">{markt.stadt}</p>
                  </div>
                </div>

                {markt.kontakt && (
                  <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl sm:col-span-2">
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 font-medium mb-0.5">Kontakt</p>
                      <p className="font-semibold text-stone-800 text-sm">{markt.kontakt}</p>
                    </div>
                  </div>
                )}
              </div>

              {markt.beschreibung && (
                <div className="mb-6">
                  <h2 className="font-semibold text-stone-700 text-sm mb-2">Beschreibung</h2>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {markt.beschreibung}
                  </p>
                </div>
              )}

              <div className="h-52 sm:h-64 rounded-2xl overflow-hidden mb-6 border border-stone-100">
                <SmallMap lat={markt.lat} lng={markt.lng} titel={markt.titel} />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={buildGoogleMapsUrl(markt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm"
                >
                  <NavIcon size={16} />
                  Navigieren
                  <ExternalLink size={13} />
                </a>

                <button
                  onClick={handleCalendar}
                  className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Calendar size={16} />
                  In Kalender
                </button>

                <button
                  onClick={handleShare}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all border ${
                    shared
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  <Share2 size={16} />
                  {shared ? 'Kopiert!' : 'Teilen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
