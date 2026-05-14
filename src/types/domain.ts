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

export interface OperationIssueRecord {
  id: string;
  userName: string;
  categoryName: string;
  environment: string;
  issueType: string;
  intent: string;
  status: string;
  severity?: string;
  requiresApproval?: boolean;
  approvalReason?: string;
  title: string;
  rawUserMessage: string;
  extractedEntities: Record<string, unknown>;
  openclawAgentUrl: string;
  finalResponseToUser: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpenClawJobRecord {
  id: string;
  issueId: string;
  categoryName: string;
  environment: string;
  agentUrl: string;
  status: string;
  instructionPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown>;
  userFriendlyReport: string;
  httpStatusCode?: number;
  errorMessage?: string;
  createdAt: string;
}

export interface EnvironmentRouteRecord {
  id: string;
  categoryId: number;
  categoryName: string;
  environment: string;
  agentName: string;
  agentLocation: string;
  isActive: boolean;
}

export interface ApiSystemRecord {
  id: string;
  name: string;
  environment: string;
  categoryId?: number;
  categoryName?: string;
  description?: string;
  baseDomains: string[];
  isActive: boolean;
}

export interface ApiEndpointRecord {
  id: string;
  systemId: string;
  systemName: string;
  environment: string;
  name: string;
  method: string;
  pathPattern: string;
  fullUrlExample?: string;
  healthCheckUrl?: string;
  owningService?: string;
  owningTeam?: string;
  requiresAuth: boolean;
  authReference?: string;
  isActive: boolean;
}

export interface ServerAssetRecord {
  id: string;
  name: string;
  environment: string;
  hostname?: string;
  ipAddress: string;
  sshPort: number;
  sshUsername: string;
  credentialReference?: string;
  defaultWorkingDirectory?: string;
  categoryId?: number;
  categoryName?: string;
  allowReadLogs: boolean;
  allowStatusCheck: boolean;
  allowRestart: boolean;
  allowReboot: boolean;
  allowCommandExecution: boolean;
  isActive: boolean;
}

export interface DockerServiceRecord {
  id: string;
  serverId: string;
  serverName: string;
  environment: string;
  serviceName: string;
  containerName?: string;
  workingDirectory: string;
  composeFile?: string;
  logTailLines: number;
  statusCommand: string;
  logsCommandTemplate: string;
  restartCommandTemplate: string;
  isActive: boolean;
}



export interface BackgroundProcessRecord {
  id: string;
  name: string;
  processType: string;
  environment: string;
  categoryId?: number;
  categoryName?: string;
  description?: string;
  owningService?: string;
  owningTeam?: string;
  serverId?: string;
  serverName?: string;
  dockerServiceId?: string;
  dockerServiceName?: string;
  statusEndpoint?: string;
  documentation?: string;
  referencePatterns: string[];
  statusCheckInstructions: string[];
  allowedActions: string[];
  forbiddenActions: string[];
  keywords: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackgroundIssueRecord {
  id: string;
  operationIssueId: string;
  userName: string;
  environment: string;
  processName: string;
  processType: string;
  status: string;
  referenceType: string;
  referenceValue: string;
  references: Array<Record<string, unknown>>;
  extractedKeywords: string[];
  expectedChecks: string[];
  resultSummary: string;
  rawUserMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectUpdateRecord {
  id: string;
  title: string;
  description?: string;
  environment?: string;
  categoryId?: number;
  categoryName?: string;
  status: string;
  priority: string;
  ownerId?: number;
  ownerName: string;
  progressPercent: number;
  dueDate?: string;
  lastSummary?: string;
  blockers: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  actionCount: number;
}

export interface ProjectActionRecord {
  id: string;
  projectUpdateId: string;
  projectTitle: string;
  title: string;
  description?: string;
  assignedToId?: number;
  assignedToName: string;
  status: string;
  priority: string;
  dueDate?: string;
  blockerReason?: string;
  latestComment?: string;
  completionSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkReportRecord {
  id: string;
  userName: string;
  requestedPersonName: string;
  environment?: string;
  dateStart: string;
  dateEnd: string;
  rawQuery: string;
  status: string;
  generatedSummary: string;
  createdAt: string;
}


export interface NetworkIssueRecord {
  id: string;
  operationIssueId: string;
  userName: string;
  environment: string;
  status: string;
  severity: string;
  targetHost?: string;
  targetIp?: string;
  targetUrl?: string;
  port?: number;
  protocol?: string;
  suspectedArea?: string;
  requestedChecks: string[];
  resultSummary?: string;
  rawUserMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityIssueRecord {
  id: string;
  operationIssueId: string;
  userName: string;
  environment: string;
  status: string;
  severity: string;
  securityEventType?: string;
  affectedUserName?: string;
  affectedSystem?: string;
  indicator?: string;
  requestedChecks: string[];
  containmentRequired: boolean;
  resultSummary?: string;
  rawUserMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssistanceQueueRecord {
  id: string;
  name: string;
  queueType: string;
  categoryId?: number;
  categoryName?: string;
  environment?: string;
  defaultAssigneeId?: number;
  defaultAssigneeName?: string;
  escalationEmail?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EscalationRecord {
  id: string;
  issueId: string;
  issueTitle: string;
  issueType: string;
  severity: string;
  environment?: string;
  assistanceQueueName?: string;
  assignedToName?: string;
  escalatedByName?: string;
  status: string;
  reason: string;
  nextSteps: string[];
  createdAt: string;
  assignedAt?: string;
  resolvedAt?: string;
}

export interface ApprovalRequestRecord {
  id: string;
  issueId: string;
  issueTitle: string;
  issueType: string;
  severity: string;
  environment?: string;
  status: string;
  approvalReason: string;
  requestedAction?: string;
  requestedByName?: string;
  assignedToName?: string;
  assistanceQueueName?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface EscalationMetricsRecord {
  totals: Record<string, number>;
  issuesByType: Array<{ issue_type: string; count: number }>;
  issuesBySeverity: Array<{ severity: string; count: number }>;
  escalationsByUser: Array<{ userName: string; status: string; count: number }>;
  approvalsByUser: Array<{ userName: string; status: string; count: number }>;
}
