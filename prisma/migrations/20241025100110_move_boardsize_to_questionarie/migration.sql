/*
  Warnings:

  - You are about to drop the column `boardSize` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "boardSize";

-- AlterTable
ALTER TABLE "Questionary" ADD COLUMN     "boardSize" INTEGER;
