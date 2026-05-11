import { ShieldCheck, UsersRound } from 'lucide-react';
import { ActiveUserPill } from '../components/ActiveUserPill';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { users } from '../data/mockData';
import { timeAgo } from '../utils/format';

export function UsersAccess() {
  return (
    <div className="page-stack">
      <PageHeader title="Users & Access" description="Manage approved bot users, category grants, active usage, last seen date and permission coverage." actions={<button className="primary-btn"><ShieldCheck size={16} /> Assign Permission</button>} />
      <div className="metric-grid">
        <MetricCard metric={{ label: 'Total users', value: users.length, change: 'dummy data', tone: 'neutral' }} />
        <MetricCard metric={{ label: 'Authorized', value: users.filter((u) => u.isAuthorized).length, change: 'approved by admin', tone: 'good' }} />
        <MetricCard metric={{ label: 'Active now', value: users.filter((u) => u.activeNow).length, change: 'recent activity', tone: 'good' }} />
        <MetricCard metric={{ label: 'No permissions', value: users.filter((u) => u.isAuthorized && u.permissions.length === 0).length, change: 'needs admin action', tone: 'warning' }} />
      </div>
      <section className="panel">
        <div className="panel-title"><UsersRound size={18} /> User access matrix</div>
        <DataTable
          columns={['User', 'Active', 'Status', 'Permissions', 'Messages', 'Last category', 'Last seen']}
          rows={users.map((user) => [
            <div><strong>{user.displayName}</strong><span className="table-subtitle">{user.email || 'No email'}</span></div>,
            <ActiveUserPill active={user.activeNow} />,
            <StatusBadge value={user.authorizationStatus} />,
            user.permissions.length ? user.permissions.map((p) => p.categoryName).join(', ') : 'No category assigned',
            (user.messageCount ?? 0).toLocaleString(),
            user.lastCategory ?? '—',
            timeAgo(user.lastSeenAt),
          ])}
        />
      </section>
    </div>
  );
}
