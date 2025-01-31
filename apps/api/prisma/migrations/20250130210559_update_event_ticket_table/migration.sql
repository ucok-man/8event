/*
  Warnings:

  - You are about to drop the column `eventImage` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isFree` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `seatsAvailable` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `bannerUrl` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isEventOnline` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('FREE', 'PAID');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventImage",
DROP COLUMN "latitude",
DROP COLUMN "location",
DROP COLUMN "longitude",
ADD COLUMN     "bannerUrl" TEXT NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "isEventOnline" BOOLEAN NOT NULL,
ADD COLUMN     "placeAddress" TEXT,
ADD COLUMN     "placeCity" TEXT,
ADD COLUMN     "placeName" TEXT,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD COLUMN     "urlStreaming" TEXT;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "isFree",
DROP COLUMN "seatsAvailable",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TicketType" NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;
