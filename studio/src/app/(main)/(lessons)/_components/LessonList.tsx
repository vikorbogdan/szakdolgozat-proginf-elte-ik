"use client";

import LessonListItem from "./LessonListItem";

interface LessonListProps {
  lessons?: {
    title: string;
    id: string;
    duration: number;
    numOfBlocks: number;
  }[];
}

const LessonList = ({ lessons }: LessonListProps) => {
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
