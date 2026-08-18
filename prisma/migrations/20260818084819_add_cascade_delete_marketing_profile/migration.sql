-- DropForeignKey
ALTER TABLE "MarketingProfile" DROP CONSTRAINT "MarketingProfile_userId_fkey";

-- AddForeignKey
ALTER TABLE "MarketingProfile" ADD CONSTRAINT "MarketingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
