-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member';

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "type" TEXT;
