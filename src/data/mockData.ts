import { addDays, format, subDays, subMonths } from 'date-fns';
import type {
  AdminOverview,
  AgentMetric,
  BotConversation,
  BotMessage,
  BotUser,
  CategoryVolume,
  DailyCategoryReport,
  PermissionCategory,
  ReportItem,
  TimeRange,
  TimeSeriesPoint,
  UserActivity,
} from '../types/domain';

const now = new Date();
const iso = (daysAgo = 0, hoursAgo = 0) => {
  const d = subDays(now, daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

export const categories: PermissionCategory[] = [
  { id: 1, name: 'ERP Issue', agent: 'erp_diagnosis_agent', agentLocation: 'https://apim.example.com/erp/diagnose', description: 'Supplier invoices, Oracle ERP, AP headers, AP lines and repush diagnosis.', isActive: true, totalUsers: 18, successRate: 94, avgResponseSeconds: 9, totalMessages: 642, messagesToday: 88, messagesThisMonth: 642, failuresToday: 5 },
  { id: 2, name: 'API Issue', agent: 'api_diagnosis_agent', agentLocation: 'https://apim.example.com/api/diagnose', description: 'API endpoints, payload failures, APIM authentication, latency and response errors.', isActive: true, totalUsers: 12, successRate: 91, avgResponseSeconds: 12, totalMessages: 388, messagesToday: 41, messagesThisMonth: 388, failuresToday: 7 },
  { id: 3, name: 'Payment Issue', agent: 'payment_diagnosis_agent', agentLocation: 'https://apim.example.com/payments/diagnose', description: 'M-Pesa C2B, STK, callbacks, transaction confirmations and payment references.', isActive: true, totalUsers: 9, successRate: 96, avgResponseSeconds: 7, totalMessages: 294, messagesToday: 54, messagesThisMonth: 294, failuresToday: 1 },
  { id: 4, name: 'Docker Issue', agent: 'docker_support_agent', agentLocation: 'https://ops.example.com/docker/check', description: 'Container health, compose services, Nginx and restart requests.', isActive: true, totalUsers: 6, successRate: 89, avgResponseSeconds: 15, totalMessages: 143, messagesToday: 16, messagesThisMonth: 143, failuresToday: 2 },
  { id: 5, name: 'General Support', agent: 'general_support_agent', agentLocation: '', description: 'General support, policy, approval and documentation guidance.', isActive: true, totalUsers: 24, successRate: 98, avgResponseSeconds: 3, totalMessages: 218, messagesToday: 23, messagesThisMonth: 218, failuresToday: 0 },
];

export const users: BotUser[] = [
  { id: 1, teamsUserId: '29:user-001', displayName: 'Achongo A. Thomas', email: 'thomas@example.com', authorizationStatus: 'authorized', isAuthorized: true, tenantId: 'tenant-001', aadObjectId: 'aad-001', lastSeenAt: iso(0, 0), createdAt: iso(66), messageCount: 342, lastCategory: 'ERP Issue', activeNow: true, avgResponseSeconds: 8.4, failedRequests: 5, permissions: [{ id: 1, userId: 1, categoryId: 1, categoryName: 'ERP Issue', granted: true, grantedAt: iso(64) }, { id: 2, userId: 1, categoryId: 2, categoryName: 'API Issue', granted: true, grantedAt: iso(64) }] },
  { id: 2, teamsUserId: '29:user-002', displayName: 'Mary Wanjiku', email: 'mary@example.com', authorizationStatus: 'pending', isAuthorized: false, lastSeenAt: iso(0, 1), createdAt: iso(1), messageCount: 4, lastCategory: 'General Support', activeNow: false, avgResponseSeconds: 0, failedRequests: 0, permissions: [] },
  { id: 3, teamsUserId: '29:user-003', displayName: 'Brian Otieno', email: 'brian@example.com', authorizationStatus: 'authorized', isAuthorized: true, lastSeenAt: iso(0, 2), createdAt: iso(70), messageCount: 238, lastCategory: 'Payment Issue', activeNow: true, avgResponseSeconds: 6.7, failedRequests: 2, permissions: [{ id: 3, userId: 3, categoryId: 3, categoryName: 'Payment Issue', granted: true, grantedAt: iso(68) }] },
  { id: 4, teamsUserId: '29:user-004', displayName: 'Purity Karanja', email: 'purity@example.com', authorizationStatus: 'pending', isAuthorized: false, lastSeenAt: iso(0, 0), createdAt: iso(0), messageCount: 3, lastCategory: 'API Issue', activeNow: true, avgResponseSeconds: 0, failedRequests: 0, permissions: [] },
  { id: 5, teamsUserId: '29:user-005', displayName: 'Douglas Gitau', email: 'douglas@example.com', authorizationStatus: 'suspended', isAuthorized: false, lastSeenAt: iso(9), createdAt: iso(98), messageCount: 52, lastCategory: 'ERP Issue', activeNow: false, avgResponseSeconds: 11.2, failedRequests: 8, permissions: [] },
  { id: 6, teamsUserId: '29:user-006', displayName: 'Nillas Support', email: 'nillas@example.com', authorizationStatus: 'authorized', isAuthorized: true, lastSeenAt: iso(0, 4), createdAt: iso(55), messageCount: 187, lastCategory: 'ERP Issue', activeNow: false, avgResponseSeconds: 9.9, failedRequests: 4, permissions: [{ id: 4, userId: 6, categoryId: 1, categoryName: 'ERP Issue', granted: true, grantedAt: iso(53) }] },
  { id: 7, teamsUserId: '29:user-007', displayName: 'Grace Achieng', email: 'grace@example.com', authorizationStatus: 'authorized', isAuthorized: true, lastSeenAt: iso(2), createdAt: iso(30), messageCount: 79, lastCategory: 'Docker Issue', activeNow: false, avgResponseSeconds: 15.3, failedRequests: 6, permissions: [{ id: 5, userId: 7, categoryId: 4, categoryName: 'Docker Issue', granted: true, grantedAt: iso(28) }] },
];

export const messages: BotMessage[] = [
  { id: 1, conversationId: 1, userName: 'Achongo A. Thomas', channel: 'teams', direction: 'incoming', text: 'Check ERP invoice 122-101142-1200560206', category: 'ERP Issue', intent: 'erp_diagnosis_agent', createdAt: iso(0, 0), latencyMs: 920, successful: true },
  { id: 2, conversationId: 1, userName: 'Achongo A. Thomas', channel: 'teams', direction: 'outgoing', text: '✅ ERP invoice check completed. The invoice already exists in ERP/AP with matching lines. No repush is required.', category: 'ERP Issue', responseCode: 'FINAL_RESPONSE', createdAt: iso(0, 0), latencyMs: 920, successful: true },
  { id: 3, conversationId: 2, userName: 'Brian Otieno', channel: 'teams', direction: 'incoming', text: 'STK callback has not updated payment status', category: 'Payment Issue', intent: 'payment_diagnosis_agent', createdAt: iso(0, 2), latencyMs: 640, successful: true },
  { id: 4, conversationId: 3, userName: 'Mary Wanjiku', channel: 'teams', direction: 'incoming', text: 'Hi', createdAt: iso(1), latencyMs: 0, successful: true },
  { id: 5, conversationId: 4, userName: 'Purity Karanja', channel: 'teams', direction: 'incoming', text: 'API is returning invalid subscription key', category: 'API Issue', intent: 'api_diagnosis_agent', createdAt: iso(0, 5), latencyMs: 1480, successful: false },
  { id: 6, conversationId: 5, userName: 'Nillas Support', channel: 'teams', direction: 'incoming', text: 'Invoice 122-28622-1200573144 missing header locally', category: 'ERP Issue', intent: 'erp_diagnosis_agent', createdAt: iso(2), latencyMs: 1010, successful: true },
  { id: 7, conversationId: 6, userName: 'Grace Achieng', channel: 'teams', direction: 'incoming', text: 'Docker compose service is restarting every 5 minutes', category: 'Docker Issue', intent: 'docker_support_agent', createdAt: iso(3), latencyMs: 1640, successful: false },
];

export const conversations: BotConversation[] = [
  { id: 1, userId: 1, userName: 'Achongo A. Thomas', channel: 'teams', channelConversationId: 'conv-001', currentCategory: 'ERP Issue', currentState: 'FINAL_RESPONSE', createdAt: iso(18), updatedAt: iso(0, 0), messageCount: 92, lastMessage: 'Check ERP invoice 122-101142-1200560206', activeNow: true },
  { id: 2, userId: 3, userName: 'Brian Otieno', channel: 'teams', channelConversationId: 'conv-002', currentCategory: 'Payment Issue', currentState: 'FINAL_RESPONSE', createdAt: iso(22), updatedAt: iso(0, 2), messageCount: 73, lastMessage: 'STK callback has not updated payment status', activeNow: true },
  { id: 3, userId: 2, userName: 'Mary Wanjiku', channel: 'teams', channelConversationId: 'conv-003', currentState: 'AUTHORIZATION_PENDING', createdAt: iso(1), updatedAt: iso(1), messageCount: 1, lastMessage: 'Hi', activeNow: false },
  { id: 4, userId: 4, userName: 'Purity Karanja', channel: 'teams', channelConversationId: 'conv-004', currentCategory: 'API Issue', currentState: 'AUTHORIZATION_PENDING', createdAt: iso(2), updatedAt: iso(0, 5), messageCount: 3, lastMessage: 'API is returning invalid subscription key', activeNow: true },
  { id: 5, userId: 6, userName: 'Nillas Support', channel: 'teams', channelConversationId: 'conv-005', currentCategory: 'ERP Issue', currentState: 'FINAL_RESPONSE', createdAt: iso(9), updatedAt: iso(2), messageCount: 51, lastMessage: 'Invoice missing header locally', activeNow: false },
  { id: 6, userId: 7, userName: 'Grace Achieng', channel: 'teams', channelConversationId: 'conv-006', currentCategory: 'Docker Issue', currentState: 'AGENT_REQUEST_FAILED', createdAt: iso(3), updatedAt: iso(3), messageCount: 12, lastMessage: 'Docker compose service is restarting', activeNow: false },
];

export const agents: AgentMetric[] = [
  { id: 1, name: 'erp_diagnosis_agent', categoryName: 'ERP Issue', location: 'https://apim.example.com/erp/diagnose', status: 'healthy', uptime: 99.94, avgLatencyMs: 910, p95LatencyMs: 1420, requestsToday: 88, errorsToday: 2, lastCheckedAt: iso(0, 0), successRate: 94 },
  { id: 2, name: 'api_diagnosis_agent', categoryName: 'API Issue', location: 'https://apim.example.com/api/diagnose', status: 'degraded', uptime: 98.72, avgLatencyMs: 1480, p95LatencyMs: 2400, requestsToday: 41, errorsToday: 7, lastCheckedAt: iso(0, 0), successRate: 91 },
  { id: 3, name: 'payment_diagnosis_agent', categoryName: 'Payment Issue', location: 'https://apim.example.com/payments/diagnose', status: 'healthy', uptime: 99.98, avgLatencyMs: 640, p95LatencyMs: 980, requestsToday: 54, errorsToday: 1, lastCheckedAt: iso(0, 0), successRate: 96 },
  { id: 4, name: 'docker_support_agent', categoryName: 'Docker Issue', location: 'https://ops.example.com/docker/check', status: 'healthy', uptime: 99.44, avgLatencyMs: 1100, p95LatencyMs: 1710, requestsToday: 16, errorsToday: 0, lastCheckedAt: iso(0, 1), successRate: 89 },
];

export const reports: ReportItem[] = [
  { id: 1, title: 'User Approval and Access Report', description: 'Pending, approved, rejected and suspended users with permission coverage.', owner: 'Admin', frequency: 'Daily', lastGeneratedAt: iso(0), status: 'ready' },
  { id: 2, title: 'ERP Diagnosis Performance Report', description: 'Invoices checked, repush decisions, missing headers, duplicate lines and success rates.', owner: 'Integration', frequency: 'Daily', lastGeneratedAt: iso(1), status: 'ready' },
  { id: 3, title: 'Agent Health and SLA Report', description: 'Webhook uptime, response latency, failures and degraded agent analysis.', owner: 'Operations', frequency: 'Hourly', lastGeneratedAt: iso(0), status: 'scheduled' },
  { id: 4, title: 'Permission Category Usage Report', description: 'Category volumes, active users, success rates and category-level errors.', owner: 'Security', frequency: 'Weekly', lastGeneratedAt: iso(3), status: 'needs-review' },
  { id: 5, title: 'Daily Category Search Report', description: 'Searches/questions by category per day, unique users and failed lookups.', owner: 'Service Desk', frequency: 'Daily', lastGeneratedAt: iso(0), status: 'ready' },
  { id: 6, title: 'Top Bot Users Report', description: 'Most active users, category patterns, response outcomes and escalation needs.', owner: 'Admin', frequency: 'Weekly', lastGeneratedAt: iso(2), status: 'ready' },
];

function seriesLength(range: TimeRange): number {
  if (range === 'today') return 24;
  if (range === '7d') return 7;
  if (range === '30d') return 30;
  if (range === '90d') return 90;
  if (range === '12m' || range === 'year') return 12;
  return 30;
}

export function makeTimeSeries(range: TimeRange = '30d'): TimeSeriesPoint[] {
  const len = seriesLength(range);
  const monthly = range === '12m' || range === 'year';
  return Array.from({ length: len }, (_, i) => {
    const date = monthly ? subMonths(now, len - 1 - i) : addDays(subDays(now, len - 1), i);
    const base = monthly ? 1800 + i * 130 : range === 'today' ? 12 + i * 2 : 160 + i * 13;
    const erp = Math.round(base * 0.36 + (i % 4) * 8);
    const api = Math.round(base * 0.22 + (i % 3) * 6);
    const payment = Math.round(base * 0.18 + (i % 5) * 4);
    const docker = Math.round(base * 0.08 + (i % 2) * 3);
    const general = Math.round(base * 0.11 + (i % 4) * 2);
    const messages = erp + api + payment + docker + general;
    return {
      date: monthly ? format(date, 'MMM yy') : range === 'today' ? `${String(i).padStart(2, '0')}:00` : format(date, 'MMM dd'),
      fullDate: date.toISOString(),
      messages,
      uniqueUsers: Math.round(messages / 9) + (i % 7),
      approvals: Math.max(1, Math.round(messages / 80) + (i % 5)),
      errors: Math.max(0, Math.round(messages * 0.035) + (i % 4)),
      erp,
      api,
      payment,
      docker,
      general,
    };
  });
}

export const categoryVolumes: CategoryVolume[] = categories.map((c) => ({
  name: c.name,
  messages: c.totalMessages,
  successRate: c.successRate,
  activeUsers: c.totalUsers,
  avgResponseSeconds: c.avgResponseSeconds,
  errors: c.failuresToday ?? Math.round(c.totalMessages * (100 - c.successRate) / 100),
}));

export const activeUsers: UserActivity[] = users
  .filter((user) => user.isAuthorized)
  .map((user) => ({
    userId: user.id,
    userName: user.displayName,
    email: user.email,
    messages: user.messageCount ?? 0,
    lastSeenAt: user.lastSeenAt ?? user.createdAt,
    activeNow: !!user.activeNow,
    topCategory: user.lastCategory ?? 'General Support',
    successRate: Math.max(80, 99 - (user.failedRequests ?? 0) * 2),
    avgResponseSeconds: user.avgResponseSeconds ?? 0,
  }))
  .sort((a, b) => b.messages - a.messages);

export const dailyCategoryReports: DailyCategoryReport[] = makeTimeSeries('30d').flatMap((point) => [
  { date: point.date, category: 'ERP Issue', searches: point.erp, successful: Math.round(point.erp * 0.94), failed: Math.round(point.erp * 0.06), uniqueUsers: Math.round(point.erp / 7), avgResponseSeconds: 9 },
  { date: point.date, category: 'API Issue', searches: point.api, successful: Math.round(point.api * 0.91), failed: Math.round(point.api * 0.09), uniqueUsers: Math.round(point.api / 6), avgResponseSeconds: 12 },
  { date: point.date, category: 'Payment Issue', searches: point.payment, successful: Math.round(point.payment * 0.96), failed: Math.round(point.payment * 0.04), uniqueUsers: Math.round(point.payment / 5), avgResponseSeconds: 7 },
  { date: point.date, category: 'Docker Issue', searches: point.docker, successful: Math.round(point.docker * 0.89), failed: Math.round(point.docker * 0.11), uniqueUsers: Math.round(point.docker / 4), avgResponseSeconds: 15 },
  { date: point.date, category: 'General Support', searches: point.general, successful: Math.round(point.general * 0.98), failed: Math.round(point.general * 0.02), uniqueUsers: Math.round(point.general / 4), avgResponseSeconds: 3 },
]);

export function getOverview(range: TimeRange = '30d'): AdminOverview {
  const timeSeries = makeTimeSeries(range);
  const totalMessages = timeSeries.reduce((sum, point) => sum + point.messages, 0);
  const totalErrors = timeSeries.reduce((sum, point) => sum + point.errors, 0);
  const uniqueUsers = Math.max(...timeSeries.map((point) => point.uniqueUsers));
  return {
    metrics: [
      { label: 'Total Users', value: '128', change: '+12 this week', trend: 'up', tone: 'good' },
      { label: 'Active Now', value: users.filter((u) => u.activeNow).length, change: 'live users in recent window', trend: 'up', tone: 'good' },
      { label: 'Pending Approvals', value: users.filter((u) => u.authorizationStatus === 'pending').length, change: '+2 today', trend: 'up', tone: 'warning' },
      { label: 'Messages / Searches', value: totalMessages.toLocaleString(), change: `${range} selected`, trend: 'up', tone: 'neutral' },
      { label: 'Unique Active Users', value: uniqueUsers, change: 'peak in selected range', trend: 'up', tone: 'good' },
      { label: 'Agent Success Rate', value: `${Math.round((1 - totalErrors / Math.max(totalMessages, 1)) * 1000) / 10}%`, change: `${totalErrors} failures`, trend: 'flat', tone: totalErrors > 100 ? 'warning' : 'good' },
      { label: 'Avg Response Time', value: '8.7s', change: '-2.1s', trend: 'down', tone: 'good' },
      { label: 'Failed Requests', value: totalErrors.toLocaleString(), change: 'across selected range', trend: 'up', tone: totalErrors > 100 ? 'danger' : 'warning' },
    ],
    timeSeries,
    categoryVolumes,
    pendingUsers: users.filter((u) => u.authorizationStatus === 'pending'),
    recentMessages: messages,
    agents,
    activeUsers,
    dailyCategoryReports,
  };
}

export const overview = getOverview('30d');
