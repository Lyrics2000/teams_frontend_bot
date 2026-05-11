import { formatDistanceToNow } from 'date-fns';

export function shortDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-KE', { month: 'short', day: '2-digit', year: 'numeric' });
}

export function shortDateTime(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-KE', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(value?: string) {
  if (!value) return '—';
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function percent(value: number) {
  return `${value.toFixed(value % 1 ? 1 : 0)}%`;
}

export function number(value: number) {
  return value.toLocaleString('en-KE');
}

export function secondsFromMs(ms?: number) {
  if (!ms) return '—';
  return `${(ms / 1000).toFixed(1)}s`;
}
