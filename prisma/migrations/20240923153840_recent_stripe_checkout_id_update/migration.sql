/*
  Warnings:

  - You are about to drop the column `recendStripeCheckoutId` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recentStripeCheckoutId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Account_recendStripeCheckoutId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "recendStripeCheckoutId",
ADD COLUMN     "recentStripeCheckoutId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_recentStripeCheckoutId_key" ON "Account"("recentStripeCheckoutId");
