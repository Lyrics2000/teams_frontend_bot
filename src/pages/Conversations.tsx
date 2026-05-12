import { MessageSquareText } from 'lucide-react';
import { ActiveUserPill } from '../components/ActiveUserPill';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useAdminData } from '../state/AdminDataContext';
import { secondsFromMs, timeAgo } from '../utils/format';

export function Conversations() {
  const { conversations, messages } = useAdminData();
  const incoming = messages.filter((message) => message.direction === 'incoming');
  const failed = messages.filter((message) => message.successful === false);
  return (
    <div className="page-stack">
      <PageHeader title="Messages & Conversations" description="Review bot chats, message category, response status, latency and latest user activity." />
      <div className="metric-grid">
        <MetricCard metric={{ label: 'Conversations', value: conversations.length, change: 'open and historical', tone: 'neutral' }} />
        <MetricCard metric={{ label: 'Incoming searches', value: incoming.length, change: 'sample records', tone: 'good' }} />
        <MetricCard metric={{ label: 'Failed responses', value: failed.length, change: 'needs review', tone: failed.length ? 'warning' : 'good' }} />
        <MetricCard metric={{ label: 'Active conversations', value: conversations.filter((c) => c.activeNow).length, change: 'currently active', tone: 'good' }} />
      </div>
      <section className="panel">
        <div className="panel-title"><MessageSquareText size={18} /> Conversation list</div>
        <DataTable
          columns={['User', 'Active', 'Category', 'State', 'Messages', 'Last message', 'Updated']}
          rows={conversations.map((conversation) => [
            <strong>{conversation.userName}</strong>,
            <ActiveUserPill active={conversation.activeNow} />,
            conversation.currentCategory ?? '—',
            conversation.currentState ? <StatusBadge value={conversation.currentState === 'FINAL_RESPONSE' ? 'healthy' : 'pending'} /> : '—',
            conversation.messageCount,
            conversation.lastMessage ?? '—',
            timeAgo(conversation.updatedAt),
          ])}
        />
      </section>
      <section className="panel">
        <div className="panel-title"><MessageSquareText size={18} /> Recent message audit</div>
        <DataTable
          columns={['User', 'Direction', 'Category', 'Message', 'Latency', 'Result', 'Time']}
          rows={messages.map((message) => [
            message.userName,
            message.direction,
            message.category ?? '—',
            message.text,
            secondsFromMs(message.latencyMs),
            message.successful === false ? <StatusBadge value="degraded" /> : <StatusBadge value="healthy" />,
            timeAgo(message.createdAt),
          ])}
        />
      </section>
    </div>
  );
}
