import Navigation from '@/components/Navigation';

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-20 bg-stone-100 rounded-full" />
          <div className="h-5 w-3/4 bg-stone-100 rounded-lg" />
          <div className="space-y-1.5 mt-3">
            <div className="h-4 w-40 bg-stone-100 rounded" />
            <div className="h-4 w-32 bg-stone-100 rounded" />
            <div className="h-4 w-48 bg-stone-100 rounded" />
          </div>
        </div>
        <div className="w-8 h-8 bg-stone-100 rounded-full shrink-0" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-24 bg-stone-100 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </main>
    </>
  );
}
