/*
  Warnings:

  - The values [ADD,SUBSTRACT] on the enum `PointBalanceType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `endDate` on the `PointBalance` table. All the data in the column will be lost.
  - You are about to drop the column `pointBalance` on the `PointBalance` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `PointBalance` table. All the data in the column will be lost.
  - You are about to drop the column `expiredAt` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `point` to the `PointBalance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PointBalanceType_new" AS ENUM ('EARN', 'REDEEM');
ALTER TABLE "PointBalance" ALTER COLUMN "type" TYPE "PointBalanceType_new" USING ("type"::text::"PointBalanceType_new");
ALTER TYPE "PointBalanceType" RENAME TO "PointBalanceType_old";
ALTER TYPE "PointBalanceType_new" RENAME TO "PointBalanceType";
DROP TYPE "PointBalanceType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "TransactionStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "PointBalance" DROP COLUMN "endDate",
DROP COLUMN "pointBalance",
DROP COLUMN "startDate",
ADD COLUMN     "point" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "expiredAt",
ALTER COLUMN "status" SET DEFAULT 'WAITING_PAYMENT';
