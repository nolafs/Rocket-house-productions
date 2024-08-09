/*
  Warnings:

  - You are about to drop the column `userId` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Purchase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `Child` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId,courseId,childId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Child_userId_key";

-- DropIndex
DROP INDEX "Purchase_userId_courseId_childId_key";

-- AlterTable
ALTER TABLE "Child" DROP COLUMN "userId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "userId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Child_accountId_key" ON "Child"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_accountId_courseId_childId_key" ON "Purchase"("accountId", "courseId", "childId");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
