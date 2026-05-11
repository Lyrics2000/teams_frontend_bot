import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, AlertTriangle, Bot, CheckCircle2, MessageSquareText, ShieldCheck, UsersRound } from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { TimeRangeFilter } from '../components/TimeRangeFilter';
import { getOverview } from '../data/mockData';
import type { TimeRange } from '../types/domain';
import { timeAgo } from '../utils/format';

export function Dashboard() {
  const [range, setRange] = useState<TimeRange>('30d');
  const overview = useMemo(() => getOverview(range), [range]);

  const topCategory = [...overview.categoryVolumes].sort((a, b) => b.messages - a.messages)[0];
  const activeNow = overview.activeUsers.filter((user) => user.activeNow).length;

  return (
    <div className="page-stack">
      <PageHeader
        title="Bot Admin Dashboard"
        description="Approval control, live bot usage, category demand, agent health and operational performance."
        actions={<TimeRangeFilter value={range} onChange={setRange} />}
      />

      <div className="insight-strip">
        <div><Activity size={18} /><span>{activeNow} users active now</span></div>
        <div><MessageSquareText size={18} /><span>{topCategory.name} is the most asked category</span></div>
        <div><Bot size={18} /><span>{overview.agents.filter((a) => a.status === 'healthy').length}/{overview.agents.length} agents healthy</span></div>
        <div><ShieldCheck size={18} /><span>{overview.pendingUsers.length} approvals waiting</span></div>
      </div>

      <div className="metric-grid wide">
        {overview.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Bot searches and unique users" subtitle="Track usage by selected time window">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={overview.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="messages" name="Messages/Searches" fillOpacity={0.25} />
              <Area type="monotone" dataKey="uniqueUsers" name="Unique users" fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most questioned categories" subtitle="Which support areas users ask about most">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={overview.categoryVolumes} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={110} />
              <Tooltip />
              <Bar dataKey="messages" name="Messages" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="three-grid">
        <section className="panel">
          <div className="panel-title"><UsersRound size={18} /> Most active users</div>
          <div className="stack-list">
            {overview.activeUsers.slice(0, 5).map((user) => (
              <div className="list-row" key={user.userId}>
                <div>
                  <strong>{user.userName}</strong>
                  <span>{user.topCategory} • {timeAgo(user.lastSeenAt)}</span>
                </div>
                <b>{user.messages}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title"><AlertTriangle size={18} /> Categories needing attention</div>
          <div className="stack-list">
            {overview.categoryVolumes.sort((a, b) => b.errors - a.errors).slice(0, 5).map((category) => (
              <div className="list-row" key={category.name}>
                <div>
                  <strong>{category.name}</strong>
                  <span>{category.errors} failed checks • {category.successRate}% success</span>
                </div>
                <StatusBadge value={category.errors > 5 ? 'warning' : 'healthy'} />
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title"><CheckCircle2 size={18} /> Agent health</div>
          <div className="stack-list">
            {overview.agents.map((agent) => (
              <div className="list-row" key={agent.id}>
                <div>
                  <strong>{agent.name}</strong>
                  <span>{agent.requestsToday} requests today • {agent.avgLatencyMs}ms avg</span>
                </div>
                <StatusBadge value={agent.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
