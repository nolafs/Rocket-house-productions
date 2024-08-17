-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "CategoryLesson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLesson_name_key" ON "CategoryLesson"("name");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryLesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
