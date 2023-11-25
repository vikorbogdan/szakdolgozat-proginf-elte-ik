-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_lessonId_fkey";

-- CreateTable
CREATE TABLE "_LessonToBlock" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LessonToBlock_AB_unique" ON "_LessonToBlock"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonToBlock_B_index" ON "_LessonToBlock"("B");

-- AddForeignKey
ALTER TABLE "_LessonToBlock" ADD CONSTRAINT "_LessonToBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToBlock" ADD CONSTRAINT "_LessonToBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
