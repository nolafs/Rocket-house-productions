/*
  Warnings:

  - A unique constraint covering the columns `[accountId,courseId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Purchase_accountId_courseId_key" ON "Purchase"("accountId", "courseId");
