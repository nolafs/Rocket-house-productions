-- CreateTable
CREATE TABLE "ModuleAttachmemtType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ModuleAttachmemtType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "attachmentTypeId" TEXT,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModuleAttachment_moduleId_idx" ON "ModuleAttachment"("moduleId");

-- AddForeignKey
ALTER TABLE "ModuleAttachment" ADD CONSTRAINT "ModuleAttachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "ModuleAttachmemtType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAttachment" ADD CONSTRAINT "ModuleAttachment_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
