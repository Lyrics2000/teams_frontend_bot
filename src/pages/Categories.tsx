import { useState } from 'react';
import { Bot, Edit3, Plus, Power, ShieldCheck, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { SearchBox } from '../components/SearchBox';
import { StatusBadge } from '../components/StatusBadge';
import { useAdminData } from '../state/AdminDataContext';
import type { PermissionCategory } from '../types/domain';

const blankCategory: Partial<PermissionCategory> = {
  name: '',
  agent: '',
  agentLocation: '',
  description: '',
  isActive: true,
};

export function Categories() {
  const { categories, saveCategory, deleteCategory, toggleCategory } = useAdminData();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Partial<PermissionCategory> | null>(null);
  const top = [...categories].sort((a, b) => b.totalMessages - a.totalMessages)[0];
  const filtered = categories.filter((category) => `${category.name} ${category.agent} ${category.description}`.toLowerCase().includes(query.toLowerCase()));

  const updateEditing = (key: keyof PermissionCategory, value: string | boolean) => {
    setEditing((current) => ({ ...(current ?? blankCategory), [key]: value }));
  };

  const submitCategory = () => {
    if (!editing?.name || !editing?.agent) return;
    saveCategory(editing);
    setEditing(null);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Permission Categories"
        description="Configure support categories, agents, agent locations and permission assignment rules."
        actions={<button className="primary-btn" onClick={() => setEditing(blankCategory)}><ShieldCheck size={16} /> New Category</button>}
      />

      <div className="metric-grid">
        <MetricCard metric={{ label: 'Active categories', value: categories.filter((c) => c.isActive).length, change: 'available for routing', tone: 'good' }} />
        <MetricCard metric={{ label: 'Most asked', value: top?.name ?? '—', change: `${top?.totalMessages ?? 0} messages`, tone: 'good' }} />
        <MetricCard metric={{ label: 'Without agent URL', value: categories.filter((c) => !c.agentLocation).length, change: 'needs setup', tone: 'warning' }} />
        <MetricCard metric={{ label: 'Avg success', value: `${Math.round(categories.reduce((s, c) => s + c.successRate, 0) / Math.max(categories.length, 1))}%`, change: 'across categories', tone: 'good' }} />
      </div>

      <section className="panel">
        <div className="toolbar-row">
          <div className="panel-title"><Bot size={18} /> Category routing setup</div>
          <SearchBox value={query} onChange={setQuery} placeholder="Search category, agent or description..." />
        </div>
        <DataTable
          columns={['Category', 'Agent', 'Agent location', 'Users', 'Messages today', 'Success', 'Status', 'Actions']}
          rows={filtered.map((category) => [
            <div><strong>{category.name}</strong><span className="table-subtitle">{category.description}</span></div>,
            category.agent,
            category.agentLocation || <span className="muted-text">Not configured</span>,
            category.totalUsers,
            category.messagesToday ?? 0,
            `${category.successRate}%`,
            <StatusBadge value={category.isActive ? 'healthy' : 'suspended'} />,
            <div className="actions-inline">
              <button className="secondary-btn" onClick={() => setEditing(category)}><Edit3 size={15} /> Edit</button>
              <button className="secondary-btn" onClick={() => toggleCategory(category.id)}><Power size={15} /> {category.isActive ? 'Disable' : 'Enable'}</button>
              <button className="danger-btn" onClick={() => deleteCategory(category.id)}><Trash2 size={15} /> Delete</button>
            </div>,
          ])}
          empty="No categories match your search."
        />
      </section>

      {editing ? (
        <Modal title={editing.id ? 'Edit category' : 'New category'} description="Define the routing category, assigned agent and webhook/API location." onClose={() => setEditing(null)}>
          <div className="form-grid">
            <label className="input-card"><span>Category name</span><input value={editing.name ?? ''} onChange={(event) => updateEditing('name', event.target.value)} placeholder="ERP Issue" /></label>
            <label className="input-card"><span>Agent name</span><input value={editing.agent ?? ''} onChange={(event) => updateEditing('agent', event.target.value)} placeholder="erp_diagnosis_agent" /></label>
            <label className="input-card wide-field"><span>Agent location URL</span><input value={editing.agentLocation ?? ''} onChange={(event) => updateEditing('agentLocation', event.target.value)} placeholder="https://apim.example.com/erp/diagnose" /></label>
            <label className="input-card wide-field"><span>Description</span><textarea value={editing.description ?? ''} onChange={(event) => updateEditing('description', event.target.value)} placeholder="Describe what messages should route here." rows={4} /></label>
            <label className="toggle-row"><input type="checkbox" checked={editing.isActive ?? true} onChange={(event) => updateEditing('isActive', event.target.checked)} /> Active for routing</label>
          </div>
          <div className="modal-actions">
            <button className="primary-btn" onClick={submitCategory}><Plus size={16} /> Save Category</button>
            <button className="secondary-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
