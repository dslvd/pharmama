/*
  Warnings:

  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `totalAmount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `unitPrice` on the `TransactionItem` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `subtotal` on the `TransactionItem` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[productId,batchNumber]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `handledBy` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STAFF', 'ADMIN', 'OWNER');

-- AlterEnum
ALTER TYPE "AuditEntity" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "handledBy",
ADD COLUMN     "handledBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TransactionItem" ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Stock_productId_expiryDate_idx" ON "Stock"("productId", "expiryDate");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productId_batchNumber_key" ON "Stock"("productId", "batchNumber");

-- CreateIndex
CREATE INDEX "Transaction_handledBy_idx" ON "Transaction"("handledBy");

-- CreateIndex
CREATE INDEX "TransactionItem_productId_idx" ON "TransactionItem"("productId");

-- CreateIndex
CREATE INDEX "TransactionItem_stockId_idx" ON "TransactionItem"("stockId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_handledBy_fkey" FOREIGN KEY ("handledBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
