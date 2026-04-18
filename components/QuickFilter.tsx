'use client';

import { FilterOption } from '@/lib/types';

interface QuickFilterProps {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
}

const filters: { value: FilterOption; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  { value: 'heute', label: 'Heute' },
  { value: 'wochenende', label: 'Wochenende' },
  { value: 'naechste_woche', label: 'Nächste Woche' },
];

export default function QuickFilter({ active, onChange }: QuickFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
            active === f.value
              ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
              : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
