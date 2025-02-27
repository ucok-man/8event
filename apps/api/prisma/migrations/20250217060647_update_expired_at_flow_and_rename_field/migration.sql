/*
  Warnings:

  - You are about to drop the column `ticketQuantity` on the `TransactionTicket` table. All the data in the column will be lost.
  - You are about to drop the column `discountAmount` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `isUsed` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Voucher` table. All the data in the column will be lost.
  - Added the required column `totalDiscount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `TransactionTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `TransactionTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('NOT_USE', 'USED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "Voucher" DROP CONSTRAINT "Voucher_eventId_fkey";

-- AlterTable
ALTER TABLE "PointBalance" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiredAt" TIMESTAMP(3),
ALTER COLUMN "point" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "totalDiscount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "usedPoints" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TransactionTicket" DROP COLUMN "ticketQuantity",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "discountAmount",
DROP COLUMN "endDate",
DROP COLUMN "eventId",
DROP COLUMN "isUsed",
DROP COLUMN "startDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "VoucherStatus" NOT NULL;
