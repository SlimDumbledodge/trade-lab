# 🧠 TradeLab

Trading simulation platform for buying/selling financial assets (full‑stack: NestJS + Prisma backend, Next.js + React frontend).

## Quick structure

- backend/ — NestJS API, Prisma, cron jobs  
- frontend/ — Next.js App Router, React components, pages

## Key files & modules

- Backend main: [`AppModule`](backend/src/app.module.ts) — [backend/src/app.module.ts](backend/src/app.module.ts)  
- Controllers / services:
  - Assets: [`ActifsController`](backend/src/actifs/actifs.controller.ts) — [backend/src/actifs/actifs.controller.ts](backend/src/actifs/actifs.controller.ts)  
  - Assets logic: [`ActifsService`](backend/src/actifs/actifs.service.ts) — [backend/src/actifs/actifs.service.ts](backend/src/actifs/actifs.service.ts)  
  - Finnhub client: [`FinnhubService`](backend/src/common/finnhub/finnhub.service.ts) — [backend/src/common/finnhub/finnhub.service.ts](backend/src/common/finnhub/finnhub.service.ts)  
  - Portfolios: [`PortfoliosService`](backend/src/portfolios/portfolios.service.ts) — [backend/src/portfolios/portfolios.service.ts](backend/src/portfolios/portfolios.service.ts)  
  - Users: [`UsersService`](backend/src/users/users.service.ts) — [backend/src/users/users.service.ts](backend/src/users/users.service.ts)  
  - Market status: [`MarketStatusController`](backend/src/market-status/market-status.controller.ts) — [backend/src/market-status/market-status.controller.ts](backend/src/market-status/market-status.controller.ts)  
- Frontend:
  - Signup form: [`SignupForm`](frontend/components/auth/register-form.tsx) — [frontend/components/auth/register-form.tsx](frontend/components/auth/register-form.tsx)  
  - Login form: [`LoginForm`](frontend/components/auth/login-form.tsx) — [frontend/components/auth/login-form.tsx](frontend/components/auth/login-form.tsx)  
  - NextAuth handler / options: [`authOptions` / handler](frontend/app/api/auth/[...nextauth]/route.ts) — [frontend/app/api/auth/[...nextauth]/route.ts](frontend/app/api/auth/[...nextauth]/route.ts)  
  - Shared types: [frontend/types/types.ts](frontend/types/types.ts)  
  - Sidebar & UI primitives: [frontend/components/ui/sidebar.tsx](frontend/components/ui/sidebar.tsx) — [`NavMain`](frontend/components/nav-main.tsx) — [frontend/components/nav-main.tsx](frontend/components/nav-main.tsx)  
  - Market pages: [frontend/app/market/page.tsx](frontend/app/market/page.tsx) and [frontend/app/market/[symbol]/page.tsx](frontend/app/market/[symbol]/page.tsx)
- DB / seed:
  - Prisma seed script: [backend/prisma/seed.ts](backend/prisma/seed.ts)  
  - Initial assets: [backend/src/utils/seed-actifs.ts](backend/src/utils/seed-actifs.ts)  
- Cron jobs:
  - Assets updater: [`ActifsCron`](backend/src/actifs/actifs.cron.ts) — [backend/src/actifs/actifs.cron.ts](backend/src/actifs/actifs.cron.ts)

## Local setup

1. Clone and install dependencies
   - Backend:
     - cd backend
     - npm install
   - Frontend:
     - cd frontend
     - npm install

2. Environment files
   - Copy `backend/.env.example` → `backend/.env` and set DATABASE_URL, FINNHUB_API_KEY (or FINNHUB_TOKEN), NEXTAUTH_SECRET, JWT_SECRET, etc. — see [backend/.env.example](backend/.env.example)
   - Frontend: create `frontend/.env` with NEXT_PUBLIC_NEST_API_URL (e.g. `http://localhost:3001`)

3. Database
   - cd backend
   - npx prisma migrate dev
   - npx prisma db seed (or run [backend/prisma/seed.ts](backend/prisma/seed.ts) via ts-node)

4. Start services
   - Backend (default port 3001):
     - cd backend
     - npm run start:dev
   - Frontend (Next.js, port 3000):
     - cd frontend
     - npm run dev

## Useful endpoints (examples)

- GET /actifs — protected by JWT — implemented in [`ActifsController.findAll`](backend/src/actifs/actifs.controller.ts) — [backend/src/actifs/actifs.controller.ts](backend/src/actifs/actifs.controller.ts)  
- GET /actifs/:symbol — get single asset — [backend/src/actifs/actifs.controller.ts](backend/src/actifs/actifs.controller.ts)  
- GET /actifs/:symbol/profile — company profile — [backend/src/actifs/actifs.controller.ts](backend/src/actifs/actifs.controller.ts)  
- POST /portfolios/:id/buy or /sell — handled by [`PortfoliosService.buy`](backend/src/portfolios/portfolios.service.ts) / [`PortfoliosService.sell`](backend/src/portfolios/portfolios.service.ts) — [backend/src/portfolios/portfolios.service.ts](backend/src/portfolios/portfolios.service.ts)  
- GET /market-status — [`MarketStatusController.getMarketStatus`](backend/src/market-status/market-status.controller.ts) — [backend/src/market-status/market-status.controller.ts](backend/src/market-status/market-status.controller.ts)

## Authentication

- Frontend uses NextAuth with a Credentials provider — see [frontend/app/api/auth/[...nextauth]/route.ts](frontend/app/api/auth/[...nextauth]/route.ts)  
- Signup posts to `${process.env.NEXT_PUBLIC_NEST_API_URL}/users` via [`SignupForm`](frontend/components/auth/register-form.tsx) — [frontend/components/auth/register-form.tsx](frontend/components/auth/register-form.tsx)

## Background jobs

- Asset price sync runs on a cron: [`ActifsCron.updateActifsPrices`](backend/src/actifs/actifs.cron.ts) → calls [`ActifsService.updateAllActifs`](backend/src/actifs/actifs.service.ts) — [backend/src/actifs/actifs.cron.ts](backend/src/actifs/actifs.cron.ts) — [backend/src/actifs/actifs.service.ts](backend/src/actifs/actifs.service.ts)

## Tests

- Backend (from /backend):
  - npm run test (unit)
  - npm run test:e2e (e2e)
  - Many example specs exist under [backend/src/*/*.spec.ts](backend/src)

## Deployment

- Backend: build Node/Nest app. Required env vars: DATABASE_URL, FINNHUB_API_KEY, NEXTAUTH_SECRET, JWT_SECRET, PORT — main config in [backend/src/main.ts](backend/src/main.ts) and [backend/src/app.module.ts](backend/src/app.module.ts)  
- Frontend: deploy Next.js app (Vercel or equivalent). See [frontend/next.config.ts](frontend/next.config.ts) for image config.

## References in the repo

- Types: [frontend/types/types.ts](frontend/types/types.ts)  
- Utils: [frontend/lib/utils.ts](frontend/lib/utils.ts)  
- UI components: [frontend/components/ui](frontend/components/ui)  
- Prisma schema: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

Contributions welcome — open clear PRs and follow the repo conventions.
