-- AddForeignKey
ALTER TABLE "ChildProgress" ADD CONSTRAINT "ChildProgress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
