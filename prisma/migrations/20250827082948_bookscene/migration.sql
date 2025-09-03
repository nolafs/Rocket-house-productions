-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "bookSceneId" TEXT;

-- CreateTable
CREATE TABLE "public"."BookScene" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "strapline" TEXT,
    "guitarUrl" TEXT,
    "guirarHeadUrl" TEXT,
    "fredboardUrl" TEXT,
    "foregroundUrl" TEXT,
    "midgroundUrl" TEXT,
    "skyUrl" TEXT,
    "backgroundUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookScene_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_bookSceneId_fkey" FOREIGN KEY ("bookSceneId") REFERENCES "public"."BookScene"("id") ON DELETE SET NULL ON UPDATE CASCADE;
