# 📈 TradeLab

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4-black? style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E? style=for-the-badge&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)

**A trading simulation platform to practice investing without financial risk.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API](#-api-endpoints) • [Roadmap](#-roadmap)

</div>

---

## 🎯 About

**TradeLab** is a full-stack application that allows users to simulate buying and selling financial assets with real-time market data. Each user starts with a virtual portfolio of **10,000€** and can practice trading in realistic conditions.

> ⚠️ **MVP** - This project is under active development. New features are coming regularly!

---

## ✨ Features

### 📊 Portfolio Management

- Complete dashboard with performance visualization
- Track total value and portfolio evolution
- Asset allocation with automatic weighting
- Portfolio snapshots history

### 💹 Trading

- Buy/Sell stocks with real-time **bid/ask** prices
- Market data powered by **Alpaca** & **Finnhub**
- Automatic unrealized P&L calculation
- Complete transaction history

### 📈 Visualization

- Price evolution charts (OHLC)
- Portfolio performance charts
- Modern interface with dark/light theme

### 🔐 Authentication

- Secure sign up / sign in
- JWT management with NextAuth.js
- Password reset via email

### ⏰ Real-Time

- Automatic price updates via cron jobs
- Real-time market status (open/closed)
- Trading days calendar

---

## 🛠 Tech Stack

### Backend

| Technology       | Usage               |
| ---------------- | ------------------- |
| **NestJS 11**    | REST API Framework  |
| **Prisma 7**     | ORM & migrations    |
| **PostgreSQL**   | Database            |
| **Passport JWT** | Authentication      |
| **Swagger**      | API Documentation   |
| **Sentry**       | Monitoring & errors |

### Frontend

| Technology                | Usage                        |
| ------------------------- | ---------------------------- |
| **Next.js 15**            | React Framework (App Router) |
| **React 19**              | UI Library                   |
| **TypeScript**            | Static typing                |
| **Tailwind CSS 4**        | Styling                      |
| **Radix UI**              | Accessible components        |
| **TanStack Query**        | Server state management      |
| **Recharts**              | Charts                       |
| **React Hook Form + Zod** | Forms & validation           |

### External APIs

- **Alpaca Markets** - Real-time market data
- **Finnhub** - Company information & prices

---

## 📁 Project Structure

```
trade-lab/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── alpaca/         # Alpaca API integration
│   │   ├── assets/         # Assets management
│   │   ├── assets-price/   # Price history
│   │   ├── auth/           # JWT authentication
│   │   ├── email/          # Email service
│   │   ├── finnhub/        # Finnhub integration
│   │   ├── market-status/  # Market status
│   │   ├── portfolios/     # Portfolio management
│   │   ├── transactions/   # Transaction history
│   │   └── users/          # User management
│   └── prisma/             # Schema & migrations
│
├── frontend/               # Next.js Application
│   ├── app/               # Pages (App Router)
│   │   ├── market/        # Market pages
│   │   ├── portfolio/     # Portfolio pages
│   │   ├── transactions/  # History
│   │   └── ...
│   ├── components/        # React components
│   │   ├── charts/        # Charts
│   │   ├── portfolio/     # Portfolio components
│   │   └── ui/            # UI components (shadcn)
│   ├── hooks/             # Custom hooks
│   ├── mutations/         # TanStack Query mutations
│   └── lib/               # Utilities
│
└── conception/            # Diagrams (ERD)
```

---

## 🚀 Installation

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- pnpm (recommended) or npm

### 1. Clone the repository

```bash
git clone https://github.com/your-username/trade-lab.git
cd trade-lab
```

### 2. Backend

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys and DATABASE_URL

# Migrations & seed
npx prisma migrate dev
npx prisma db seed

# Start the server (port 3001)
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
pnpm install

# Configure environment variables
# Create .env.local with:
# NEXT_PUBLIC_NEST_API_URL=http://localhost:3001
# NEXTAUTH_SECRET=your-secret
# NEXTAUTH_URL=http://localhost:3000

# Start the application (port 3000)
pnpm dev
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/auth/login`           | Login                  |
| POST   | `/users`                | Sign up                |
| POST   | `/auth/forgot-password` | Request password reset |
| POST   | `/auth/reset-password`  | Reset password         |

### Assets

| Method | Endpoint                 | Description     |
| ------ | ------------------------ | --------------- |
| GET    | `/assets`                | List all assets |
| GET    | `/assets/:symbol`        | Asset details   |
| GET    | `/assets/:symbol/prices` | Price history   |

### Portfolio

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| GET    | `/portfolios/:id`           | Portfolio details |
| POST   | `/portfolios/:id/buy`       | Buy an asset      |
| POST   | `/portfolios/:id/sell`      | Sell an asset     |
| GET    | `/portfolios/:id/assets`    | Portfolio assets  |
| GET    | `/portfolios/:id/snapshots` | Value history     |

### Transactions

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| GET    | `/transactions` | Transaction history |

### Market

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | `/market-status` | Market status |

---

## 🧪 Tests

```bash
# Backend - Unit tests
cd backend
npm run test

# Backend - E2E tests
npm run test:e2e

# Backend - Coverage
npm run test:cov
```

---

## 🔮 Roadmap

### In Progress

- [ ] Advanced performance statistics
- [ ] Optimized mobile responsive

### Coming Soon

- [ ] 🏆 User leaderboard
- [ ] 🔔 Custom price alerts
- [ ] 📰 Financial news integration
- [ ] 🎯 Trading goals & gamification
- [ ] 📊 Technical indicators (RSI, MACD, etc.)
- [ ] 💱 Cryptocurrency support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Built with ❤️ as a personal project to learn and demonstrate my full-stack development skills.

---

<div align="center">

**⭐ If you like this project, feel free to give it a star!**

</div>
