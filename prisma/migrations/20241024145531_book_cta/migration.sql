-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "bookCta" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bookMessage" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "boardSize" TEXT;
