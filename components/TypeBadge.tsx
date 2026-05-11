import { FlohmarktTyp } from '@/lib/types';

const typeConfig: Record<FlohmarktTyp, { bg: string; text: string; dot: string }> = {
  Flohmarkt: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    dot: 'bg-orange-400',
  },
  Fetzenmarkt: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  Hausflohmarkt: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-400',
  },
  Antikmarkt: {
    bg: 'bg-stone-100',
    text: 'text-stone-600',
    dot: 'bg-stone-400',
  },
};

interface TypeBadgeProps {
  typ: FlohmarktTyp;
  size?: 'sm' | 'md';
}

const fallbackConfig = { bg: 'bg-stone-100', text: 'text-stone-600', dot: 'bg-stone-400' };

export default function TypeBadge({ typ, size = 'sm' }: TypeBadgeProps) {
  const config = typeConfig[typ] ?? fallbackConfig;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {typ ?? '–'}
    </span>
  );
}
