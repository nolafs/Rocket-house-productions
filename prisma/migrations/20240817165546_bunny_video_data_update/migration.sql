/*
  Warnings:

  - You are about to drop the column `assetId` on the `BunnyData` table. All the data in the column will be lost.
  - You are about to drop the column `playbackId` on the `BunnyData` table. All the data in the column will be lost.
  - Added the required column `videoId` to the `BunnyData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoLibId` to the `BunnyData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BunnyData" DROP COLUMN "assetId",
DROP COLUMN "playbackId",
ADD COLUMN     "title" TEXT,
ADD COLUMN     "videoId" TEXT NOT NULL,
ADD COLUMN     "videoLibId" TEXT NOT NULL;
