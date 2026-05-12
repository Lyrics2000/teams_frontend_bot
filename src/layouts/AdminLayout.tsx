import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ToastStack } from '../components/ToastStack';
import { Activity, BarChart3, Bot, ClipboardCheck, FileText, Gauge, LayoutDashboard, LogOut, MessageSquareText, Settings, ShieldCheck, UsersRound } from 'lucide-react';

import { getStoredAdminUser, logoutAdmin, USE_MOCKS } from '../services/api';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/approvals', label: 'Approvals', icon: ClipboardCheck },
  { to: '/users', label: 'Users & Access', icon: UsersRound },
  { to: '/categories', label: 'Categories', icon: ShieldCheck },
  { to: '/activity', label: 'Active Usage', icon: Activity },
  { to: '/conversations', label: 'Messages', icon: MessageSquareText },
  { to: '/agents', label: 'Agents', icon: Bot },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const adminUser = getStoredAdminUser();
  const logout = () => { logoutAdmin(); window.location.href = '/'; };

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Gauge size={24} /></div>
          <div>
            <strong>Britam Bot Admin</strong>
            <span>Teams AI Control Centre</span>
          </div>
        </div>
        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-card">
          <strong>{USE_MOCKS ? 'Mock data mode' : 'Live API mode'}</strong>
          <p>{USE_MOCKS ? 'Dashboards are using dummy data.' : `Signed in as ${adminUser?.username || 'admin'}. Changes are saved to Django.`}</p>
          <button className="logout-btn" onClick={logout}><LogOut size={15} /> Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
        <ToastStack />
      </main>
    </div>
  );
}
