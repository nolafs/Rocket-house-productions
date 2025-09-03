/*
  Warnings:

  - A unique constraint covering the columns `[stripeProductPremiumIdDev]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeProductStandardIdDev]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "isMembershipEntry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeProductPremiumIdDev" TEXT,
ADD COLUMN     "stripeProductStandardIdDev" TEXT;

-- CreateTable
CREATE TABLE "public"."MembershipSettings" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "MembershipSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MembershipInclude" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "includedCourseId" TEXT NOT NULL,

    CONSTRAINT "MembershipInclude_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MembershipSettings_courseId_key" ON "public"."MembershipSettings"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipInclude_membershipId_includedCourseId_key" ON "public"."MembershipInclude"("membershipId", "includedCourseId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductPremiumIdDev_key" ON "public"."Course"("stripeProductPremiumIdDev");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductStandardIdDev_key" ON "public"."Course"("stripeProductStandardIdDev");

-- AddForeignKey
ALTER TABLE "public"."MembershipSettings" ADD CONSTRAINT "MembershipSettings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MembershipInclude" ADD CONSTRAINT "MembershipInclude_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "public"."MembershipSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MembershipInclude" ADD CONSTRAINT "MembershipInclude_includedCourseId_fkey" FOREIGN KEY ("includedCourseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
