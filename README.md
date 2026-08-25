# PharMaMa

**A Web-Based System for Pharmacy Inventory Tracking and Sales Management**

PharMaMa is a web-based inventory and sales management system for pharmacies. It allows staff to track medicine stock by batch and expiry date, and process sales through a point-of-sale (POS) interface that handles item selection, payment, change computation, and receipt generation with automatic stock deduction. The system also provides reports on sales and inventory status, helping prevent stockouts of essential medicines.

## Main Objectives

1. Design and implement a system that streamlines pharmacy product management and point-of-sale operations.
2. Develop an automated sales transaction module that reduces manual processing and minimizes errors.
3. Develop a dashboard interface that provides real-time visibility into inventory and sales data for faster decision-making.

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

