import { Download, FileText } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { dailyCategoryReports, reports } from '../data/mockData';
import { timeAgo } from '../utils/format';

export function Reports() {
  return (
    <div className="page-stack">
      <PageHeader title="Reports" description="Management and operational reports for approvals, activity, category searches, agent health and ERP diagnosis outcomes." actions={<button className="primary-btn"><FileText size={16} /> Create Report</button>} />
      <div className="metric-grid">
        <MetricCard metric={{ label: 'Available reports', value: reports.length, change: 'ready templates', tone: 'neutral' }} />
        <MetricCard metric={{ label: 'Ready', value: reports.filter((r) => r.status === 'ready').length, change: 'downloadable', tone: 'good' }} />
        <MetricCard metric={{ label: 'Scheduled', value: reports.filter((r) => r.status === 'scheduled').length, change: 'automatic', tone: 'neutral' }} />
        <MetricCard metric={{ label: 'Needs review', value: reports.filter((r) => r.status === 'needs-review').length, change: 'admin attention', tone: 'warning' }} />
      </div>
      <section className="panel">
        <div className="panel-title"><FileText size={18} /> Report catalogue</div>
        <DataTable
          columns={['Report', 'Owner', 'Frequency', 'Last generated', 'Status', 'Action']}
          rows={reports.map((report) => [
            <div><strong>{report.title}</strong><span className="table-subtitle">{report.description}</span></div>,
            report.owner,
            report.frequency,
            timeAgo(report.lastGeneratedAt),
            <StatusBadge value={report.status} />,
            <button className="secondary-btn"><Download size={15} /> Download</button>,
          ])}
        />
      </section>
      <section className="panel">
        <div className="panel-title"><FileText size={18} /> Sample daily category report</div>
        <DataTable
          columns={['Date', 'Category', 'Searches', 'Successful', 'Failed', 'Unique users', 'Avg response']}
          rows={dailyCategoryReports.slice(0, 20).map((report) => [report.date, report.category, report.searches, report.successful, report.failed, report.uniqueUsers, `${report.avgResponseSeconds}s`])}
        />
      </section>
    </div>
  );
}
