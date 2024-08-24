/*
  Warnings:

  - A unique constraint covering the columns `[slug,moduleId,isPublished]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Lesson_moduleId_slug_isPublished_idx" ON "Lesson"("moduleId", "slug", "isPublished");

-- CreateIndex
CREATE INDEX "Lesson_slug_idx" ON "Lesson"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_moduleId_isPublished_key" ON "Lesson"("slug", "moduleId", "isPublished");
