'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <>
      <Navigation />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-3">Etwas ist schiefgelaufen</h2>
          <p className="text-stone-400 mb-8 leading-relaxed">
            Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es nochmal oder geh zurück zur Startseite.
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
              Zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
