import Link from 'next/link';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Flohmarkt } from '@/lib/types';
import TypeBadge from './TypeBadge';

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

interface MarktCardProps {
  markt: Flohmarkt;
  compact?: boolean;
}

export default function MarktCard({ markt, compact = false }: MarktCardProps) {
  return (
    <Link
      href={`/markt/${markt.id}`}
      className={`group block bg-white rounded-2xl border border-stone-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <TypeBadge typ={markt.typ} />
          </div>
          <h3
            className={`font-semibold text-stone-800 group-hover:text-orange-600 transition-colors leading-snug ${
              compact ? 'text-sm' : 'text-base'
            }`}
          >
            {markt.titel}
          </h3>

          <div className={`mt-2 space-y-1 ${compact ? 'text-xs' : 'text-sm'}`}>
            <div className="flex items-center gap-1.5 text-stone-500">
              <Calendar size={compact ? 12 : 13} className="shrink-0 text-orange-400" />
              <span>{formatDatum(markt.datum)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500">
              <Clock size={compact ? 12 : 13} className="shrink-0 text-orange-400" />
              <span>
                {formatTime(markt.uhrzeit_start)} – {formatTime(markt.uhrzeit_ende)} Uhr
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500">
              <MapPin size={compact ? 12 : 13} className="shrink-0 text-orange-400" />
              <span className="truncate">
                {markt.adresse}, {markt.stadt}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
            <ChevronRight size={16} className="text-orange-400 group-hover:text-orange-600 transition-colors" />
          </div>
        </div>
      </div>

      {!compact && markt.beschreibung && (
        <p className="mt-3 text-sm text-stone-400 line-clamp-2 leading-relaxed">
          {markt.beschreibung}
        </p>
      )}
    </Link>
  );
}
