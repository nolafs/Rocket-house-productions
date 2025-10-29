-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_accountId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
