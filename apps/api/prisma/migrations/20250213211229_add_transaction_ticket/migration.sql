/*
  Warnings:

  - You are about to drop the column `ticketId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `ticketQuantity` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `totalTicketQuantity` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_ticketId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "ticketId",
DROP COLUMN "ticketQuantity",
ADD COLUMN     "totalTicketQuantity" INTEGER NOT NULL,
ALTER COLUMN "usedPoints" DROP NOT NULL,
ALTER COLUMN "usedPoints" DROP DEFAULT;

-- CreateTable
CREATE TABLE "TransactionTicket" (
    "transactionId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "ticketQuantity" INTEGER NOT NULL,

    CONSTRAINT "TransactionTicket_pkey" PRIMARY KEY ("transactionId","ticketId")
);

-- AddForeignKey
ALTER TABLE "TransactionTicket" ADD CONSTRAINT "TransactionTicket_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTicket" ADD CONSTRAINT "TransactionTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
