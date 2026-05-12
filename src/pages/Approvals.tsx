import { useMemo, useState } from 'react';
import { CheckCircle2, UserCheck, XCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useAdminData } from '../state/AdminDataContext';
import { timeAgo } from '../utils/format';

export function Approvals() {
  const { users, approveUser, rejectUser, bulkApprovePending, bulkRejectPending } = useAdminData();
  const [showBulk, setShowBulk] = useState(false);
  const pending = useMemo(() => users.filter((user) => user.authorizationStatus === 'pending'), [users]);

  return (
    <div className="page-stack">
      <PageHeader
        title="Approval Center"
        description="Approve Teams/Copilot users discovered by the bot, then assign category permissions in the access module."
        actions={<button className="primary-btn" onClick={() => setShowBulk(true)}><UserCheck size={16} /> Bulk Review</button>}
      />

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
            <div className="actions-inline">
              <button className="secondary-btn" onClick={() => approveUser(user.id)}><CheckCircle2 size={15} /> Approve</button>
              <button className="danger-btn" onClick={() => rejectUser(user.id)}><XCircle size={15} /> Reject</button>
            </div>,
          ])}
          empty="No users are waiting for approval."
        />
      </section>

      <section className="panel">
        <div className="panel-title"><UserCheck size={18} /> Full approval history</div>
        <DataTable
          columns={['User', 'Status', 'Authorized', 'Last seen', 'Messages', 'Action']}
          rows={users.map((user) => [
            <div><strong>{user.displayName}</strong><span className="table-subtitle">{user.email || user.teamsUserId}</span></div>,
            <StatusBadge value={user.authorizationStatus} />,
            user.isAuthorized ? 'Yes' : 'No',
            timeAgo(user.lastSeenAt),
            user.messageCount ?? 0,
            user.authorizationStatus === 'pending'
              ? <button className="secondary-btn" onClick={() => approveUser(user.id)}>Approve</button>
              : user.authorizationStatus === 'authorized'
                ? <button className="danger-btn" onClick={() => rejectUser(user.id)}>Reject</button>
                : <button className="secondary-btn" onClick={() => approveUser(user.id)}>Re-approve</button>,
          ])}
        />
      </section>

      {showBulk ? (
        <Modal title="Bulk review pending users" description="Apply one action to all users waiting for admin approval." onClose={() => setShowBulk(false)}>
          <div className="confirm-box">
            <p><strong>{pending.length}</strong> users are currently waiting for approval.</p>
            <div className="actions-inline">
              <button className="primary-btn" onClick={() => { bulkApprovePending(); setShowBulk(false); }}><CheckCircle2 size={16} /> Approve all pending</button>
              <button className="danger-btn" onClick={() => { bulkRejectPending(); setShowBulk(false); }}><XCircle size={16} /> Reject all pending</button>
              <button className="secondary-btn" onClick={() => setShowBulk(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
