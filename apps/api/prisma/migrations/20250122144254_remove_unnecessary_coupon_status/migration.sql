/*
  Warnings:

  - The values [IN_USE] on the enum `CouponStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CouponStatus_new" AS ENUM ('NOT_USED', 'USED');
ALTER TABLE "Coupon" ALTER COLUMN "couponStatus" TYPE "CouponStatus_new" USING ("couponStatus"::text::"CouponStatus_new");
ALTER TYPE "CouponStatus" RENAME TO "CouponStatus_old";
ALTER TYPE "CouponStatus_new" RENAME TO "CouponStatus";
DROP TYPE "CouponStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "couponStatus" SET DEFAULT 'NOT_USED';
