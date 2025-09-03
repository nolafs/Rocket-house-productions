-- CreateTable
CREATE TABLE "public"."AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "membershipSettingsId" TEXT,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppSettings_membershipSettingsId_key" ON "public"."AppSettings"("membershipSettingsId");

-- AddForeignKey
ALTER TABLE "public"."AppSettings" ADD CONSTRAINT "AppSettings_membershipSettingsId_fkey" FOREIGN KEY ("membershipSettingsId") REFERENCES "public"."MembershipSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
