-- CreateTable
CREATE TABLE "AwardType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "badgeUrl" TEXT,
    "points" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AwardType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleAwardType" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "awardTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleAwardType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAwardType_moduleId_awardTypeId_key" ON "ModuleAwardType"("moduleId", "awardTypeId");

-- AddForeignKey
ALTER TABLE "ModuleAwardType" ADD CONSTRAINT "ModuleAwardType_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAwardType" ADD CONSTRAINT "ModuleAwardType_awardTypeId_fkey" FOREIGN KEY ("awardTypeId") REFERENCES "AwardType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
