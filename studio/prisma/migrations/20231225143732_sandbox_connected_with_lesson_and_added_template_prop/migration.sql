/*
  Warnings:

  - You are about to drop the column `sandboxId` on the `File` table. All the data in the column will be lost.
  - Added the required column `template` to the `Sandbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "sandboxId";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "sandboxId" TEXT;

-- AlterTable
ALTER TABLE "Sandbox" ADD COLUMN     "template" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_sandboxId_fkey" FOREIGN KEY ("sandboxId") REFERENCES "Sandbox"("id") ON DELETE SET NULL ON UPDATE CASCADE;
