'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function MarktError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[MarktError]', error);
  }, [error]);

  return (
    <>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-3">Fehler beim Laden</h2>
        <p className="text-stone-400 mb-8 leading-relaxed">
          Der Markt konnte nicht geladen werden. Bitte versuche es nochmal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <RefreshCw size={16} />
            Nochmal versuchen
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            Alle Märkte
          </Link>
        </div>
      </div>
    </>
  );
}
