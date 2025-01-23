/*
  Warnings:

  - You are about to drop the column `couponStatus` on the `Coupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "couponStatus",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "CouponStatus";
