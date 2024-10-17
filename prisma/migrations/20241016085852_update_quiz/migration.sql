-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "boardCordinates" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "type" TEXT DEFAULT 'text';

-- AlterTable
ALTER TABLE "Questionary" ADD COLUMN     "imageUrl" TEXT;
