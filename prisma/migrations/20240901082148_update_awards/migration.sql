/*
  Warnings:

  - You are about to drop the column `childProgressId` on the `Award` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Award` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Award` table. All the data in the column will be lost.
  - Added the required column `awardTypeId` to the `Award` table without a default value. This is not possible if the table is not empty.
  - Added the required column `childId` to the `Award` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Award" DROP CONSTRAINT "Award_childProgressId_fkey";

-- AlterTable
ALTER TABLE "Award" DROP COLUMN "childProgressId",
DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "awardTypeId" TEXT NOT NULL,
ADD COLUMN     "childId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_awardTypeId_fkey" FOREIGN KEY ("awardTypeId") REFERENCES "AwardType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
