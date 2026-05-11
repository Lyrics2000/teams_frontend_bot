import { agents, categories, conversations, dailyCategoryReports, getOverview, messages, reports, users } from '../data/mockData';
import type { AdminOverview, AgentMetric, BotConversation, BotMessage, BotUser, DailyCategoryReport, PermissionCategory, ReportItem, TimeRange, UserActivity } from '../types/domain';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const BOT_SECRET = import.meta.env.VITE_BOT_SECRET || 'dev-bot-secret';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (USE_MOCKS) {
    throw new Error('Mock mode is enabled. Use exported mock-aware API functions.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Bot-Secret': BOT_SECRET,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminApi = {
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
  async approveUser(userId: number): Promise<{ ok: boolean }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request(`/bot/admin/users/${userId}/approve/`, { method: 'POST' });
  },
  async rejectUser(userId: number): Promise<{ ok: boolean }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request(`/bot/admin/users/${userId}/reject/`, { method: 'POST' });
  },
  async suspendUser(userId: number): Promise<{ ok: boolean }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request(`/bot/admin/users/${userId}/suspend/`, { method: 'POST' });
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
  async grantPermission(userId: number, categoryId: number): Promise<{ ok: boolean }> {
    if (USE_MOCKS) { await wait(); return { ok: true }; }
    return request('/bot/admin/permissions/grant/', { method: 'POST', body: JSON.stringify({ user_id: userId, category_id: categoryId }) });
  },
  async revokePermission(userId: number, categoryId: number): Promise<{ ok: boolean }> {
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
  async getReports(): Promise<ReportItem[]> {
    if (USE_MOCKS) { await wait(); return reports; }
    return request<ReportItem[]>('/bot/admin/reports/');
  },
  async getCategoryReports(range: TimeRange = '30d'): Promise<DailyCategoryReport[]> {
    if (USE_MOCKS) { await wait(); return dailyCategoryReports; }
    return request<DailyCategoryReport[]>(`/bot/admin/category-reports/?range=${range}`);
  },
};
