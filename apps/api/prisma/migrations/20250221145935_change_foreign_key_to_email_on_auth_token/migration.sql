/*
  Warnings:

  - You are about to drop the column `userId` on the `AuthToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `AuthToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `AuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuthToken" DROP CONSTRAINT "AuthToken_userId_fkey";

-- DropIndex
DROP INDEX "AuthToken_userId_key";

-- AlterTable
ALTER TABLE "AuthToken" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_email_key" ON "AuthToken"("email");

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
