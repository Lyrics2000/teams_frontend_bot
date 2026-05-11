import { Route, Routes } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Approvals } from './pages/Approvals';
import { UsersAccess } from './pages/UsersAccess';
import { Categories } from './pages/Categories';
import { Conversations } from './pages/Conversations';
import { Agents } from './pages/Agents';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { SettingsPage } from './pages/SettingsPage';
import { ActiveUsage } from './pages/ActiveUsage';

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/users" element={<UsersAccess />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/activity" element={<ActiveUsage />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
