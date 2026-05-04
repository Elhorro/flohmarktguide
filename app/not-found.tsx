import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <MapPin size={36} className="text-orange-400" />
          </div>
          <h1 className="text-6xl font-bold text-stone-200 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-stone-800 mb-3">Seite nicht gefunden</h2>
          <p className="text-stone-400 mb-8 leading-relaxed">
            Diese Seite existiert nicht. Vielleicht wurde sie verschoben oder der Link ist falsch.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Zur Startseite
          </Link>
        </div>
      </div>
    </>
  );
}
