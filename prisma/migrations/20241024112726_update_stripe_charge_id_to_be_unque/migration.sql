/*
  Warnings:

  - A unique constraint covering the columns `[accountId,courseId,childId,stripeChargeId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Purchase_accountId_courseId_childId_key";

-- DropIndex
DROP INDEX "Purchase_stripeChargeId_accountId_courseId_childId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_accountId_courseId_childId_stripeChargeId_key" ON "Purchase"("accountId", "courseId", "childId", "stripeChargeId");
