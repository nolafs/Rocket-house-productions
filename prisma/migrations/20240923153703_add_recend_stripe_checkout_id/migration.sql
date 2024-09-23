/*
  Warnings:

  - A unique constraint covering the columns `[recendStripeCheckoutId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "recendStripeCheckoutId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_recendStripeCheckoutId_key" ON "Account"("recendStripeCheckoutId");
