import { useState } from 'react';
import { Download, FileText, Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useAdminData } from '../state/AdminDataContext';
import { timeAgo } from '../utils/format';

export function Reports() {
  const { reports, dailyCategoryReports, createReport, downloadReport } = useAdminData();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', owner: 'Admin', frequency: 'On demand' });

  const submit = () => {
    createReport({ ...form, status: 'ready' });
    setShowCreate(false);
    setForm({ title: '', description: '', owner: 'Admin', frequency: 'On demand' });
  };

  return (
    <div className="page-stack">
      <PageHeader title="Reports" description="Management and operational reports for approvals, activity, category searches, agent health and ERP diagnosis outcomes." actions={<button className="primary-btn" onClick={() => setShowCreate(true)}><FileText size={16} /> Create Report</button>} />
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
            <button className="secondary-btn" onClick={() => downloadReport(report.id)}><Download size={15} /> Download</button>,
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

      {showCreate ? (
        <Modal title="Create report" description="Create an on-demand or scheduled report template." onClose={() => setShowCreate(false)}>
          <div className="form-grid">
            <label className="input-card"><span>Title</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Monthly Bot Activity Report" /></label>
            <label className="input-card"><span>Owner</span><input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} /></label>
            <label className="input-card"><span>Frequency</span><select value={form.frequency} onChange={(event) => setForm({ ...form, frequency: event.target.value })}><option>On demand</option><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label>
            <label className="input-card wide-field"><span>Description</span><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={4} /></label>
          </div>
          <div className="modal-actions">
            <button className="primary-btn" onClick={submit}><Plus size={16} /> Save Report</button>
            <button className="secondary-btn" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
