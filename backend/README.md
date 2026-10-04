# PharMaMa — Backend

The PharMaMa REST API, built with NestJS, Prisma and PostgreSQL. It owns every business rule: pricing, stock deduction, batch and expiry checks, status changes, roles and the audit log. The frontend only displays what it returns.

For the project overview and full local setup, see the [root README](../README.md).

## Scripts

| Command                 | What it does                                                    |
| ----------------------- | --------------------------------------------------------------- |
| `npm run start:dev`     | Start in watch mode                                             |
| `npm run build`         | Compile to `dist/`                                              |
| `npm run start:prod`    | Run the compiled build (`node dist/main`)                       |
| `npm test`              | Unit tests (no database needed)                                 |
| `npm run test:cov`      | Unit tests with coverage                                        |
| `npm run test:e2e`      | End-to-end tests; boots the whole app, so needs a working `.env` |
| `npm run lint`          | ESLint with `--fix`                                             |
| `npx prisma migrate dev`| Apply migrations locally (create one after editing the schema)  |
| `npx prisma generate`   | Regenerate the client into `src/generated/prisma`               |

## Environment

See `.env.example`.

| Variable              | Required | Used for                                                                 |
| --------------------- | -------- | ------------------------------------------------------------------------ |
| `DATABASE_POOLED_URL` | yes      | Postgres connection for both Prisma migrations (`prisma.config.ts`) and the app (`src/prisma/prisma.service.ts`) |
| `JWT_SECRET`          | yes      | Signs login tokens. The app won't boot without it; changing it logs everyone out |
| `PORT`                | no       | Defaults to 3000, which clashes with the frontend dev server; use 4000   |

CORS only allows `http://localhost:3000` and `https://se3pharmama.vercel.app` (`src/main.ts`).

## Structure

```
src/
├── main.ts              # bootstrap: CORS, global ValidationPipe
├── app.module.ts
├── auth/                # login, /auth/me, JWT + local strategies, Roles guard/decorator
├── users/               # account creation, safe user select
├── product/             # product catalog
├── stock/               # stock batches
├── transaction/         # sales, cancel/refund
├── sales/               # dashboard sales overview
├── audit-log/           # read-only audit trail
├── prisma/              # PrismaService (pg pool adapter)
├── util/                # Result type, domain errors, audit helpers
└── generated/prisma/    # generated Prisma client (don't edit)
prisma/
├── schema.prisma
└── migrations/
```

## Architecture

Each feature module is split into three layers:

| File                 | Role                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `*.domain.ts`        | **Pure rules.** No database, no Nest, no clock. Functions take plain data (and `now` when time matters) and return a `Result`. Covered by `*.domain.spec.ts`. |
| `*.service.ts`       | **Effects.** Loads data, runs it through the domain functions, writes, and records the audit entry, all inside one DB transaction. |
| `*.controller.ts`    | **HTTP edge.** Guards and roles, DTO validation, and `unwrap()` to turn a `Result` into a response or an HTTP error. |

DTOs and validation live in `*.validation.ts`.

### Errors as values

Domain code never throws for expected failures. It returns a `Result` (`util/results.util.ts`):

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

Steps are chained with `map`, `andThen`, `andThenAsync`, `fromNullable`, `sequence`, `traverseAsync`, `fold` and `tapAsync`. Errors are a small union (`util/domain-error.ts`) that `unwrap()` maps to HTTP status codes:

| `DomainError` kind | HTTP status |
| ------------------ | ----------- |
| `NotFound`         | 404         |
| `Invalid`          | 400         |
| `Conflict`         | 409         |
| `Unauthorized`     | 401         |

`runInTransaction()` (`util/domain-error.util.ts`) runs a pipeline in a Prisma transaction and rolls it back when the result is an error, so a failed sale never leaves stock half-deducted.

### Audit log

Every create, update, delete, cancel and refund of a product, stock batch or transaction writes an `AuditLog` row in the same transaction as the change, recording who made it, the entity and its id. Updates and status changes also store `{ old, new }` values for the changed fields (`util/audit-diff.util.ts`).

## Roles

| Role    | Who                 | Access                                                                    |
| ------- | ------------------- | ------------------------------------------------------------------------- |
| `STAFF` | Pharmacy personnel  | Products (read), stock (read/add/edit), transactions                       |
| `OWNER` | Pharmacy owner      | Everything, including product writes, stock deletes, sales overview, audit log and creating accounts |
| `ADMIN` | Developers          | Same permissions as `OWNER`; can't be created through the API              |

