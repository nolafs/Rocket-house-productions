-- AlterTable
ALTER TABLE "ChildProgress" ADD COLUMN     "courseId" TEXT NOT NULL DEFAULT '0a1cf411-234d-40d8-a50c-80f7dd509950';

-- AddForeignKey
ALTER TABLE "ChildProgress" ADD CONSTRAINT "ChildProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
