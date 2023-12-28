import { LessonGetLessonByIdOutput } from "@/trpc/(routers)/lessonRouter";
import LessonContentBlock from "./LessonContentBlock";

interface LessonContentProps {
  lessonData: LessonGetLessonByIdOutput;
  userId: string;
}

const LessonContent = ({ lessonData, userId }: LessonContentProps) => {
  return (
    <main className="flex flex-col mt-4 gap-4 items-center w-full">
      {lessonData?.blocks.map((block, idx) => {
        return (
          <LessonContentBlock
            block={block}
            canBeEdited={userId === lessonData.ownerId}
            key={block.id + idx}
            order={idx}
          />
        );
      })}
    </main>
  );
};

export default LessonContent;
