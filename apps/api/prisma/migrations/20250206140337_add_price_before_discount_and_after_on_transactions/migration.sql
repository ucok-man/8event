/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `priceAfterDiscount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceBeforeDiscount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "totalPrice",
ADD COLUMN     "priceAfterDiscount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceBeforeDiscount" DOUBLE PRECISION NOT NULL;