New accounts default to `STAFF`. Deactivated accounts (`isActive = false`) can't log in.

## API

All routes except `GET /` and `POST /auth/login` need an `Authorization: Bearer <token>` header. Request bodies are validated, and unknown fields are rejected with a 400. Decimal fields (prices, totals) are returned as strings.

### Auth & users

| Method | Path          | Roles        | Body / notes                                                                  |
| ------ | ------------- | ------------ | ----------------------------------------------------------------------------- |
| POST   | `/auth/login` | public       | `{ email, password }` → `{ access_token, user }`. Tokens expire after 1 day.  |
| GET    | `/auth/me`    | any          | The signed-in user (`id, name, email, role`)                                  |
| POST   | `/users`      | OWNER, ADMIN | `{ name, email, password (min 8), role? ("STAFF" \| "OWNER") }`               |

### Products

| Method | Path           | Roles        | Body / notes                                                                       |
| ------ | -------------- | ------------ | ---------------------------------------------------------------------------------- |
| GET    | `/product`     | any          | All products                                                                       |
| POST   | `/product`     | OWNER, ADMIN | `{ name, genericName, category, price }`                                           |
| PATCH  | `/product/:id` | OWNER, ADMIN | Any subset of the create fields                                                    |
| DELETE | `/product/:id` | OWNER, ADMIN | 409 if the product has sales or stock batches                                      |

`category` is one of `ANALGESICS, ANTIBIOTICS, ANTIHISTAMINES, VITAMINS, SUPPLEMENTS, ANTACIDS, HYGIENE, OTHERS`.

### Stock

| Method | Path         | Roles        | Body / notes                                                                                |
| ------ | ------------ | ------------ | ------------------------------------------------------------------------------------------- |
| GET    | `/stock`     | any          | All batches, each with its `product`                                                        |
| POST   | `/stock`     | any          | `{ productId, batchNumber, quantity, expiryDate }`. Expiry must be in the future; the batch number must be unique for the product |
| PATCH  | `/stock/:id` | any          | Any subset of the create fields; same checks for the fields being changed                   |
| DELETE | `/stock/:id` | OWNER, ADMIN | 409 if the batch has sales                                                                  |

### Transactions

| Method | Path                            | Roles | Body / notes                                                                 |
| ------ | ------------------------------- | ----- | ---------------------------------------------------------------------------- |
| GET    | `/transaction`                  | any   | All transactions with their items, products and cashier                      |
| POST   | `/transaction`                  | any   | `{ transactionItems: [{ stockId, quantity }] }`                              |
| PATCH  | `/transaction/:id/updateStatus` | any   | `{ status: "CANCELLED" \| "REFUNDED" }`                                      |
| PATCH  | `/transaction/:id`              | any   | Shortcut for cancelling (no body)                                            |

Creating a sale:

- Merges repeated `stockId`s.
- Rejects missing, expired or short batches (400). Error messages name the product and batch.
- Prices each line from the product's current price. The client never sends prices.
- Deducts stock with a conditional decrement, so two cashiers can't sell the same last units (409 "Stock changed during checkout").
- Saves the sale as `COMPLETED`, handled by the signed-in user.

Only a `COMPLETED` transaction can change status, and only once. Cancelling or refunding puts the stock back. A cancel is logged as `CANCEL`; a refund is logged as `UPDATE`.

### Sales overview & audit log

| Method | Path              | Roles        | Notes                                                                                      |
| ------ | ----------------- | ------------ | ------------------------------------------------------------------------------------------ |
| GET    | `/sales/overview` | OWNER, ADMIN | `?period=Today\|Week\|Month\|Year` (default `Today`) → `[{ label, value }]`, completed sales only, grouped by hour / day / week / month |
| GET    | `/audit-log`      | OWNER, ADMIN | All audit entries with the user who made them                                              |

## Database

Models: `Product`, `Stock` (one row per batch, unique on `productId + batchNumber`), `Transaction`, `TransactionItem` (links a sale to the product and the exact batch sold), `AuditLog` and `User`. See `prisma/schema.prisma`.

After changing the schema, run `npx prisma migrate dev --name <change>` and commit the new folder under `prisma/migrations/`. On Render, `npx prisma migrate deploy` applies pending migrations at startup.
