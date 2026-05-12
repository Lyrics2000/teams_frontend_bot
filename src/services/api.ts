import { agents, categories, conversations, dailyCategoryReports, getOverview, messages, reports, users } from '../data/mockData';
import type { AdminOverview, AgentMetric, BotConversation, BotMessage, BotUser, DailyCategoryReport, PermissionCategory, ReportItem, TimeRange, UserActivity } from '../types/domain';

export const API_BASE_URL = 'http://web:8365/api';
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const TOKEN_KEY = 'britam_bot_admin_token';
const ADMIN_KEY = 'britam_bot_admin_user';

export interface AdminUserSession {
  id: number;
  username: string;
  email?: string;
  isStaff: boolean;
  isSuperuser?: boolean;
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function getStoredAdminUser(): AdminUserSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) as AdminUserSession : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return USE_MOCKS || !!getAuthToken();
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (USE_MOCKS) throw new Error('Mock mode is enabled. Use exported mock-aware API functions.');

  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      message = data.detail || data.message || JSON.stringify(data);
    } catch {
      message = await response.text();
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return response.json() as Promise<T>;
  return response.text() as Promise<T>;
}

const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminApi = {
  async login(username: string, password: string): Promise<{ token: string; user: AdminUserSession }> {
    if (USE_MOCKS) {
      await wait();
      const user = { id: 1, username, email: 'admin@britam.com', isStaff: true, isSuperuser: true };
      localStorage.setItem(TOKEN_KEY, 'mock-token');
      localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
      return { token: 'mock-token', user };
    }
    const result = await request<{ token: string; user: AdminUserSession }>('/bot/admin/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {},
    });
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(result.user));
    return result;
  },
  async me(): Promise<AdminUserSession> {
    if (USE_MOCKS) return getStoredAdminUser() || { id: 1, username: 'admin', isStaff: true };
    return request<AdminUserSession>('/bot/admin/auth/me/');
  },
  logout() { logoutAdmin(); },

  async getOverview(range: TimeRange = '30d'): Promise<AdminOverview> {
    if (USE_MOCKS) { await wait(); return getOverview(range); }
    return request<AdminOverview>(`/bot/admin/overview/?range=${range}`);
  },
  async getActiveUsage(range: TimeRange = '30d'): Promise<UserActivity[]> {
    if (USE_MOCKS) { await wait(); return getOverview(range).activeUsers; }
    return request<UserActivity[]>(`/bot/admin/activity/?range=${range}`);
  },
  async getUsers(): Promise<BotUser[]> {
    if (USE_MOCKS) { await wait(); return users; }
    return request<BotUser[]>('/bot/admin/users/');
  },
  async approveUser(userId: number): Promise<{ ok: boolean; user?: BotUser }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request(`/bot/admin/users/${userId}/approve/`, { method: 'POST', body: '{}' });
  },
  async rejectUser(userId: number): Promise<{ ok: boolean; user?: BotUser }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request(`/bot/admin/users/${userId}/reject/`, { method: 'POST', body: '{}' });
  },
  async suspendUser(userId: number): Promise<{ ok: boolean; user?: BotUser }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request(`/bot/admin/users/${userId}/suspend/`, { method: 'POST', body: '{}' });
  },
  async restoreUser(userId: number): Promise<{ ok: boolean; user?: BotUser }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request(`/bot/admin/users/${userId}/restore/`, { method: 'POST', body: '{}' });
  },
  async bulkApproveUsers(ids?: number[]): Promise<{ ok: boolean; count: number }> {
    if (USE_MOCKS) { await wait(); return { ok: true, count: ids?.length || users.filter((u) => u.authorizationStatus === 'pending').length }; }
    return request('/bot/admin/users/bulk/approve/', { method: 'POST', body: JSON.stringify({ ids: ids || [] }) });
  },
  async bulkRejectUsers(ids?: number[]): Promise<{ ok: boolean; count: number }> {
    if (USE_MOCKS) { await wait(); return { ok: true, count: ids?.length || users.filter((u) => u.authorizationStatus === 'pending').length }; }
    return request('/bot/admin/users/bulk/reject/', { method: 'POST', body: JSON.stringify({ ids: ids || [] }) });
  },
  async getCategories(): Promise<PermissionCategory[]> {
    if (USE_MOCKS) { await wait(); return categories; }
    return request<PermissionCategory[]>('/bot/admin/categories/');
  },
  async saveCategory(category: Partial<PermissionCategory>): Promise<PermissionCategory> {
    if (USE_MOCKS) { await wait(); return { ...categories[0], ...category } as PermissionCategory; }
    const method = category.id ? 'PATCH' : 'POST';
    const path = category.id ? `/bot/admin/categories/${category.id}/` : '/bot/admin/categories/';
    return request<PermissionCategory>(path, { method, body: JSON.stringify(category) });
  },
  async deleteCategory(categoryId: number): Promise<{ ok: boolean }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request(`/bot/admin/categories/${categoryId}/`, { method: 'DELETE' });
  },
  async toggleCategory(categoryId: number): Promise<{ ok: boolean; category?: PermissionCategory }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request(`/bot/admin/categories/${categoryId}/toggle/`, { method: 'POST', body: '{}' });
  },
  async grantPermission(userId: number, categoryId: number): Promise<{ ok: boolean; user?: BotUser }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request('/bot/admin/permissions/grant/', { method: 'POST', body: JSON.stringify({ user_id: userId, category_id: categoryId }) });
  },
  async revokePermission(userId: number, categoryId: number): Promise<{ ok: boolean; user?: BotUser }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request('/bot/admin/permissions/revoke/', { method: 'POST', body: JSON.stringify({ user_id: userId, category_id: categoryId }) });
  },
  async getConversations(): Promise<BotConversation[]> {
    if (USE_MOCKS) { await wait(); return conversations; }
    return request<BotConversation[]>('/bot/admin/conversations/');
  },
  async getMessages(): Promise<BotMessage[]> {
    if (USE_MOCKS) { await wait(); return messages; }
    return request<BotMessage[]>('/bot/admin/messages/');
  },
  async getAgents(): Promise<AgentMetric[]> {
    if (USE_MOCKS) { await wait(); return agents; }
    return request<AgentMetric[]>('/bot/admin/agents/');
  },
  async runHealthCheck(): Promise<AgentMetric[]> {
    if (USE_MOCKS) { await wait(); return agents; }
    return request<AgentMetric[]>('/bot/admin/agents/health-check/', { method: 'POST', body: '{}' });
  },
  async getReports(): Promise<ReportItem[]> {
    if (USE_MOCKS) { await wait(); return reports; }
    return request<ReportItem[]>('/bot/admin/reports/');
  },
  async createReport(report: Partial<ReportItem>): Promise<ReportItem> {
    if (USE_MOCKS) { await wait(); return { ...reports[0], ...report, id: Date.now() } as ReportItem; }
    return request<ReportItem>('/bot/admin/reports/', { method: 'POST', body: JSON.stringify(report) });
  },
  async downloadReport(reportId: number | string): Promise<string> {
    if (USE_MOCKS) { await wait(); return 'Report,Demo\nStatus,Ready\n'; }
    return request<string>(`/bot/admin/reports/${reportId}/download/`, { headers: { Accept: 'text/csv' } });
  },
  async getCategoryReports(range: TimeRange = '30d'): Promise<DailyCategoryReport[]> {
    if (USE_MOCKS) { await wait(); return dailyCategoryReports; }
    return request<DailyCategoryReport[]>(`/bot/admin/category-reports/?range=${range}`);
  },
};
