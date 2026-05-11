import { Settings } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export function SettingsPage() {
  return (
    <div className="page-stack">
      <PageHeader title="Settings" description="Prepare environment settings for switching from dummy data to real Django admin APIs." actions={<button className="primary-btn"><Settings size={16} /> Save Settings</button>} />
      <section className="panel">
        <div className="panel-title"><Settings size={18} /> API connection</div>
        <div className="form-grid">
          <div className="input-card"><label>API Base URL</label><input defaultValue="http://localhost:8000/api" /></div>
          <div className="input-card"><label>Bot Secret Header</label><input defaultValue="dev-bot-secret" /></div>
          <div className="input-card"><label>Use mocks</label><select defaultValue="true"><option value="true">true</option><option value="false">false</option></select></div>
          <div className="input-card"><label>Refresh interval</label><select defaultValue="60"><option value="30">30 seconds</option><option value="60">60 seconds</option><option value="300">5 minutes</option></select></div>
        </div>
      </section>
      <section className="panel">
        <div className="panel-title">Future Django endpoints expected</div>
        <div className="insight-list">
          <div>GET /api/bot/admin/overview/?range=30d — dashboard metrics, time series, active users and category demand.</div>
          <div>GET /api/bot/admin/activity/?range=30d — active users, active conversations and user ranking.</div>
          <div>GET /api/bot/admin/category-reports/?range=30d — searches per category per day/month/year.</div>
          <div>GET /api/bot/admin/messages/ — searchable message audit with category, latency and response status.</div>
        </div>
      </section>
    </div>
  );
}
