/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `realTeam` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "isAvailable",
DROP COLUMN "points",
DROP COLUMN "realTeam",
ADD COLUMN     "available_for_transfer" BOOLEAN NOT NULL DEFAULT true;
