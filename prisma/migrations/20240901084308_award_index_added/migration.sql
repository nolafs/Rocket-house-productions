/*
  Warnings:

  - A unique constraint covering the columns `[childId,awardTypeId]` on the table `Award` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Award_childId_idx" ON "Award"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "Award_childId_awardTypeId_key" ON "Award"("childId", "awardTypeId");
