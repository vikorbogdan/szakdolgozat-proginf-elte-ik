/*
  Warnings:

  - You are about to drop the `SBFile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `files` to the `Sandbox` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SBFile" DROP CONSTRAINT "SBFile_sandboxId_fkey";

-- AlterTable
ALTER TABLE "Sandbox" ADD COLUMN     "files" TEXT NOT NULL;

-- DropTable
DROP TABLE "SBFile";
