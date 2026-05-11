# Britam Teams Bot Admin Frontend

Professional Vite + React + TypeScript admin portal for the Teams/Copilot bot.

The project starts with realistic dummy data and is structured so it can later consume Django APIs.

## Included dashboards

- Executive dashboard with time filters: today, 7 days, 30 days, 90 days, 12 months, year
- Active bot usage dashboard showing users currently using the bot
- Most active users and active conversations
- Most questioned categories and category demand trends
- Searches/messages per category per day
- Approval center for pending users
- Users and category permission access matrix
- Permission category and agent URL setup
- Message and conversation audit
- Agent health, errors, latency and uptime monitoring
- Reports catalogue for management, audit, category usage and SLA reporting
- Settings page for moving from mock data to Django APIs

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Docker

```bash
docker compose up -d --build
```

## Environment

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_BOT_SECRET=dev-bot-secret
VITE_USE_MOCKS=true
```

When Django APIs are ready:

```env
VITE_USE_MOCKS=false
```

## Expected future Django endpoints

```text
GET  /api/bot/admin/overview/?range=30d
GET  /api/bot/admin/activity/?range=30d
GET  /api/bot/admin/users/
POST /api/bot/admin/users/{id}/approve/
POST /api/bot/admin/users/{id}/reject/
POST /api/bot/admin/users/{id}/suspend/
GET  /api/bot/admin/categories/
POST /api/bot/admin/categories/
PATCH /api/bot/admin/categories/{id}/
POST /api/bot/admin/permissions/grant/
POST /api/bot/admin/permissions/revoke/
GET  /api/bot/admin/conversations/
GET  /api/bot/admin/messages/
GET  /api/bot/admin/agents/
GET  /api/bot/admin/reports/
GET  /api/bot/admin/category-reports/?range=30d
```

## Main source files

```text
src/pages/Dashboard.tsx
src/pages/ActiveUsage.tsx
src/pages/Analytics.tsx
src/pages/Reports.tsx
src/data/mockData.ts
src/services/api.ts
src/types/domain.ts
```
