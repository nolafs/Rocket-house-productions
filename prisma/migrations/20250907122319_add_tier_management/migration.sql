-- CreateEnum
CREATE TYPE "public"."TierType" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- AlterTable
ALTER TABLE "public"."ParentPin" ADD COLUMN     "pinAuthTag" TEXT,
ADD COLUMN     "pinCipher" TEXT,
ADD COLUMN     "pinIv" TEXT;

-- CreateTable
CREATE TABLE "public"."Tier" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "type" "public"."TierType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "purchaseType" INTEGER,
    "sales" BOOLEAN NOT NULL DEFAULT false,
    "free" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "mostPopular" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stripeId" TEXT,
    "stripeIdDev" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tier_stripeId_key" ON "public"."Tier"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_stripeIdDev_key" ON "public"."Tier"("stripeIdDev");

-- CreateIndex
CREATE INDEX "Tier_courseId_type_idx" ON "public"."Tier"("courseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_courseId_type_key" ON "public"."Tier"("courseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_courseId_name_key" ON "public"."Tier"("courseId", "name");

-- AddForeignKey
ALTER TABLE "public"."Tier" ADD CONSTRAINT "Tier_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
