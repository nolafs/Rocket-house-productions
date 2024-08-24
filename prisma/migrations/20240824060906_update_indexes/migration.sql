-- DropIndex
DROP INDEX "Course_categoryId_slug_idx";

-- CreateIndex
CREATE INDEX "Course_slug_idx" ON "Course"("slug");

-- CreateIndex
CREATE INDEX "Module_courseId_idx" ON "Module"("courseId");

-- CreateIndex
CREATE INDEX "Module_slug_idx" ON "Module"("slug");
