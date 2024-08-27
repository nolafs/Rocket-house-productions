-- AddForeignKey
ALTER TABLE "ChildScore" ADD CONSTRAINT "ChildScore_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
