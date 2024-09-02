/*
  Warnings:

  - A unique constraint covering the columns `[childId,moduleId]` on the table `Award` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[childId]` on the table `Award` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Award_childId_moduleId_key" ON "Award"("childId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Award_childId_key" ON "Award"("childId");
