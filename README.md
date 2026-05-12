# Britam Bot Admin Frontend

Professional Vite + React + TypeScript admin frontend for the Teams/Copilot bot.

## What works in dummy-data mode

- Dashboard insight cards navigate to the correct views.
- Approve/reject single users.
- Bulk approve/reject pending users.
- Users & Access CRUD-like controls: approve, suspend, grant permission, revoke permission.
- Category CRUD: create, edit, enable/disable, delete.
- Agent health check simulation.
- Reports: create and download CSV.
- Settings: edit local values and reset demo data.
- Local state persists in browser localStorage until reset.

## Run locally

```bash
yarn install
# or npm install
yarn dev
```

Open:

```text
http://localhost:5173
```

## Run with Docker, no Nginx

```bash
docker compose down -v
docker compose build --no-cache
docker compose up
```

Open:

```text
http://SERVER_IP:5173
```

## Switch to Django APIs later

Set:

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:8000/api
VITE_BOT_SECRET=dev-bot-secret
```

Expected future APIs are documented in `src/services/api.ts` and on the Settings page.
