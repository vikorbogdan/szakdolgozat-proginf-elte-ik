"use client";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import LessonListItem from "./LessonListItem";
const LessonList = () => {
  const { data: lessons, isLoading: lessonsAreLoading } =
    trpc.lessons.list.useQuery();
  if (lessonsAreLoading) {
    return (
      <div className="w-full flex items-center justify-center gap-2">
        <Loader2 className="h-10 text-foreground animate-spin"></Loader2>
        <p>Fetching learning lessons...</p>
      </div>
    );
  }
  if (lessons?.length === 0) {
    return (
      <div className="w-full flex items-center justify-center gap-2">
        <h2 className="font-semibold text-lg text-foreground">
          You don&apos;t have any Lesson Outlines yet.
        </h2>
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-4">
      {lessons?.map((lesson) => (
        <LessonListItem key={lesson.id} lesson={lesson} />
      ))}
    </ul>
  );
};

export default LessonList;
