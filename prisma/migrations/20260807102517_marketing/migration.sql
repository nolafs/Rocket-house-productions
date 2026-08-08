-- CreateTable
CREATE TABLE "MarketingProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lifecycleStage" TEXT,
    "pushedHash" TEXT,
    "pushedAt" TIMESTAMP(3),
    "tags" JSONB,
    "tagsSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingProfile_userId_key" ON "MarketingProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingProfile_email_key" ON "MarketingProfile"("email");

-- CreateIndex
CREATE INDEX "MarketingProfile_lifecycleStage_idx" ON "MarketingProfile"("lifecycleStage");

-- AddForeignKey
ALTER TABLE "MarketingProfile" ADD CONSTRAINT "MarketingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
