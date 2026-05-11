import { NavLink, Outlet } from 'react-router-dom';
import { Activity, BarChart3, Bot, ClipboardCheck, FileText, Gauge, LayoutDashboard, MessageSquareText, Settings, ShieldCheck, UsersRound } from 'lucide-react';

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
          <strong>Mock data mode</strong>
          <p>Dashboards are using dummy data. Flip VITE_USE_MOCKS=false later to consume Django APIs.</p>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
