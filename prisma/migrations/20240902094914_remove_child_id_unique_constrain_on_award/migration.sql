/*
  Warnings:

  - A unique constraint covering the columns `[awardTypeId,moduleId]` on the table `Award` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Award_childId_awardTypeId_key";

-- DropIndex
DROP INDEX "Award_childId_key";

-- DropIndex
DROP INDEX "Award_childId_moduleId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Award_awardTypeId_moduleId_key" ON "Award"("awardTypeId", "moduleId");
