export type AuthorizationStatus = 'pending' | 'authorized' | 'rejected' | 'suspended';
export type AgentStatus = 'healthy' | 'degraded' | 'down';
export type Trend = 'up' | 'down' | 'flat';
export type MetricTone = 'good' | 'warning' | 'danger' | 'neutral';
export type TimeRange = 'today' | '7d' | '30d' | '90d' | '12m' | 'year';

export interface UserPermission {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  granted: boolean;
  grantedAt: string;
}

export interface BotUser {
  id: number;
  teamsUserId: string;
  displayName: string;
  email?: string;
  authorizationStatus: AuthorizationStatus;
  isAuthorized: boolean;
  tenantId?: string;
  aadObjectId?: string;
  lastSeenAt?: string;
  createdAt: string;
  permissions: UserPermission[];
  messageCount?: number;
  lastCategory?: string;
  activeNow?: boolean;
  avgResponseSeconds?: number;
  failedRequests?: number;
}

export interface PermissionCategory {
  id: number;
  name: string;
  agent: string;
  agentLocation?: string;
  description?: string;
  isActive: boolean;
  totalUsers: number;
  successRate: number;
  avgResponseSeconds: number;
  totalMessages: number;
  messagesToday?: number;
  messagesThisMonth?: number;
  failuresToday?: number;
}

export interface BotConversation {
  id: number;
  userId: number;
  userName: string;
  channel: string;
  channelConversationId: string;
  currentCategory?: string;
  currentState?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: string;
  activeNow?: boolean;
}

export interface BotMessage {
  id: number;
  conversationId: number;
  userName: string;
  channel: string;
  direction: 'incoming' | 'outgoing';
  text: string;
  category?: string;
  intent?: string;
  responseCode?: string;
  createdAt: string;
  latencyMs?: number;
  successful?: boolean;
}

export interface AgentMetric {
  id: number;
  name: string;
  categoryName: string;
  location: string;
  status: AgentStatus;
  uptime: number;
  avgLatencyMs: number;
  p95LatencyMs?: number;
  requestsToday: number;
  errorsToday: number;
  lastCheckedAt: string;
  successRate?: number;
}

export interface ReportItem {
  id: number;
  title: string;
  description: string;
  owner: string;
  frequency: string;
  lastGeneratedAt: string;
  status: 'ready' | 'scheduled' | 'needs-review';
}

export interface MetricItem {
  label: string;
  value: string | number;
  change?: string;
  trend?: Trend;
  tone?: MetricTone;
}

export interface TimeSeriesPoint {
  date: string;
  fullDate: string;
  messages: number;
  uniqueUsers: number;
  approvals: number;
  errors: number;
  erp: number;
  api: number;
  payment: number;
  docker: number;
  general: number;
}

export interface CategoryVolume {
  name: string;
  messages: number;
  successRate: number;
  activeUsers: number;
  avgResponseSeconds: number;
  errors: number;
}

export interface UserActivity {
  userId: number;
  userName: string;
  email?: string;
  messages: number;
  lastSeenAt: string;
  activeNow: boolean;
  topCategory: string;
  successRate: number;
  avgResponseSeconds: number;
}

export interface DailyCategoryReport {
  date: string;
  category: string;
  searches: number;
  successful: number;
  failed: number;
  uniqueUsers: number;
  avgResponseSeconds: number;
}

export interface AdminOverview {
  metrics: MetricItem[];
  timeSeries: TimeSeriesPoint[];
  categoryVolumes: CategoryVolume[];
  pendingUsers: BotUser[];
  recentMessages: BotMessage[];
  agents: AgentMetric[];
  activeUsers: UserActivity[];
  dailyCategoryReports: DailyCategoryReport[];
}
