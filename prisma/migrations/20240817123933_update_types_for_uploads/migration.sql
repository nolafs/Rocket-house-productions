/*
  Warnings:

  - You are about to drop the column `type` on the `Attachment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "type",
ADD COLUMN     "attachmentTypeId" TEXT;

-- CreateTable
CREATE TABLE "AttachmemtType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AttachmemtType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "AttachmemtType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
