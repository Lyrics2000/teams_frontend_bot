const variants: Record<string, string> = {
  authorized: 'good',
  pending: 'warning',
  rejected: 'danger',
  suspended: 'neutral',
  healthy: 'good',
  degraded: 'warning',
  down: 'danger',
  ready: 'good',
  scheduled: 'info',
  'needs-review': 'warning',
};

export function StatusBadge({ value }: { value: string }) {
  return <span className={`badge ${variants[value] || 'neutral'}`}>{value.split('-').join(' ')}</span>;
}
