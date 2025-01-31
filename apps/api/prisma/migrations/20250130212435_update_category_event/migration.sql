/*
  Warnings:

  - You are about to drop the `_EventToEventCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EventToEventCategory" DROP CONSTRAINT "_EventToEventCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToEventCategory" DROP CONSTRAINT "_EventToEventCategory_B_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_EventToEventCategory";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
