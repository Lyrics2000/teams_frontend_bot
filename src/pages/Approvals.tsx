import { CheckCircle2, UserCheck, XCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { users } from '../data/mockData';
import { timeAgo } from '../utils/format';

export function Approvals() {
  const pending = users.filter((user) => user.authorizationStatus === 'pending');
  return (
    <div className="page-stack">
      <PageHeader title="Approval Center" description="Approve Teams/Copilot users discovered by the bot, then assign category permissions in the access module." actions={<button className="primary-btn"><UserCheck size={16} /> Bulk Review</button>} />
      <div className="metric-grid">
        <MetricCard metric={{ label: 'Pending approvals', value: pending.length, change: 'waiting for admin', tone: 'warning' }} />
        <MetricCard metric={{ label: 'Approved users', value: users.filter((u) => u.isAuthorized).length, change: 'can use bot categories', tone: 'good' }} />
        <MetricCard metric={{ label: 'Rejected/Suspended', value: users.filter((u) => ['rejected', 'suspended'].includes(u.authorizationStatus)).length, change: 'blocked from bot', tone: 'danger' }} />
        <MetricCard metric={{ label: 'Active pending users', value: pending.filter((u) => u.activeNow).length, change: 'still trying to use bot', tone: 'warning' }} />
      </div>
      <section className="panel">
        <div className="panel-title"><UserCheck size={18} /> Pending user approvals</div>
        <DataTable
          columns={['User', 'Status', 'Discovered', 'Last seen', 'Requested category', 'Actions']}
          rows={pending.map((user) => [
            <div><strong>{user.displayName}</strong><span className="table-subtitle">{user.email || 'No email'} • {user.teamsUserId}</span></div>,
            <StatusBadge value={user.authorizationStatus} />,
            timeAgo(user.createdAt),
            timeAgo(user.lastSeenAt),
            user.lastCategory || 'Not classified',
            <div className="actions-inline"><button className="secondary-btn"><CheckCircle2 size={15} /> Approve</button><button className="danger-btn"><XCircle size={15} /> Reject</button></div>,
          ])}
        />
      </section>
    </div>
  );
}
