import { formatDuration } from "@/lib/utils";
import { Clock, Loader2, TextQuote } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeleteLessonListItemButton from "./DeleteLessonListItemButton";

type LessonListItemProps = {
  lesson: {
    id: string;
    title: string;
    duration: number;
    numOfBlocks: number;
  };
};

const LessonListItem = ({ lesson }: LessonListItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  return (
    <li
      className={`h-24 ${
        isDeleteLoading && "opacity-50"
      } bg-card shadow-md transition-all rounded-lg justify-between flex items-center p-5`}
    >
      {isDeleteLoading ? (
        <Loader2 className="w-10 h-10 animate-spin mx-auto" />
      ) : (
        <>
          <Link href={`/lessons/${lesson.id}`} passHref>
            <span className="text-2xl hover:translate-x-2 transition-transform block font-semibold">
              {lesson.title}
            </span>
          </Link>
          <div className="flex gap-2 text-muted-foreground items-center">
            {/*
        TODO: Add more details to the lesson list item like tags, etc.
      */}
            <div className="flex gap-1 items-center">
              <Clock className="w-5 h-5" />
              <span>{formatDuration(lesson.duration)}</span>
            </div>
            <div className="flex gap-1 items-center">
              <TextQuote className="w-5 h-5" />
              <span>{lesson.numOfBlocks}</span>
            </div>
            <DeleteLessonListItemButton
              setIsDeleteLoading={setIsDeleteLoading}
              lessonId={lesson.id}
            />
          </div>
        </>
      )}
    </li>
  );
};

export default LessonListItem;
