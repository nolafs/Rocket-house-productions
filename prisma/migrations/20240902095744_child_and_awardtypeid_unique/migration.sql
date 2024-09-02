/*
  Warnings:

  - A unique constraint covering the columns `[awardTypeId,childId]` on the table `Award` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Award_awardTypeId_moduleId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Award_awardTypeId_childId_key" ON "Award"("awardTypeId", "childId");
