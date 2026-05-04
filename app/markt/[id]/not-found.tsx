import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function MarktNotFound() {
  return (
    <>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <MapPin size={32} className="text-stone-400" />
        </div>
        <h1 className="text-2xl font-bold text-stone-800 mb-3">Markt nicht gefunden</h1>
        <p className="text-stone-400 mb-8 leading-relaxed">
          Dieser Flohmarkt existiert nicht oder wurde entfernt.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <ArrowLeft size={18} />
          Zurück zur Übersicht
        </Link>
      </div>
    </>
  );
}
