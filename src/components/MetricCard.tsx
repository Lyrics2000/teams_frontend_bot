import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { MetricItem } from '../types/domain';

export function MetricCard({ metric }: { metric: MetricItem }) {
  const Icon = metric.trend === 'up' ? ArrowUpRight : metric.trend === 'down' ? ArrowDownRight : ArrowRight;
  const tone = metric.tone === 'danger' ? 'danger' : metric.tone === 'warning' ? 'warning' : metric.tone === 'good' ? 'good' : 'neutral';
  return (
    <div className="stat-card">
      <div className="stat-top">
        <p>{metric.label}</p>
        <span className={`stat-icon ${tone}`}><Icon size={16} /></span>
      </div>
      <div className="stat-value">{metric.value}</div>
      <div className="stat-change">{metric.change}</div>
    </div>
  );
}
