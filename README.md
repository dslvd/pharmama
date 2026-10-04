# PharMaMa

**A Web-Based System for Pharmacy Inventory Tracking and Sales Management**

PharMaMa is a web-based inventory and sales management system for pharmacies. Staff track medicine stock by batch and expiry date and ring up sales at a point-of-sale (POS) screen that prices each item, deducts stock automatically and prints a receipt. Owners get a dashboard of sales and inventory status and an audit logbook of every change, helping prevent stockouts and catch expiring medicine early.

Live: <https://se3pharmama.vercel.app>

## Main Objectives

1. Design and implement a system that streamlines pharmacy product management and point-of-sale operations.
2. Develop an automated sales transaction module that reduces manual processing and minimizes errors.
3. Develop a dashboard interface that provides real-time visibility into inventory and sales data for faster decision-making.

## Features

| Feature               | What it does                                                                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product catalog       | Add, edit and delete products (name, generic name, category, price). A product with sales or stock can't be deleted.                                                 |
| Stock batches         | Track each batch's quantity and expiry date. Batch numbers are unique per product; expiry must be in the future.                                                     |
| Point of sale         | Build a cart from in-stock products. Sells from the earliest-expiring batch first, refuses expired stock, prices from the database and shows a printable receipt.     |
| Transaction history   | Every sale with who handled it. A completed sale can be cancelled or refunded once, which puts its stock back.                                                       |
| Search & filters      | Search and filter products, stock, sales and the logbook by keyword, category, status, action or date order.                                                         |
| Dashboard             | Today's sales vs. yesterday, transaction and stock counts, a sales chart (today / week / month / year), a low-stock watchlist and the latest transactions.           |
| Low-stock/expiry alerts | On the Stocks page, batches at or below 20 units are flagged low, batches expiring within 30 days show a countdown and expired batches are marked expired.      |
| Audit logbook         | Records who created, updated, deleted, cancelled or refunded what, with before/after values for updates.                                                             |
| Roles                 | **Staff** use the POS and manage stock. **Owners** also see the dashboard, products and logbook, and can delete stock. Owners can switch to a password-protected pharmacist (staff) view. |

**Out of scope for now:** report export (PDF/CSV), payment handling and change computation, purchase/supplier management, account management in the UI, and multiple branches. Receipts are not official receipts.

## Tech Stack

**Language:** TypeScript

| Layer    | Tools                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Frontend | [Next.js](https://nextjs.org/) 16, React 19, Tailwind CSS 4, Base UI, Recharts, lucide-react             |
| Backend  | [NestJS](https://nestjs.com/) 11, [Prisma](https://www.prisma.io/) 7, Passport (JWT), bcrypt, class-validator |
| Database | [PostgreSQL](https://www.postgresql.org/)                                                               |
| Testing  | Jest                                                                                                    |
| Hosting  | Vercel (frontend), Render (backend)                                                                     |
| Tools    | GitHub (version control), Excalidraw (wireframes & mockups), Trello (sprint management)                 |

## Getting Started

### Prerequisites

- Node.js 22 (Render builds with 22.11)
- A PostgreSQL database
- npm

### Setup

1. Clone the repository and install both apps:

   ```bash
   git clone https://github.com/dslvd/pharmama.git
   cd pharmama
   npm install --prefix backend
   npm install --prefix frontend
   ```

2. Create `backend/.env` (copy `backend/.env.example`):

   ```env
   # used by both Prisma migrations and the running app
   DATABASE_POOLED_URL="postgresql://user:password@localhost:5432/pharmama"
   # signs login tokens; the backend won't start without it
   JWT_SECRET="a-long-random-string"
   # the frontend dev server already uses 3000
   PORT=4000
   ```

3. Create `frontend/.env` pointing at the backend:

   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4000"
   ```

4. Apply the database migrations and generate the Prisma client:

   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. Start both servers in separate terminals:

   ```bash
   # backend, http://localhost:4000
   cd backend
   npm run start:dev
   ```

   ```bash
   # frontend, http://localhost:3000
   cd frontend
   npm run dev
   ```

   The backend only accepts browser requests from `http://localhost:3000` and the production site (CORS in `backend/src/main.ts`), so keep the frontend on port 3000.

6. Sign in. There is no sign-up page and no seed data: ask an existing owner for an account.

## Project Structure

```
pharmama/
├── backend/      # NestJS API + Prisma schema and migrations (see backend/README.md)
├── frontend/     # Next.js app (see frontend/README.md)
├── render.yaml   # Render blueprint for the backend
└── vercel.json   # Vercel config for the frontend
```

## Deployment

- **Backend (Render):** `render.yaml` builds with `npm ci && npx prisma generate && npm run build` and starts with `npx prisma migrate deploy && npm run start:prod`, so pending migrations run on every deploy. Set `DATABASE_POOLED_URL` and `JWT_SECRET` in the Render dashboard.
- **Frontend (Vercel):** `vercel.json` serves the `frontend/` app. Set `NEXT_PUBLIC_API_URL` to the Render backend URL.

## Team

| Name             | Role                               | Notes                                                   |
| ---------------- | ---------------------------------- | ------------------------------------------------------- |
| Estilo, Matthew  | Project Manager / Team Lead        | Coordinates tasks, leads defense                        |
| Lago, Nelson     | Lead Developer / Backend Developer | Designs schema, builds transaction/management functions |
| Tingson, Reinwel | Frontend Developer                 | Builds UI components, connects frontend to backend APIs |
| Peregil, Barby   | UI/UX Designer                     | Wireframes, layout, colors                              |
| Jambaro, Trisha  | QA / Tester                        | Tests system functionality                              |
| Giyangan, Jeremy | Documentation Lead                 | Report paper, screenshots                               |

## License

This project is developed for academic purposes as part of a final project in Software Development III.
