-- CreateTable
CREATE TABLE "public"."ParentPin" (
    "scope" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "ParentPin_pkey" PRIMARY KEY ("scope")
);

-- CreateTable
CREATE TABLE "public"."KvTemp" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KvTemp_pkey" PRIMARY KEY ("key")
);
