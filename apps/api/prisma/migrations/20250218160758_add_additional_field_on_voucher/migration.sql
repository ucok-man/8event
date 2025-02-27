/*
  Warnings:

  - The values [EXPIRED] on the enum `VoucherStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `description` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VoucherStatus_new" AS ENUM ('NOT_USE', 'USED');
ALTER TABLE "Voucher" ALTER COLUMN "status" TYPE "VoucherStatus_new" USING ("status"::text::"VoucherStatus_new");
ALTER TYPE "VoucherStatus" RENAME TO "VoucherStatus_old";
ALTER TYPE "VoucherStatus_new" RENAME TO "VoucherStatus";
DROP TYPE "VoucherStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'NOT_USE';
