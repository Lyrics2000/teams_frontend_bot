import { useState } from 'react';
import { RotateCcw, Save, Settings } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useAdminData } from '../state/AdminDataContext';

export function SettingsPage() {
  const { resetDemoData } = useAdminData();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    botSecret: import.meta.env.VITE_BOT_SECRET || 'dev-bot-secret',
    useMocks: String(import.meta.env.VITE_USE_MOCKS ?? 'true'),
    refreshInterval: '60',
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Settings"
        description="Prepare environment settings for switching from dummy data to real Django admin APIs."
        actions={<div className="actions-inline"><button className="secondary-btn" onClick={resetDemoData}><RotateCcw size={16} /> Reset Demo Data</button><button className="primary-btn" onClick={() => setSaved(true)}><Save size={16} /> Save Settings</button></div>}
      />
      {saved ? <div className="notice success">Settings saved in this browser session. For deployment, copy these values into your .env file.</div> : null}
      <section className="panel">
        <div className="panel-title"><Settings size={18} /> API connection</div>
        <div className="form-grid">
          <label className="input-card"><span>API Base URL</span><input value={form.apiBaseUrl} onChange={(event) => setForm({ ...form, apiBaseUrl: event.target.value })} /></label>
          <label className="input-card"><span>Bot Secret Header</span><input value={form.botSecret} onChange={(event) => setForm({ ...form, botSecret: event.target.value })} /></label>
          <label className="input-card"><span>Use mocks</span><select value={form.useMocks} onChange={(event) => setForm({ ...form, useMocks: event.target.value })}><option value="true">true</option><option value="false">false</option></select></label>
          <label className="input-card"><span>Refresh interval</span><select value={form.refreshInterval} onChange={(event) => setForm({ ...form, refreshInterval: event.target.value })}><option value="30">30 seconds</option><option value="60">60 seconds</option><option value="300">5 minutes</option></select></label>
        </div>
      </section>
      <section className="panel">
        <div className="panel-title">Future Django endpoints expected</div>
        <div className="insight-list">
          <div>GET /api/bot/admin/overview/?range=30d — dashboard metrics, time series, active users and category demand.</div>
          <div>GET /api/bot/admin/activity/?range=30d — active users, active conversations and user ranking.</div>
          <div>POST /api/bot/admin/users/&lt;id&gt;/approve/ and /reject/ — approval actions.</div>
          <div>POST /api/bot/admin/permissions/grant/ and /revoke/ — category access control.</div>
          <div>GET /api/bot/admin/category-reports/?range=30d — searches per category per day/month/year.</div>
          <div>GET /api/bot/admin/messages/ — searchable message audit with category, latency and response status.</div>
        </div>
      </section>
    </div>
  );
}
