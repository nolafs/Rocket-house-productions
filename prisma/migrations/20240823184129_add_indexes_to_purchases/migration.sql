-- DropIndex
DROP INDEX "Purchase_courseId_idx";

-- CreateIndex
CREATE INDEX "Purchase_courseId_accountId_childId_idx" ON "Purchase"("courseId", "accountId", "childId");
