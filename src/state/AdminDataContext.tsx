import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  agents as initialAgents,
  categories as initialCategories,
  conversations as initialConversations,
  dailyCategoryReports as initialDailyCategoryReports,
  getOverview as getMockOverview,
  messages as initialMessages,
  reports as initialReports,
  users as initialUsers,
} from '../data/mockData';
import { adminApi, USE_MOCKS } from '../services/api';
import type {
  AgentMetric,
  AuthorizationStatus,
  BotConversation,
  BotMessage,
  BotUser,
  DailyCategoryReport,
  PermissionCategory,
  ReportItem,
  TimeRange,
  UserPermission,
  AdminOverview,
} from '../types/domain';

const STORAGE_KEY = 'britam-bot-admin-state-v4';

type ToastTone = 'success' | 'warning' | 'danger' | 'info';
export interface ToastMessage { id: number; tone: ToastTone; message: string; }

interface AdminStateShape {
  users: BotUser[];
  categories: PermissionCategory[];
  agents: AgentMetric[];
  conversations: BotConversation[];
  messages: BotMessage[];
  reports: ReportItem[];
  dailyCategoryReports: DailyCategoryReport[];
  loading: boolean;
  toasts: ToastMessage[];
  refreshAll: () => void;
  approveUser: (userId: number) => void;
  rejectUser: (userId: number) => void;
  suspendUser: (userId: number) => void;
  restoreUser: (userId: number) => void;
  bulkApprovePending: () => void;
  bulkRejectPending: () => void;
  saveCategory: (category: Partial<PermissionCategory>) => void;
  deleteCategory: (categoryId: number) => void;
  toggleCategory: (categoryId: number) => void;
  grantPermission: (userId: number, categoryId: number) => void;
  revokePermission: (userId: number, categoryId: number) => void;
  runHealthCheck: () => void;
  createReport: (report: Partial<ReportItem>) => void;
  downloadReport: (reportId: number | string) => void;
  dismissToast: (id: number) => void;
  resetDemoData: () => void;
  overviewForRange: (range: TimeRange) => AdminOverview;
}

const AdminDataContext = createContext<AdminStateShape | null>(null);

function cloneMockState() {
  return {
    users: structuredClone(initialUsers),
    categories: structuredClone(initialCategories),
    agents: structuredClone(initialAgents),
    conversations: structuredClone(initialConversations),
    messages: structuredClone(initialMessages),
    reports: structuredClone(initialReports),
    dailyCategoryReports: structuredClone(initialDailyCategoryReports),
  };
}

function cloneEmptyState() {
  return {
    users: [] as BotUser[],
    categories: [] as PermissionCategory[],
    agents: [] as AgentMetric[],
    conversations: [] as BotConversation[],
    messages: [] as BotMessage[],
    reports: [] as ReportItem[],
    dailyCategoryReports: [] as DailyCategoryReport[],
  };
}

function safeParseState() {
  // Important: when live backend mode is enabled, never use dummy data.
  // Dashboard values should come only from the Django API. Empty backend = empty UI/zero metrics.
  if (!USE_MOCKS) return cloneEmptyState();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneMockState();
    const parsed = JSON.parse(saved);
    return {
      users: parsed.users ?? structuredClone(initialUsers),
      categories: parsed.categories ?? structuredClone(initialCategories),
      agents: parsed.agents ?? structuredClone(initialAgents),
      conversations: parsed.conversations ?? structuredClone(initialConversations),
      messages: parsed.messages ?? structuredClone(initialMessages),
      reports: parsed.reports ?? structuredClone(initialReports),
      dailyCategoryReports: parsed.dailyCategoryReports ?? structuredClone(initialDailyCategoryReports),
    };
  } catch {
    return cloneMockState();
  }
}

function makePermission(userId: number, category: PermissionCategory, existing: UserPermission[]): UserPermission {
  const nextId = Math.max(0, ...existing.map((permission) => permission.id)) + 1;
  return { id: nextId, userId, categoryId: category.id, categoryName: category.name, granted: true, grantedAt: new Date().toISOString() };
}

function toastTextForStatus(status: AuthorizationStatus) {
  if (status === 'authorized') return 'User approved successfully.';
  if (status === 'rejected') return 'User rejected successfully.';
  if (status === 'suspended') return 'User suspended successfully.';
  return 'User updated successfully.';
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}


