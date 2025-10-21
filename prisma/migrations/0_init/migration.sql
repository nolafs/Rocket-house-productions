-- CreateEnum
CREATE TYPE "TierType" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM', 'UPGRADE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "recentStripeCheckoutId" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "membershipSettingsId" TEXT,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttachmemtType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AttachmemtType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attachmentTypeId" TEXT,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT,
    "lessonId" TEXT,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "awardTypeId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AwardType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "badgeUrl" TEXT,
    "points" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AwardType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookScene" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "strapline" TEXT,
    "guitarUrl" TEXT,
    "foregroundUrl" TEXT,
    "midgroundUrl" TEXT,
    "skyUrl" TEXT,
    "backgroundUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fretboardUrl" TEXT,
    "guitarHeadUrl" TEXT,

    CONSTRAINT "BookScene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BunnyData" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT,
    "videoId" TEXT NOT NULL,
    "videoLibId" TEXT NOT NULL,

    CONSTRAINT "BunnyData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryLesson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePicture" TEXT,
    "birthday" TIMESTAMP(3) NOT NULL,
    "parentConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,
    "notifications" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildProgress" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "currentProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "replayCount" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT NOT NULL DEFAULT '0a1cf411-234d-40d8-a50c-80f7dd509950',

    CONSTRAINT "ChildProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildScore" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT,
    "bookSceneId" TEXT,
    "order" INTEGER DEFAULT 0,
    "stripeProductPremiumId" TEXT,
    "stripeProductStandardId" TEXT,
    "isMembershipEntry" BOOLEAN NOT NULL DEFAULT false,
    "stripeProductPremiumIdDev" TEXT,
    "stripeProductStandardIdDev" TEXT,
    "basicIsFree" BOOLEAN NOT NULL DEFAULT false,
    "stripeProductBasicDev" TEXT,
    "stripeProductBasicId" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KvTemp" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KvTemp_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "moduleId" TEXT NOT NULL,
    "prismaSlug" TEXT,
    "slug" TEXT,
    "categoryId" TEXT,
    "videoId" TEXT,
    "videoLibId" TEXT,
    "bookCta" BOOLEAN DEFAULT false,
    "bookMessage" TEXT,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipInclude" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "includedCourseId" TEXT NOT NULL,

    CONSTRAINT "MembershipInclude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipSettings" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "MembershipSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT,
    "color" TEXT,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleAttachmemtType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ModuleAttachmemtType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "attachmentTypeId" TEXT,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleAwardType" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "awardTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleAwardType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentPin" (
    "scope" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "pinAuthTag" TEXT,
    "pinCipher" TEXT,
    "pinIv" TEXT,

    CONSTRAINT "ParentPin_pkey" PRIMARY KEY ("scope")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "childId" TEXT,
    "accountId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "billingAddress" TEXT,
    "stripeChargeId" TEXT,
    "type" TEXT,
    "category" TEXT,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "questionaryId" TEXT NOT NULL,
    "correctAnswer" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "boardCordinates" TEXT,
    "imageUrl" TEXT,
    "type" TEXT DEFAULT 'text',

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questionary" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "type" TEXT DEFAULT 'text',
    "boardSize" INTEGER,
    "points" INTEGER,

    CONSTRAINT "Questionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "type" "TierType" NOT NULL,
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

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_stripeCustomerId_key" ON "Account"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_recentStripeCheckoutId_key" ON "Account"("recentStripeCheckoutId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AppSettings_membershipSettingsId_key" ON "AppSettings"("membershipSettingsId");

-- CreateIndex
CREATE INDEX "Attachment_courseId_idx" ON "Attachment"("courseId");

-- CreateIndex
CREATE INDEX "Award_childId_idx" ON "Award"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "Award_awardTypeId_childId_key" ON "Award"("awardTypeId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "BunnyData_lessonId_key" ON "BunnyData"("lessonId");

-- CreateIndex
CREATE INDEX "BunnyData_lessonId_idx" ON "BunnyData"("lessonId");

-- CreateIndex
CREATE INDEX "BunnyData_videoId_idx" ON "BunnyData"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLesson_name_key" ON "CategoryLesson"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Child_accountId_key" ON "Child"("accountId");

-- CreateIndex
CREATE INDEX "ChildProgress_lessonId_idx" ON "ChildProgress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildProgress_childId_lessonId_key" ON "ChildProgress"("childId", "lessonId");

-- CreateIndex
CREATE INDEX "ChildScore_courseId_idx" ON "ChildScore"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildScore_childId_courseId_key" ON "ChildScore"("childId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductPremiumId_key" ON "Course"("stripeProductPremiumId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductStandardId_key" ON "Course"("stripeProductStandardId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductPremiumIdDev_key" ON "Course"("stripeProductPremiumIdDev");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductStandardIdDev_key" ON "Course"("stripeProductStandardIdDev");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductBasicDev_key" ON "Course"("stripeProductBasicDev");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductBasicId_key" ON "Course"("stripeProductBasicId");

-- CreateIndex
CREATE INDEX "Course_slug_idx" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_moduleId_slug_idx" ON "Lesson"("moduleId", "slug");

-- CreateIndex
CREATE INDEX "Lesson_moduleId_slug_isPublished_idx" ON "Lesson"("moduleId", "slug", "isPublished");

-- CreateIndex
CREATE INDEX "Lesson_slug_idx" ON "Lesson"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_moduleId_isPublished_key" ON "Lesson"("slug", "moduleId", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipInclude_membershipId_includedCourseId_key" ON "MembershipInclude"("membershipId", "includedCourseId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipSettings_courseId_key" ON "MembershipSettings"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Module_slug_key" ON "Module"("slug");

-- CreateIndex
CREATE INDEX "Module_courseId_idx" ON "Module"("courseId");

-- CreateIndex
CREATE INDEX "Module_courseId_slug_idx" ON "Module"("courseId", "slug");

-- CreateIndex
CREATE INDEX "Module_slug_idx" ON "Module"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Module_courseId_slug_key" ON "Module"("courseId", "slug");

-- CreateIndex
CREATE INDEX "ModuleAttachment_moduleId_idx" ON "ModuleAttachment"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAwardType_moduleId_awardTypeId_key" ON "ModuleAwardType"("moduleId", "awardTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_stripeChargeId_key" ON "Purchase"("stripeChargeId");

-- CreateIndex
CREATE INDEX "Purchase_courseId_accountId_childId_idx" ON "Purchase"("courseId", "accountId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_accountId_courseId_childId_key" ON "Purchase"("accountId", "courseId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_accountId_courseId_childId_stripeChargeId_key" ON "Purchase"("accountId", "courseId", "childId", "stripeChargeId");

-- CreateIndex
CREATE INDEX "Question_questionaryId_idx" ON "Question"("questionaryId");

-- CreateIndex
CREATE INDEX "Questionary_lessonId_idx" ON "Questionary"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_stripeId_key" ON "Tier"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_stripeIdDev_key" ON "Tier"("stripeIdDev");

-- CreateIndex
CREATE INDEX "Tier_courseId_type_idx" ON "Tier"("courseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_courseId_name_key" ON "Tier"("courseId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_courseId_type_key" ON "Tier"("courseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_stripeEventId_key" ON "WebhookEvent"("stripeEventId");

-- AddForeignKey
ALTER TABLE "AppSettings" ADD CONSTRAINT "AppSettings_membershipSettingsId_fkey" FOREIGN KEY ("membershipSettingsId") REFERENCES "MembershipSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "AttachmemtType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_awardTypeId_fkey" FOREIGN KEY ("awardTypeId") REFERENCES "AwardType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BunnyData" ADD CONSTRAINT "BunnyData_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildProgress" ADD CONSTRAINT "ChildProgress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildProgress" ADD CONSTRAINT "ChildProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildProgress" ADD CONSTRAINT "ChildProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildScore" ADD CONSTRAINT "ChildScore_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildScore" ADD CONSTRAINT "ChildScore_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_bookSceneId_fkey" FOREIGN KEY ("bookSceneId") REFERENCES "BookScene"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryLesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipInclude" ADD CONSTRAINT "MembershipInclude_includedCourseId_fkey" FOREIGN KEY ("includedCourseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipInclude" ADD CONSTRAINT "MembershipInclude_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "MembershipSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipSettings" ADD CONSTRAINT "MembershipSettings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAttachment" ADD CONSTRAINT "ModuleAttachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "ModuleAttachmemtType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAttachment" ADD CONSTRAINT "ModuleAttachment_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAwardType" ADD CONSTRAINT "ModuleAwardType_awardTypeId_fkey" FOREIGN KEY ("awardTypeId") REFERENCES "AwardType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAwardType" ADD CONSTRAINT "ModuleAwardType_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionaryId_fkey" FOREIGN KEY ("questionaryId") REFERENCES "Questionary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questionary" ADD CONSTRAINT "Questionary_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "Tier_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

