import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Calendar, Clock, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import TypeBadge from '@/components/TypeBadge';
import MarktActions from '@/components/MarktActions';
import { getFlohmarktById } from '@/lib/data';
import { Flohmarkt } from '@/lib/types';

const SmallMap = dynamic(() => import('@/components/map/SmallMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-stone-100 animate-pulse rounded-xl" />,
});

interface Props {
  params: { id: string };
}

function formatDatum(datum: string): string {
  return new Date(datum + 'T00:00:00').toLocaleDateString('de-AT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

export default async function MarktDetailPage({ params }: Props) {
  const markt: Flohmarkt | null = await getFlohmarktById(params.id);

  if (!markt) notFound();

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
              <div className="mb-3">
                <TypeBadge typ={markt.typ} size="md" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 leading-tight">
                {markt.titel}
              </h1>
            </div>

            <div className="px-6 sm:px-8 py-6">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium mb-0.5">Datum</p>
                    <p className="font-semibold text-stone-800 text-sm">{formatDatum(markt.datum)}</p>
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
                    <p className="font-semibold text-stone-800 text-sm">{markt.adresse}</p>
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
                  <p className="text-stone-600 leading-relaxed text-sm">{markt.beschreibung}</p>
                </div>
              )}

              <div className="h-52 sm:h-64 rounded-2xl overflow-hidden mb-6 border border-stone-100">
                <SmallMap lat={markt.lat} lng={markt.lng} titel={markt.titel} />
              </div>

              <MarktActions markt={markt} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
