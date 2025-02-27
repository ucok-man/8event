/*
  Warnings:

  - Added the required column `initialAmount` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "initialAmount" INTEGER NOT NULL;
