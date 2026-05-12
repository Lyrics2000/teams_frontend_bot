import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, AlertTriangle, Bot, CheckCircle2, MessageSquareText, ShieldCheck, UsersRound } from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { TimeRangeFilter } from '../components/TimeRangeFilter';
import { useAdminData } from '../state/AdminDataContext';
import type { TimeRange } from '../types/domain';
import { timeAgo } from '../utils/format';

export function Dashboard() {
  const [range, setRange] = useState<TimeRange>('30d');
  const navigate = useNavigate();
  const { overviewForRange } = useAdminData();
  const overview = useMemo(() => overviewForRange(range), [overviewForRange, range]);

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
        <button onClick={() => navigate('/activity')}><Activity size={18} /><span>{activeNow} users active now</span></button>
        <button onClick={() => navigate('/analytics')}><MessageSquareText size={18} /><span>{topCategory.name} is the most asked category</span></button>
        <button onClick={() => navigate('/agents')}><Bot size={18} /><span>{overview.agents.filter((a) => a.status === 'healthy').length}/{overview.agents.length} agents healthy</span></button>
        <button onClick={() => navigate('/approvals')}><ShieldCheck size={18} /><span>{overview.pendingUsers.length} approvals waiting</span></button>
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
              <button className="list-row button-row" key={user.userId} onClick={() => navigate(`/users?user=${user.userId}`)}>
                <div>
                  <strong>{user.userName}</strong>
                  <span>{user.topCategory} • {timeAgo(user.lastSeenAt)}</span>
                </div>
                <b>{user.messages}</b>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title"><AlertTriangle size={18} /> Categories needing attention</div>
          <div className="stack-list">
            {overview.categoryVolumes.sort((a, b) => b.errors - a.errors).slice(0, 5).map((category) => (
              <button className="list-row button-row" key={category.name} onClick={() => navigate(`/analytics?category=${encodeURIComponent(category.name)}`)}>
                <div>
                  <strong>{category.name}</strong>
                  <span>{category.errors} failed checks • {category.successRate}% success</span>
                </div>
                <StatusBadge value={category.errors > 5 ? 'warning' : 'healthy'} />
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title"><CheckCircle2 size={18} /> Agent health</div>
          <div className="stack-list">
            {overview.agents.map((agent) => (
              <button className="list-row button-row" key={agent.id} onClick={() => navigate('/agents')}>
                <div>
                  <strong>{agent.name}</strong>
                  <span>{agent.requestsToday} requests today • {agent.avgLatencyMs}ms avg</span>
                </div>
                <StatusBadge value={agent.status} />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
