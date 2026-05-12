import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MessageSquareText, UsersRound } from 'lucide-react';
import { ActiveUserPill } from '../components/ActiveUserPill';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { SearchBox } from '../components/SearchBox';
import { TimeRangeFilter } from '../components/TimeRangeFilter';
import { useAdminData } from '../state/AdminDataContext';
import type { TimeRange } from '../types/domain';
import { timeAgo } from '../utils/format';

export function ActiveUsage() {
  const [range, setRange] = useState<TimeRange>('30d');
  const [query, setQuery] = useState('');
  const { conversations, messages, overviewForRange } = useAdminData();
  const overview = useMemo(() => overviewForRange(range), [overviewForRange, range]);

  const filteredUsers = overview.activeUsers.filter((user) =>
    `${user.userName} ${user.email} ${user.topCategory}`.toLowerCase().includes(query.toLowerCase())
  );

  const activeConversations = conversations.filter((conversation) => conversation.activeNow);
  const recentIncoming = messages.filter((message) => message.direction === 'incoming').slice(0, 8);

  return (
    <div className="page-stack">
      <PageHeader
        title="Active Bot Usage"
        description="See who is actively using the bot, what they are asking, and which categories are driving demand."
        actions={<TimeRangeFilter value={range} onChange={setRange} />}
      />

      <div className="metric-grid">
        <MetricCard metric={{ label: 'Active now', value: overview.activeUsers.filter((u) => u.activeNow).length, change: 'live user window', tone: 'good' }} />
        <MetricCard metric={{ label: 'Active conversations', value: activeConversations.length, change: 'currently open', tone: 'neutral' }} />
        <MetricCard metric={{ label: 'Top user volume', value: overview.activeUsers[0]?.messages ?? 0, change: overview.activeUsers[0]?.userName, tone: 'good' }} />
        <MetricCard metric={{ label: 'Avg user response', value: '8.7s', change: 'across active users', tone: 'neutral' }} />
      </div>

      <div className="dashboard-grid">
        <ChartCard title="User activity trend" subtitle="Messages and unique users over selected period">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={overview.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="messages" name="Messages" />
              <Bar dataKey="uniqueUsers" name="Unique users" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="panel">
          <div className="panel-title"><MessageSquareText size={18} /> Recent searches/messages</div>
          <div className="stack-list compact">
            {recentIncoming.map((message) => (
              <div className="message-card" key={message.id}>
                <div className="message-meta"><strong>{message.userName}</strong><span>{message.category ?? 'Unclassified'} • {timeAgo(message.createdAt)}</span></div>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="toolbar-row">
          <div className="panel-title"><UsersRound size={18} /> User activity ranking</div>
          <SearchBox value={query} onChange={setQuery} placeholder="Search user, email or category..." />
        </div>
        <DataTable
          columns={['User', 'Active', 'Top category', 'Messages', 'Success rate', 'Avg response', 'Last seen']}
          rows={filteredUsers.map((user) => [
            <div><strong>{user.userName}</strong><span className="table-subtitle">{user.email}</span></div>,
            <ActiveUserPill active={user.activeNow} />,
            user.topCategory,
            user.messages.toLocaleString(),
            `${user.successRate}%`,
            `${user.avgResponseSeconds}s`,
            timeAgo(user.lastSeenAt),
          ])}
        />
      </section>
    </div>
  );
}
