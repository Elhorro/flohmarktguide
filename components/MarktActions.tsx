'use client';

import { useState } from 'react';
import { Calendar, Share2, Navigation as NavIcon, ExternalLink } from 'lucide-react';
import { Flohmarkt } from '@/lib/types';

function buildGoogleMapsUrl(markt: Flohmarkt): string {
  const q = encodeURIComponent(`${markt.address}, ${markt.location_name}, Austria`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function buildICSContent(markt: Flohmarkt): string {
  const [y, m, d] = (markt.date ?? '2000-01-01').split('-');
  const [sh, sm] = (markt.time_start ?? '00:00').split(':');
  const [eh, em] = (markt.time_end ?? '00:00').split(':');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${markt.title}`,
    `DTSTART:${y}${m}${d}T${sh}${sm}00`,
    `DTEND:${y}${m}${d}T${eh}${em}00`,
    `LOCATION:${markt.address ?? ''}, ${markt.location_name}`,
    `DESCRIPTION:${(markt.description ?? '').replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export default function MarktActions({ markt }: { markt: Flohmarkt }) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: markt.title,
          text: `${markt.title} in ${markt.location_name}`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleCalendar = () => {
    const blob = new Blob([buildICSContent(markt)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${markt.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
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
  );
}
