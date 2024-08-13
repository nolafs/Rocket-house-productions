/*
  Warnings:

  - You are about to drop the column `nofications` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "nofications";

-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "notifications" BOOLEAN NOT NULL DEFAULT true;
