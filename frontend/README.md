# PharMaMa — Frontend

The PharMaMa web app, built with Next.js (App Router), React and Tailwind CSS. Every page is a client component that talks to the [backend API](../backend/README.md). For the project overview and full local setup, see the [root README](../README.md).

## Scripts

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Dev server on <http://localhost:3000> |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | ESLint                               |

## Environment

Create `frontend/.env`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

Run the dev server on port 3000. The backend's CORS only allows `localhost:3000` and the production site.

## Pages

| Route          | Who            | What's there                                                                                       |
| -------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| `/auth`        | everyone       | Sign in                                                                                            |
| `/dashboard`   | owners         | Today's sales vs. yesterday, counts, sales chart, low-stock watchlist, recent transactions; "Pharmacist view" button |
| `/stocks`      | everyone       | Stock batches with low-stock and expiry badges; add/edit (delete for owners only)                  |
| `/products`    | owners         | Product catalog; add/edit/delete                                                                   |
| `/transaction` | everyone       | POS: product picker, current sale, receipt after checkout, sales history with cancel/refund and receipts |
| `/logbook`     | owners         | Audit trail with search and filters                                                                |

`/` redirects to the user's home page: `/dashboard` for owners, `/transaction` for staff.

## Structure

```
src/
├── app/
│   ├── layout.tsx            # root layout, AuthProvider
│   ├── globals.css           # design tokens (colors, radius) and print styles
│   ├── auth/                 # login page
│   └── (app)/                # signed-in pages, wrapped by layout.tsx (auth + role redirects)
│       ├── dashboard/  stocks/  products/  transaction/  logbook/
│       │   ├── page.tsx
│       │   ├── loading.tsx   # skeleton matching the page layout
│       │   └── components/   # components only that page uses
├── components/               # shared: FilterBar, ConfirmDialog, ErrorCard, SideDrawer, ...
│   └── ui/                   # primitives: Modal, Dropdown, table, Skeleton, Base UI wrappers
└── lib/
    ├── api/                  # one file per backend resource
    ├── types/                # API types and shared constants
    ├── utils/                # apiFetch, decimal conversion, formatting, status colors
    ├── auth.tsx              # AuthProvider / useAuth
    ├── roles.ts              # isManager, homeFor, managerOnly
    └── leaveGuard.ts         # "unsaved sale" warning
```

## How things work

**API calls.**
- Every request goes through `apiFetch` (`lib/utils/client.ts`). It adds the bearer token and returns a `Result` (`{ ok: true, value }` or `{ ok: false, error }`) instead of throwing, so pages handle errors as values.
- A 401 on any route except `/auth/login` clears the session and sends the user back to `/auth`.
- The backend sends Decimal fields (prices, totals) as strings. The `lib/api` functions convert them to numbers with `lib/utils/decimal.ts`.

**Auth and roles.**
- The token is kept in `localStorage`. `useAuth()` exposes `user`, `role`, `login`, `logout` and the pharmacist-view controls.
- `(app)/layout.tsx` redirects signed-out users to `/auth`, and redirects staff away from the pages listed in `managerOnly` (`lib/roles.ts`).
- The sidebar (`components/SideDrawer/Navigation.tsx`) hides those same links. Keep the two lists in sync.
- The API enforces roles on its own; the UI checks are only for navigation.

**Pharmacist view.**
- An owner can switch the UI to staff mode from the dashboard. `useAuth().role` then reports `STAFF`.
- Leaving staff mode requires re-entering the owner's password.
- This is UI only: API requests still use the owner's token.

**Point of sale.**
- `ProductPicker` takes stock from the earliest-expiring batches first and splits a quantity across batches if needed. It skips expired batches and anything already in the cart.
- The cart shows one line per product. It sends `{ stockId, quantity }` pairs; the backend sets the prices.
- After checkout, `ReceiptModal` shows a receipt that can be printed (`.receipt-print` in `globals.css`).
- `useLeaveWarning` asks for confirmation before navigating away from an unconfirmed cart.

**Conventions.**
- Dates, times and pesos are formatted with `lib/utils/format.ts` (`en-PH`, `Asia/Manila`), whatever the browser's timezone is.
- The low-stock threshold (20 units) and the "expiring soon" window (30 days) are in `lib/types/stock.ts`.
- Colors come from the CSS variables in `globals.css` (`primary`, `success`, `warning`, `danger`, `info`, each with a `-soft` tint). Use those instead of raw hex values or Tailwind palette colors.
- Tables use the shared parts in `components/ui/table.tsx` (`Table`, `Th`, `Td`, `TableEmpty`, `Badge`).
- Errors from data loading go to `ErrorStack`, which shows dismissible cards that auto-close after 8 seconds.
- Destructive actions (delete, cancel/refund, clearing the cart) go through `ConfirmDialog`.
