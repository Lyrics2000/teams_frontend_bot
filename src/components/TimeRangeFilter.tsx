import type { TimeRange } from '../types/domain';

const ranges: { label: string; value: TimeRange }[] = [
  { label: 'Today', value: 'today' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '12 months', value: '12m' },
  { label: 'Year', value: 'year' },
];

export function TimeRangeFilter({ value, onChange }: { value: TimeRange; onChange: (value: TimeRange) => void }) {
  return (
    <div className="range-filter">
      {ranges.map((range) => (
        <button
          key={range.value}
          className={value === range.value ? 'active' : ''}
          onClick={() => onChange(range.value)}
          type="button"
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
