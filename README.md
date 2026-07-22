# PharMaMa

**A Web-Based System for Pharmacy Inventory Tracking and Sales Management**

## Problem Statement

Many small to medium-sized pharmacies still depend on manual logs or spreadsheets to manage their stock and sales. This practice often leads to expired medicines going unnoticed, fast-moving items running out unexpectedly, and unreliable sales figures. Over time, these issues slow down daily operations and raise the likelihood of costly inventory mistakes. PharMaMa digitizes inventory and transaction management to address these gaps.

## Target Users

- Pharmacy personnel responsible for daily inventory and sales operations (staff who manage medicine records, process transactions, and monitor stock/expiry)
- Pharmacy owners and supervisors who need sales reports and inventory summaries for decision-making

## Description

PharMaMa is a web-based inventory and sales management system for pharmacies. It allows staff to track medicine stock by batch and expiry date, and process sales through a point-of-sale (POS) interface that handles item selection, payment, change computation, and receipt generation with automatic stock deduction. The system also provides reports on sales and inventory status, helping prevent stockouts of essential medicines.

## Main Objectives

1. Design and implement a system that streamlines pharmacy product management and point-of-sale operations.
2. Develop an automated sales transaction module that reduces manual processing and minimizes errors.
3. Develop a dashboard interface that provides real-time visibility into inventory and sales data for faster decision-making.

## Core Features

1. **Product Management** — Track all pharmacy products, including stock levels and batch numbers.
2. **Sales Transactions** — Process sales quickly, with totals and change computed automatically.
3. **Transaction History** — Maintain a record of past sales, returns, and transactions for easy tracking and reference, including cancellation with automatic stock restoration.
4. **Search & Filters** — Quickly find medicines or items using keywords or simple categories.
5. **Dashboard** — Displays today's total sales and key updates on one screen for a quick overview.
6. **Audit Logging** — Tracks changes across the system for accountability and traceability.

### Out of Scope (for now)

- Low-stock / expiry alerts
- Role-based access (separate cashier vs. manager permissions)
- Advanced analytics / detailed sales charts

## Tech Stack

**Language:** TypeScript

**Frontend**
- [Next.js](https://nextjs.org/)

**Backend**
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/) (ORM)

**Database**
- [PostgreSQL](https://www.postgresql.org/)

**Tools & Platforms**
- GitHub — version control
- Excalidraw — wireframes & design mockups
- Trello — project/sprint management

> **Note:** The initial plan targeted Vercel (frontend) and Railway (backend) for hosting. The project currently deploys the backend to [Render](https://render.com/) with [Supabase](https://supabase.com/) as the managed PostgreSQL provider.

## Functional Programming Concepts

This project is developed for a Functional Programming course and deliberately applies FP concepts across its modules:

- **Product Management** — *Immutability, Declarative Programming, Functional Error Handling.* Stock updates create new records rather than mutating originals; Prisma queries declare *what* data is needed; operations like adding stock return explicit success/failure outcomes.
- **Sales Transactions** — *Pure Functions, Declarative Programming, Immutability, Functional Error Handling.* Core calculations (totals, discounts, change) are pure and side-effect-free; receipts are built with `map()`/`reduce()` chains; saved transactions are never edited directly — corrections use new adjustment/reversal records; errors (insufficient stock, invalid payment, cancellations) return typed outcomes.
- **Transaction History** — *Higher-Order Functions, Declarative Programming.* Uses `.filter()`, `.map()`, `.reduce()` to filter by date range, reshape records, and sum totals.
- **Search & Filters** — *Higher-Order Functions, Declarative Programming.* A reusable `filterBy(criteria)` helper serves products, categories, or stock status without duplicated logic.
- **Dashboard** — *Pure Functions, Function Composition.* Metrics (daily sales, low-stock alerts, near-expiry counts) are computed deterministically; smaller functions are composed together (e.g., `filterExpiredSoon()` into `countItems()`) to build summaries from simple, reusable parts.

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- PostgreSQL database instance
- npm or pnpm

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd pharmama
   ```

2. Install dependencies for both frontend and backend
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Set up environment variables

   Create a `.env` file in the backend directory with your database connection string and other required variables:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

4. Run database migrations
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. Start the development servers
   ```bash
   # Backend
   npm run start:dev

   # Frontend (in a separate terminal)
   cd ../frontend
   npm run dev
   ```

## Project Structure

```
pharmama/
├── frontend/     # Next.js application
├── backend/      # NestJS application with Prisma
└── README.md
```

## Team

| Name | Role | Notes |
|------|------|-------|
| Estilo, Matthew | Project Manager / Team Lead | Coordinates tasks, leads defense |
| Lago, Nelson | Lead Developer / Backend Developer | Designs schema, builds transaction/management functions |
| Tingson, Reinwel | Frontend Developer | Builds UI components, connects frontend to backend APIs |
| Peregil, Barby | UI/UX Designer | Wireframes, layout, colors |
| Jambaro, Trisha | QA / Tester | Tests system functionality |
| Giyangan, Jeremy | Documentation Lead | Report paper, screenshots |

## Wireframe / User Flow

The core user flow moves through: **Log In → Dashboard → Transaction → Stocks → Log Book**, each with an expandable/collapsible navigation sidebar. See `docs/wireframe.png` (or the design assets in Excalidraw) for the full mockups.

## References

Development and Quality Evaluation of a Web-Based Drug Inventory System for Pharmacy Management. (2026). Retrieved from http://journal.unusia.ac.id/nuai/article/download/1933/792/6938

## License

This project is developed for academic purposes as part of a final project in Software Development III.
