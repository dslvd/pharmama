# PharMaMa - Backend

PharMaMa is a web-based inventory and sales management system for pharmacies. It allows staff to track medicine stock by batch and expiry date, and process sales through a point-of-sale (POS) interface that handles item selection, payment, change computation, and receipt generation with automatic stock deduction. The system also provides reports on sales and inventory status, helping reduce waste from expired stock and prevent stockouts of essential medicines.

This backend is powered by the NestJS framework, which enforces a clean and organized file structure.

## Installation

Install dependencies:
`npm install`

## Usage

Migrate prisma changes:
`npx prisma migrate dev`

Generate artifacts:
`npx prisma generate`

Start nestjs:
`npm run start`

## Contact

Developer:
`Nelson Lago`
lagonelson77@gmail.com
