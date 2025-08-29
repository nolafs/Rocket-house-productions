/*
  Warnings:

  - A unique constraint covering the columns `[stripeProductPremiumId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeProductStandardId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "stripeProductPremiumId" TEXT,
ADD COLUMN     "stripeProductStandardId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductPremiumId_key" ON "public"."Course"("stripeProductPremiumId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductStandardId_key" ON "public"."Course"("stripeProductStandardId");
