/*
  Warnings:

  - You are about to drop the column `fredboardUrl` on the `BookScene` table. All the data in the column will be lost.
  - You are about to drop the column `guirarHeadUrl` on the `BookScene` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."BookScene" DROP COLUMN "fredboardUrl",
DROP COLUMN "guirarHeadUrl",
ADD COLUMN     "fretboardUrl" TEXT,
ADD COLUMN     "guitarHeadUrl" TEXT;
