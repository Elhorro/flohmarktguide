/**
 * Formats a single date or a date range for display.
 * Examples:
 *   formatDateRange('2026-05-12', null)        → "Di., 12. Mai"
 *   formatDateRange('2026-05-12', '2026-05-14')→ "12.–14. Mai"
 *   formatDateRange('2026-05-30', '2026-06-01')→ "30. Mai – 1. Juni"
 */
export function formatDateRange(
  start: string | null | undefined,
  end?: string | null,
  options: { withYear?: boolean; weekday?: boolean } = {},
): string {
  if (!start) return '–';
  const { withYear = false, weekday = true } = options;

  const sd = new Date(start + 'T00:00:00');
  const ed = end ? new Date(end + 'T00:00:00') : null;

  // No end date OR end date is same as start → single day
  if (!ed || ed.getTime() === sd.getTime()) {
    return sd.toLocaleDateString('de-AT', {
      weekday: weekday ? 'short' : undefined,
      day: 'numeric',
      month: 'short',
      year: withYear ? 'numeric' : undefined,
    });
  }

  // Multi-day, same month → "12.–14. Mai"
  if (sd.getMonth() === ed.getMonth() && sd.getFullYear() === ed.getFullYear()) {
    const month = sd.toLocaleDateString('de-AT', {
      month: 'short',
      year: withYear ? 'numeric' : undefined,
    });
    return `${sd.getDate()}.–${ed.getDate()}. ${month}`;
  }

  // Multi-day, different months → "30. Mai – 1. Juni"
  const fmt = (d: Date) =>
    d.toLocaleDateString('de-AT', {
      day: 'numeric',
      month: 'short',
      year: withYear ? 'numeric' : undefined,
    });
  return `${fmt(sd)} – ${fmt(ed)}`;
}

export function formatTime(time: string | null | undefined): string {
  return time?.slice(0, 5) ?? '--:--';
}
