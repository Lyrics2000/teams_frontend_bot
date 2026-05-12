import { useMemo, useState } from 'react';
import { Search, ShieldCheck, UserCheck, UserX, UsersRound } from 'lucide-react';
import { ActiveUserPill } from '../components/ActiveUserPill';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { SearchBox } from '../components/SearchBox';
import { StatusBadge } from '../components/StatusBadge';
import { useAdminData } from '../state/AdminDataContext';
import type { BotUser } from '../types/domain';
import { timeAgo } from '../utils/format';

export function UsersAccess() {
  const { users, categories, approveUser, suspendUser, restoreUser, grantPermission, revokePermission } = useAdminData();
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<BotUser | null>(null);
  const [permissionUserId, setPermissionUserId] = useState<number>(users.find((u) => u.isAuthorized)?.id ?? users[0]?.id ?? 0);
  const [permissionCategoryId, setPermissionCategoryId] = useState<number>(categories[0]?.id ?? 0);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const filteredUsers = useMemo(() => users.filter((user) => `${user.displayName} ${user.email} ${user.authorizationStatus} ${user.lastCategory}`.toLowerCase().includes(query.toLowerCase())), [query, users]);

  const openGrant = (user: BotUser) => {
    setPermissionUserId(user.id);
    setPermissionCategoryId(categories.find((category) => !user.permissions.some((permission) => permission.categoryId === category.id))?.id ?? categories[0]?.id ?? 0);
    setShowPermissionModal(true);
  };

  const handleGrant = () => {
    grantPermission(permissionUserId, permissionCategoryId);
    setShowPermissionModal(false);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Users & Access"
        description="Manage approved bot users, category grants, active usage, last seen date and permission coverage."
        actions={<button className="primary-btn" onClick={() => setShowPermissionModal(true)}><ShieldCheck size={16} /> Assign Permission</button>}
      />

      <div className="metric-grid">
        <MetricCard metric={{ label: 'Total users', value: users.length, change: 'registered in bot admin', tone: 'neutral' }} />
        <MetricCard metric={{ label: 'Authorized', value: users.filter((u) => u.isAuthorized).length, change: 'approved by admin', tone: 'good' }} />
        <MetricCard metric={{ label: 'Active now', value: users.filter((u) => u.activeNow).length, change: 'recent activity', tone: 'good' }} />
        <MetricCard metric={{ label: 'No permissions', value: users.filter((u) => u.isAuthorized && u.permissions.length === 0).length, change: 'needs admin action', tone: 'warning' }} />
      </div>

      <section className="panel">
        <div className="toolbar-row">
          <div className="panel-title"><UsersRound size={18} /> User access matrix</div>
          <SearchBox value={query} onChange={setQuery} placeholder="Search users, status or category..." />
        </div>
        <DataTable
          columns={['User', 'Active', 'Status', 'Permissions', 'Messages', 'Last category', 'Last seen', 'Actions']}
          rows={filteredUsers.map((user) => [
            <button className="link-button" onClick={() => setSelectedUser(user)}><strong>{user.displayName}</strong><span className="table-subtitle">{user.email || 'No email'}</span></button>,
            <ActiveUserPill active={user.activeNow} />,
            <StatusBadge value={user.authorizationStatus} />,
            <div className="permission-list">
              {user.permissions.length ? user.permissions.map((permission) => (
                <span key={permission.id} className="permission-chip">
                  {permission.categoryName}
                  <button onClick={() => revokePermission(user.id, permission.categoryId)} aria-label={`Remove ${permission.categoryName}`}>×</button>
                </span>
              )) : <span className="muted-text">No category assigned</span>}
            </div>,
            (user.messageCount ?? 0).toLocaleString(),
            user.lastCategory ?? '—',
            timeAgo(user.lastSeenAt),
            <div className="actions-inline">
              <button className="secondary-btn" onClick={() => openGrant(user)}><ShieldCheck size={15} /> Grant</button>
              {!user.isAuthorized ? <button className="secondary-btn" onClick={() => restoreUser(user.id)}><UserCheck size={15} /> Approve</button> : null}
              {user.isAuthorized ? <button className="danger-btn" onClick={() => suspendUser(user.id)}><UserX size={15} /> Suspend</button> : null}
            </div>,
          ])}
          empty="No users match your search."
        />
      </section>

      {showPermissionModal ? (
        <Modal title="Assign category permission" description="Grant one support category to a user. This will later call the Django permission API." onClose={() => setShowPermissionModal(false)}>
          <div className="form-grid">
            <label className="input-card">
              <span>User</span>
              <select value={permissionUserId} onChange={(event) => setPermissionUserId(Number(event.target.value))}>
                {users.map((user) => <option key={user.id} value={user.id}>{user.displayName} — {user.authorizationStatus}</option>)}
              </select>
            </label>
            <label className="input-card">
              <span>Category</span>
              <select value={permissionCategoryId} onChange={(event) => setPermissionCategoryId(Number(event.target.value))}>
                {categories.filter((category) => category.isActive).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
          </div>
          <div className="modal-actions">
            <button className="primary-btn" onClick={handleGrant}><ShieldCheck size={16} /> Grant Permission</button>
            <button className="secondary-btn" onClick={() => setShowPermissionModal(false)}>Cancel</button>
          </div>
        </Modal>
      ) : null}

      {selectedUser ? (
        <Modal title={selectedUser.displayName} description="User activity, approval status and category permissions." onClose={() => setSelectedUser(null)}>
          <div className="detail-grid">
            <div><span>Status</span><strong><StatusBadge value={selectedUser.authorizationStatus} /></strong></div>
            <div><span>Active now</span><strong><ActiveUserPill active={selectedUser.activeNow} /></strong></div>
            <div><span>Messages</span><strong>{selectedUser.messageCount ?? 0}</strong></div>
            <div><span>Last seen</span><strong>{timeAgo(selectedUser.lastSeenAt)}</strong></div>
            <div><span>Top category</span><strong>{selectedUser.lastCategory ?? '—'}</strong></div>
            <div><span>Failed requests</span><strong>{selectedUser.failedRequests ?? 0}</strong></div>
          </div>
          <div className="modal-actions">
            <button className="secondary-btn" onClick={() => openGrant(selectedUser)}><Search size={16} /> Add Permission</button>
            {selectedUser.isAuthorized ? <button className="danger-btn" onClick={() => { suspendUser(selectedUser.id); setSelectedUser(null); }}>Suspend</button> : <button className="primary-btn" onClick={() => { approveUser(selectedUser.id); setSelectedUser(null); }}>Approve</button>}
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
