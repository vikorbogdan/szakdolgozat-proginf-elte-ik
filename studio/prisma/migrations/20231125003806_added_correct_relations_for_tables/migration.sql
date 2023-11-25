/*
  Warnings:

  - You are about to drop the column `groupId` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_userId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_userId_fkey";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "groupId",
DROP COLUMN "lessonId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "groupId",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_GroupToLesson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToLesson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToBlock" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupToBlock" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToLesson_AB_unique" ON "_GroupToLesson"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToLesson_B_index" ON "_GroupToLesson"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToLesson_AB_unique" ON "_UserToLesson"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToLesson_B_index" ON "_UserToLesson"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToBlock_AB_unique" ON "_UserToBlock"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToBlock_B_index" ON "_UserToBlock"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToBlock_AB_unique" ON "_GroupToBlock"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToBlock_B_index" ON "_GroupToBlock"("B");

-- AddForeignKey
ALTER TABLE "_GroupToLesson" ADD CONSTRAINT "_GroupToLesson_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToLesson" ADD CONSTRAINT "_GroupToLesson_B_fkey" FOREIGN KEY ("B") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToLesson" ADD CONSTRAINT "_UserToLesson_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToLesson" ADD CONSTRAINT "_UserToLesson_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToBlock" ADD CONSTRAINT "_UserToBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToBlock" ADD CONSTRAINT "_UserToBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToBlock" ADD CONSTRAINT "_GroupToBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToBlock" ADD CONSTRAINT "_GroupToBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
