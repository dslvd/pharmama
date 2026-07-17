/*
  Warnings:

  - The values [PENDING] on the enum `TransactionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'CANCEL', 'STOCK_ADJUSTMENT', 'RESTORE_STOCK');

-- CreateEnum
CREATE TYPE "AuditEntity" AS ENUM ('TRANSACTION', 'PRODUCT', 'STOCK', 'TRANSACTIONITEM');

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionStatus_new" AS ENUM ('COMPLETED', 'CANCELLED', 'REFUNDED');
ALTER TABLE "public"."Transaction" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Transaction" ALTER COLUMN "status" TYPE "TransactionStatus_new" USING ("status"::text::"TransactionStatus_new");
ALTER TYPE "TransactionStatus" RENAME TO "TransactionStatus_old";
ALTER TYPE "TransactionStatus_new" RENAME TO "TransactionStatus";
DROP TYPE "public"."TransactionStatus_old";
ALTER TABLE "Transaction" ALTER COLUMN "status" SET DEFAULT 'COMPLETED';
COMMIT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "status" SET DEFAULT 'COMPLETED';

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "entity" "AuditEntity" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "action" "AuditAction" NOT NULL,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
