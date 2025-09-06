/*
  Warnings:

  - A unique constraint covering the columns `[stripeProductBasicId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeProductBasicDev]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "basicIsFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeProductBasicDev" TEXT,
ADD COLUMN     "stripeProductBasicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductBasicId_key" ON "public"."Course"("stripeProductBasicId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductBasicDev_key" ON "public"."Course"("stripeProductBasicDev");
