import { Activity, Bot } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { agents } from '../data/mockData';
import { timeAgo } from '../utils/format';

export function Agents() {
  return (
    <div className="page-stack">
      <PageHeader title="Agent Health" description="Monitor each category agent, APIM/webhook URL health, request volume, errors and latency." actions={<button className="primary-btn"><Activity size={16} /> Run Health Check</button>} />
      <div className="metric-grid">
        <MetricCard metric={{ label: 'Configured agents', value: agents.length, change: 'category endpoints', tone: 'neutral' }} />
        <MetricCard metric={{ label: 'Healthy', value: agents.filter((a) => a.status === 'healthy').length, change: 'passing checks', tone: 'good' }} />
        <MetricCard metric={{ label: 'Degraded/down', value: agents.filter((a) => a.status !== 'healthy').length, change: 'needs attention', tone: 'warning' }} />
        <MetricCard metric={{ label: 'Requests today', value: agents.reduce((s, a) => s + a.requestsToday, 0), change: 'agent calls', tone: 'neutral' }} />
      </div>
      <section className="panel">
        <div className="panel-title"><Bot size={18} /> Agent endpoint performance</div>
        <DataTable
          columns={['Agent', 'Category', 'Status', 'Uptime', 'Requests today', 'Errors today', 'Avg latency', 'Last checked']}
          rows={agents.map((agent) => [
            <div><strong>{agent.name}</strong><span className="table-subtitle">{agent.location}</span></div>,
            agent.categoryName,
            <StatusBadge value={agent.status} />,
            `${agent.uptime}%`,
            agent.requestsToday,
            agent.errorsToday,
            `${agent.avgLatencyMs}ms`,
            timeAgo(agent.lastCheckedAt),
          ])}
        />
      </section>
    </div>
  );
}
