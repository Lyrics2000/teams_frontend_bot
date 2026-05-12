import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, CalendarDays, MessagesSquare, SearchCheck } from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { SearchBox } from '../components/SearchBox';
import { TimeRangeFilter } from '../components/TimeRangeFilter';
import { useAdminData } from '../state/AdminDataContext';
import type { TimeRange } from '../types/domain';

export function Analytics() {
  const [range, setRange] = useState<TimeRange>('30d');
  const [searchParams] = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') ?? '');
  const { overviewForRange } = useAdminData();
  const overview = useMemo(() => overviewForRange(range), [overviewForRange, range]);
  const totalSearches = overview.categoryVolumes.reduce((sum, item) => sum + item.messages, 0);
  const filteredReports = overview.dailyCategoryReports.filter((report) => report.category.toLowerCase().includes(categoryFilter.toLowerCase()));

  return (
    <div className="page-stack">
      <PageHeader
        title="Usage Analytics"
        description="Analyse bot demand by time, category, success rate, users, failed searches and response speed."
        actions={<TimeRangeFilter value={range} onChange={setRange} />}
      />

      <div className="metric-grid">
        <MetricCard metric={{ label: 'Searches/messages', value: totalSearches.toLocaleString(), change: 'category volume total', tone: 'neutral' }} />
        <MetricCard metric={{ label: 'Most asked category', value: overview.categoryVolumes[0].name, change: `${overview.categoryVolumes[0].messages} searches`, tone: 'good' }} />
        <MetricCard metric={{ label: 'Highest error category', value: [...overview.categoryVolumes].sort((a, b) => b.errors - a.errors)[0].name, change: 'needs review', tone: 'warning' }} />
        <MetricCard metric={{ label: 'Fastest category', value: [...overview.categoryVolumes].sort((a, b) => a.avgResponseSeconds - b.avgResponseSeconds)[0].name, change: 'best response time', tone: 'good' }} />
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Category trends over time" subtitle="Daily/monthly category questions depending on selected range">
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={overview.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="erp" name="ERP" fillOpacity={0.25} />
              <Area type="monotone" dataKey="api" name="API" fillOpacity={0.25} />
              <Area type="monotone" dataKey="payment" name="Payment" fillOpacity={0.25} />
              <Area type="monotone" dataKey="docker" name="Docker" fillOpacity={0.25} />
              <Area type="monotone" dataKey="general" name="General" fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category success vs errors" subtitle="Which categories need operational improvement">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={overview.categoryVolumes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="messages" name="Searches" />
              <Bar dataKey="errors" name="Failures" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Response time trend" subtitle="Use this to spot API/agent slowdown">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={overview.timeSeries.map((p, i) => ({ ...p, avgResponse: 6 + (i % 5) + Math.round(p.errors / 10) }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgResponse" name="Avg response seconds" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="panel">
          <div className="panel-title"><SearchCheck size={18} /> Category insights</div>
          <div className="insight-list">
            <div><MessagesSquare size={18} /><span>ERP Issue accounts for the highest number of bot questions and should have the most reliable agent monitoring.</span></div>
            <div><CalendarDays size={18} /><span>Daily category search reports help identify repeating issues by department and application.</span></div>
            <div><BarChart3 size={18} /><span>API Issue currently has the highest failure count, likely due to subscription-key or token issues.</span></div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="toolbar-row">
          <div className="panel-title"><CalendarDays size={18} /> Searches per category per day</div>
          <SearchBox value={categoryFilter} onChange={setCategoryFilter} placeholder="Filter by category..." />
        </div>
        <DataTable
          columns={['Date', 'Category', 'Searches', 'Successful', 'Failed', 'Unique users', 'Avg response']}
          rows={filteredReports.slice(0, 60).map((report) => [
            report.date,
            report.category,
            report.searches.toLocaleString(),
            report.successful.toLocaleString(),
            report.failed.toLocaleString(),
            report.uniqueUsers.toLocaleString(),
            `${report.avgResponseSeconds}s`,
          ])}
        />
      </section>
    </div>
  );
}
