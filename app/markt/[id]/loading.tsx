import Navigation from '@/components/Navigation';

export default function MarktLoading() {
  return (
    <>
      <Navigation />
      <div className="bg-orange-50/50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
          {/* Back link */}
          <div className="h-5 w-28 bg-stone-200 rounded mb-6" />

          <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 px-6 sm:px-8 pt-8 pb-6 border-b border-orange-100">
              <div className="h-6 w-24 bg-orange-100 rounded-full mb-3" />
              <div className="h-8 w-2/3 bg-stone-200 rounded-xl" />
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-4">
              {/* Info grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-4 bg-stone-50 rounded-xl ${i === 2 ? 'sm:col-span-2' : ''}`}
                  >
                    <div className="w-9 h-9 bg-stone-200 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-16 bg-stone-200 rounded" />
                      <div className="h-4 w-32 bg-stone-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Beschreibung */}
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-stone-100 rounded" />
                <div className="h-4 w-5/6 bg-stone-100 rounded" />
                <div className="h-4 w-4/6 bg-stone-100 rounded" />
              </div>

              {/* Map placeholder */}
              <div className="h-52 sm:h-64 bg-stone-100 rounded-2xl" />

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 h-12 bg-orange-100 rounded-xl" />
                <div className="flex-1 h-12 bg-stone-100 rounded-xl" />
                <div className="h-12 w-32 bg-stone-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
