"use client";
import { Library } from "lucide-react";
import CreateNewLessonButton from "../_components/CreateNewLessonButton";
import LessonList from "../_components/LessonList";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";

const Lessons = () => {
  const { data: lessons, isLoading: isLessonsLoading } =
    trpc.lessons.list.useQuery();

  if (isLessonsLoading) return <LoadingPage />;
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex items-center gap-4">
        <Library className="h-14 w-14" />
        <h1 className="md:text-5xl text-xl font-semibold">Lesson Outlines</h1>
        <CreateNewLessonButton />
      </div>
      <LessonList lessons={lessons} />
    </div>
  );
};

export default Lessons;
