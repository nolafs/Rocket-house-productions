/*
  Warnings:

  - A unique constraint covering the columns `[stripeChargeId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeChargeId,accountId,courseId,childId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Purchase_stripeChargeId_key" ON "Purchase"("stripeChargeId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_stripeChargeId_accountId_courseId_childId_key" ON "Purchase"("stripeChargeId", "accountId", "courseId", "childId");
