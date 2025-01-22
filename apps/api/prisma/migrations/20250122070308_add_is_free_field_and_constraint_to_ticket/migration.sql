/*
  Warnings:

  - Added the required column `isFree` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "isFree" BOOLEAN NOT NULL;

-- Constraint
ALTER TABLE "Ticket"
ADD CONSTRAINT check_isFree_price
CHECK (NOT "isFree" OR "price" = 0);
