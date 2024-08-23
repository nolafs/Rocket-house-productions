-- DropIndex
DROP INDEX "Course_categoryId_idx";

-- DropIndex
DROP INDEX "Lesson_moduleId_idx";

-- DropIndex
DROP INDEX "Module_courseId_idx";

-- CreateIndex
CREATE INDEX "Course_categoryId_slug_idx" ON "Course"("categoryId", "slug");

-- CreateIndex
CREATE INDEX "Lesson_moduleId_slug_idx" ON "Lesson"("moduleId", "slug");

-- CreateIndex
CREATE INDEX "Module_courseId_slug_idx" ON "Module"("courseId", "slug");
