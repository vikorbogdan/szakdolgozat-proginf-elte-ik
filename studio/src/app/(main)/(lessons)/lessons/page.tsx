"use client";
import { Library } from "lucide-react";
import LessonList from "./_components/LessonList";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import CreateNewLessonButton from "./_components/CreateNewLessonButton";

const Lessons = () => {
  const { mutate: createLesson } = trpc.lessons.createLesson.useMutation();
  const { mutate: addBlockToLesson } =
    trpc.lessons.addBlockToLesson.useMutation();
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex items-center gap-4">
        <Library className="h-14 w-14" />
        <h1 className="text-5xl font-semibold">Lesson Outlines</h1>
        <CreateNewLessonButton />
        <Button
          className="ml-auto"
          onClick={() => {
            addBlockToLesson({
              lessonId: "clpn99sjj0005ox80z1n8v9i3",
              blockId: "clplqjem50000ox1ct42vipae",
            });
          }}
        >
          add block
        </Button>
      </div>
      <LessonList />
    </div>
  );
};

export default Lessons;
