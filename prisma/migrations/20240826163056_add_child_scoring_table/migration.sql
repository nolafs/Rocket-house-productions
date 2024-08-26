-- CreateTable
CREATE TABLE "ChildScore" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChildScore_courseId_idx" ON "ChildScore"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildScore_childId_courseId_key" ON "ChildScore"("childId", "courseId");

-- AddForeignKey
ALTER TABLE "ChildScore" ADD CONSTRAINT "ChildScore_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
