-- DropForeignKey
ALTER TABLE "public"."PurchaseTransaction" DROP CONSTRAINT "PurchaseTransaction_purchaseId_fkey";

-- AddForeignKey
ALTER TABLE "PurchaseTransaction" ADD CONSTRAINT "PurchaseTransaction_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
