/*
  Warnings:

  - You are about to drop the column `description` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Questionary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Questionary" DROP COLUMN "description";