function buildZeroOverview(): AdminOverview {
  return {
    metrics: [
      { label: 'Total Users', value: 0, change: 'no live records yet', trend: 'flat', tone: 'neutral' },
      { label: 'Active Now', value: 0, change: 'no active users', trend: 'flat', tone: 'neutral' },
      { label: 'Pending Approvals', value: 0, change: 'no pending approvals', trend: 'flat', tone: 'neutral' },
      { label: 'Messages', value: 0, change: 'no messages in selected range', trend: 'flat', tone: 'neutral' },
      { label: 'Most Asked Category', value: 'None', change: 'no category activity yet', trend: 'flat', tone: 'neutral' },
      { label: 'Agents Healthy', value: '0/0', change: 'no agents configured', trend: 'flat', tone: 'neutral' },
    ],
    timeSeries: [],
    categoryVolumes: [],
    pendingUsers: [],
    recentMessages: [],
    agents: [],
    activeUsers: [],
    dailyCategoryReports: [],
  };
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(safeParseState);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(!USE_MOCKS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((items) => [...items, { id, tone, message }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4500);
  }, []);

  const refreshAll = useCallback(() => {
    if (USE_MOCKS) return;
    setLoading(true);
    Promise.all([
      adminApi.getUsers(),
      adminApi.getCategories(),
      adminApi.getAgents(),
      adminApi.getConversations(),
      adminApi.getMessages(),
      adminApi.getReports(),
      adminApi.getCategoryReports('30d'),
      adminApi.getOverview('30d'),
    ]).then(([users, categories, agents, conversations, messages, reports, dailyCategoryReports, overview]) => {
      setState({ users, categories, agents, conversations, messages, reports, dailyCategoryReports });
      setOverview(overview);
    }).catch((error) => {
      pushToast(error.message || 'Failed to load admin data.', 'danger');
    }).finally(() => setLoading(false));
  }, [pushToast]);

  useEffect(() => {
    if (USE_MOCKS) return;
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (USE_MOCKS) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateUserStatusLocal = useCallback((userId: number, status: AuthorizationStatus) => {
    setState((current) => ({
      ...current,
      users: current.users.map((user) => user.id === userId
        ? { ...user, authorizationStatus: status, isAuthorized: status === 'authorized', lastSeenAt: new Date().toISOString() }
        : user),
    }));
  }, []);

  const approveUser = useCallback((userId: number) => {
    updateUserStatusLocal(userId, 'authorized');
    if (USE_MOCKS) return pushToast(toastTextForStatus('authorized'), 'success');
    adminApi.approveUser(userId).then(refreshAll).then(() => pushToast('User approved successfully.', 'success')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll, updateUserStatusLocal]);

  const rejectUser = useCallback((userId: number) => {
    updateUserStatusLocal(userId, 'rejected');
    if (USE_MOCKS) return pushToast(toastTextForStatus('rejected'), 'danger');
    adminApi.rejectUser(userId).then(refreshAll).then(() => pushToast('User rejected successfully.', 'warning')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll, updateUserStatusLocal]);

  const suspendUser = useCallback((userId: number) => {
    updateUserStatusLocal(userId, 'suspended');
    if (USE_MOCKS) return pushToast(toastTextForStatus('suspended'), 'warning');
    adminApi.suspendUser(userId).then(refreshAll).then(() => pushToast('User suspended successfully.', 'warning')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll, updateUserStatusLocal]);

  const restoreUser = useCallback((userId: number) => {
    updateUserStatusLocal(userId, 'authorized');
    if (USE_MOCKS) return pushToast('User restored successfully.', 'success');
    adminApi.restoreUser(userId).then(refreshAll).then(() => pushToast('User restored successfully.', 'success')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll, updateUserStatusLocal]);

  const bulkApprovePending = useCallback(() => {
    const ids = state.users.filter((u) => u.authorizationStatus === 'pending').map((u) => u.id);
    setState((current) => ({ ...current, users: current.users.map((u) => u.authorizationStatus === 'pending' ? { ...u, authorizationStatus: 'authorized', isAuthorized: true } : u) }));
    if (USE_MOCKS) return pushToast('All pending users have been approved.', 'success');
    adminApi.bulkApproveUsers(ids).then(refreshAll).then(() => pushToast('All pending users have been approved.', 'success')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll, state.users]);

  const bulkRejectPending = useCallback(() => {
    const ids = state.users.filter((u) => u.authorizationStatus === 'pending').map((u) => u.id);
    setState((current) => ({ ...current, users: current.users.map((u) => u.authorizationStatus === 'pending' ? { ...u, authorizationStatus: 'rejected', isAuthorized: false } : u) }));
    if (USE_MOCKS) return pushToast('All pending users have been rejected.', 'warning');
    adminApi.bulkRejectUsers(ids).then(refreshAll).then(() => pushToast('All pending users have been rejected.', 'warning')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll, state.users]);

  const saveCategory = useCallback((category: Partial<PermissionCategory>) => {
    if (USE_MOCKS) {
      setState((current) => {
        if (category.id) return { ...current, categories: current.categories.map((item) => item.id === category.id ? { ...item, ...category } as PermissionCategory : item) };
        const nextId = Math.max(0, ...current.categories.map((item) => item.id)) + 1;
        const newCategory: PermissionCategory = { id: nextId, name: category.name || 'New Category', agent: category.agent || 'new_agent', agentLocation: category.agentLocation || '', description: category.description || '', isActive: category.isActive ?? true, totalUsers: 0, successRate: 100, avgResponseSeconds: 0, totalMessages: 0, messagesToday: 0, messagesThisMonth: 0, failuresToday: 0 };
        return { ...current, categories: [newCategory, ...current.categories] };
      });
      return pushToast(category.id ? 'Category updated successfully.' : 'Category created successfully.', 'success');
    }
    adminApi.saveCategory(category).then(refreshAll).then(() => pushToast(category.id ? 'Category updated successfully.' : 'Category created successfully.', 'success')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll]);

  const deleteCategory = useCallback((categoryId: number) => {
    if (USE_MOCKS) {
      setState((current) => ({ ...current, categories: current.categories.filter((c) => c.id !== categoryId), users: current.users.map((u) => ({ ...u, permissions: u.permissions.filter((p) => p.categoryId !== categoryId) })) }));
      return pushToast('Category deleted successfully.', 'warning');
    }
    adminApi.deleteCategory(categoryId).then(refreshAll).then(() => pushToast('Category deleted successfully.', 'warning')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll]);

  const toggleCategory = useCallback((categoryId: number) => {
    if (USE_MOCKS) {
      setState((current) => ({ ...current, categories: current.categories.map((c) => c.id === categoryId ? { ...c, isActive: !c.isActive } : c) }));
      return pushToast('Category status updated.', 'info');
    }
    adminApi.toggleCategory(categoryId).then(refreshAll).then(() => pushToast('Category status updated.', 'info')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll]);

  const grantPermission = useCallback((userId: number, categoryId: number) => {
    if (USE_MOCKS) {
      setState((current) => {
        const category = current.categories.find((item) => item.id === categoryId);
        if (!category) return current;
        return { ...current, users: current.users.map((user) => user.id === userId && !user.permissions.some((p) => p.categoryId === categoryId && p.granted) ? { ...user, permissions: [...user.permissions, makePermission(userId, category, user.permissions)] } : user) };
      });
      return pushToast('Permission granted successfully.', 'success');
    }
    adminApi.grantPermission(userId, categoryId).then(refreshAll).then(() => pushToast('Permission granted successfully.', 'success')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll]);

  const revokePermission = useCallback((userId: number, categoryId: number) => {
    if (USE_MOCKS) {
      setState((current) => ({ ...current, users: current.users.map((u) => u.id === userId ? { ...u, permissions: u.permissions.filter((p) => p.categoryId !== categoryId) } : u) }));
      return pushToast('Permission revoked successfully.', 'warning');
    }
    adminApi.revokePermission(userId, categoryId).then(refreshAll).then(() => pushToast('Permission revoked successfully.', 'warning')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll]);

  const runHealthCheck = useCallback(() => {
    if (USE_MOCKS) {
      setState((current) => ({ ...current, agents: current.agents.map((a) => ({ ...a, lastCheckedAt: new Date().toISOString(), status: a.location && a.location !== 'Not configured' ? 'healthy' : 'down' })) }));
      return pushToast('Health check completed.', 'success');
    }
    adminApi.runHealthCheck().then((agents) => setState((current) => ({ ...current, agents }))).then(() => pushToast('Health check completed.', 'success')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast]);

  const createReport = useCallback((report: Partial<ReportItem>) => {
    if (USE_MOCKS) {
      const newReport: ReportItem = { id: Date.now(), title: report.title || 'New Admin Report', description: report.description || 'Custom operational report.', owner: report.owner || 'Admin', frequency: report.frequency || 'On demand', lastGeneratedAt: new Date().toISOString(), status: report.status || 'ready' };
      setState((current) => ({ ...current, reports: [newReport, ...current.reports] }));
      return pushToast('Report created successfully.', 'success');
    }
    adminApi.createReport(report).then(refreshAll).then(() => pushToast('Report created successfully.', 'success')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, refreshAll]);

  const downloadReport = useCallback((reportId: number | string) => {
    if (USE_MOCKS) {
      const report = state.reports.find((item) => item.id === reportId);
      const csv = `Report,${report?.title ?? 'Report'}\nGenerated,${new Date().toISOString()}\nUsers,${state.users.length}\nCategories,${state.categories.length}\n`;
      downloadCsv(`${(report?.title ?? 'bot-admin-report').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`, csv);
      return pushToast('Report downloaded as CSV.', 'success');
    }
    adminApi.downloadReport(reportId).then((csv) => downloadCsv(`bot-admin-${reportId}.csv`, csv)).then(() => pushToast('Report downloaded as CSV.', 'success')).catch((e) => pushToast(e.message, 'danger'));
  }, [pushToast, state.categories.length, state.reports, state.users.length]);

  const dismissToast = useCallback((id: number) => setToasts((items) => items.filter((item) => item.id !== id)), []);

  const resetDemoData = useCallback(() => {
    if (USE_MOCKS) {
      setState(cloneMockState());
      return pushToast('Demo data has been reset.', 'info');
    }
    refreshAll();
    pushToast('Live data refreshed from backend.', 'info');
  }, [pushToast, refreshAll]);

  const overviewForRange = useCallback((range: TimeRange) => {
    const base = USE_MOCKS ? getMockOverview(range) : (overview ?? buildZeroOverview());
    const activeUsers = state.users.filter((user) => user.isAuthorized).map((user) => ({
      userId: user.id,
      userName: user.displayName,
      email: user.email,
      messages: user.messageCount ?? 0,
      lastSeenAt: user.lastSeenAt ?? user.createdAt,
      activeNow: !!user.activeNow,
      topCategory: user.lastCategory ?? 'General Support',
      successRate: Math.max(80, 99 - (user.failedRequests ?? 0) * 2),
      avgResponseSeconds: user.avgResponseSeconds ?? 0,
    })).sort((a, b) => b.messages - a.messages);
    const categoryVolumes = state.categories.map((category) => ({
      name: category.name,
      messages: category.totalMessages,
      successRate: category.successRate,
      activeUsers: category.totalUsers,
      avgResponseSeconds: category.avgResponseSeconds,
      errors: category.failuresToday ?? Math.round(category.totalMessages * (100 - category.successRate) / 100),
    })).sort((a, b) => b.messages - a.messages);
    return {
      ...base,
      metrics: [
        { label: 'Total Users', value: state.users.length, change: 'registered bot users', trend: 'up' as const, tone: 'good' as const },
        { label: 'Active Now', value: state.users.filter((u) => u.activeNow).length, change: 'live users in recent window', trend: 'up' as const, tone: 'good' as const },
        { label: 'Pending Approvals', value: state.users.filter((u) => u.authorizationStatus === 'pending').length, change: 'waiting for admin', trend: 'flat' as const, tone: 'warning' as const },
        ...base.metrics.slice(3),
      ],
      pendingUsers: state.users.filter((user) => user.authorizationStatus === 'pending'),
      recentMessages: state.messages,
      agents: state.agents,
      activeUsers,
      categoryVolumes,
      dailyCategoryReports: state.dailyCategoryReports,
    };
  }, [overview, state.agents, state.categories, state.dailyCategoryReports, state.messages, state.users]);

  const value = useMemo<AdminStateShape>(() => ({
    ...state,
    loading,
    toasts,
    refreshAll,
    approveUser,
    rejectUser,
    suspendUser,
    restoreUser,
    bulkApprovePending,
    bulkRejectPending,
    saveCategory,
    deleteCategory,
    toggleCategory,
    grantPermission,
    revokePermission,
    runHealthCheck,
    createReport,
    downloadReport,
    dismissToast,
    resetDemoData,
    overviewForRange,
  }), [state, loading, toasts, refreshAll, approveUser, rejectUser, suspendUser, restoreUser, bulkApprovePending, bulkRejectPending, saveCategory, deleteCategory, toggleCategory, grantPermission, revokePermission, runHealthCheck, createReport, downloadReport, dismissToast, resetDemoData, overviewForRange]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) throw new Error('useAdminData must be used inside AdminDataProvider');
  return context;
}
