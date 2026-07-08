/*
  Warnings:

  - You are about to drop the column `batchId` on the `TransactionItem` table. All the data in the column will be lost.
  - You are about to drop the `Batch` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stockId` to the `TransactionItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_productId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionItem" DROP CONSTRAINT "TransactionItem_batchId_fkey";

-- AlterTable
ALTER TABLE "TransactionItem" DROP COLUMN "batchId",
ADD COLUMN     "stockId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Batch";

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
