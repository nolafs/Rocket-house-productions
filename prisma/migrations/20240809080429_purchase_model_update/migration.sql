/*
  Warnings:

  - You are about to drop the column `stripeProductId` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeChargeId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "stripeProductId",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "stripeChargeId" TEXT NOT NULL;
