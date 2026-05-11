import { Bot, ShieldCheck } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { categories } from '../data/mockData';

export function Categories() {
  const top = [...categories].sort((a, b) => b.totalMessages - a.totalMessages)[0];
  return (
    <div className="page-stack">
      <PageHeader title="Permission Categories" description="Configure support categories, agents, agent locations and permission assignment rules." actions={<button className="primary-btn"><ShieldCheck size={16} /> New Category</button>} />
      <div className="metric-grid">
        <MetricCard metric={{ label: 'Active categories', value: categories.filter((c) => c.isActive).length, change: 'available for routing', tone: 'good' }} />
        <MetricCard metric={{ label: 'Most asked', value: top.name, change: `${top.totalMessages} messages`, tone: 'good' }} />
        <MetricCard metric={{ label: 'Without agent URL', value: categories.filter((c) => !c.agentLocation).length, change: 'needs setup', tone: 'warning' }} />
        <MetricCard metric={{ label: 'Avg success', value: `${Math.round(categories.reduce((s, c) => s + c.successRate, 0) / categories.length)}%`, change: 'across categories', tone: 'good' }} />
      </div>
      <section className="panel">
        <div className="panel-title"><Bot size={18} /> Category routing setup</div>
        <DataTable
          columns={['Category', 'Agent', 'Agent location', 'Users', 'Messages today', 'Success', 'Status']}
          rows={categories.map((category) => [
            <div><strong>{category.name}</strong><span className="table-subtitle">{category.description}</span></div>,
            category.agent,
            category.agentLocation || 'Not configured',
            category.totalUsers,
            category.messagesToday ?? 0,
            `${category.successRate}%`,
            <StatusBadge value={category.isActive ? 'healthy' : 'suspended'} />,
          ])}
        />
      </section>
    </div>
  );
}
