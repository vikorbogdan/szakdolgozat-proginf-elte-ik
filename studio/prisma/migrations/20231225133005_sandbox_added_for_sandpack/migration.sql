-- AlterTable
ALTER TABLE "File" ADD COLUMN     "sandboxId" TEXT;

-- CreateTable
CREATE TABLE "Sandbox" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sandbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SBFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "path" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "sandboxId" TEXT,

    CONSTRAINT "SBFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SBFile" ADD CONSTRAINT "SBFile_sandboxId_fkey" FOREIGN KEY ("sandboxId") REFERENCES "Sandbox"("id") ON DELETE SET NULL ON UPDATE CASCADE;
