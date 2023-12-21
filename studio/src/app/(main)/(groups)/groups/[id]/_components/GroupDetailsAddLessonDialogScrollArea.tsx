import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDuration } from "@/lib/utils";
import { LessonListAvailableForGroupOutput } from "@/trpc/(routers)/lessonRouter";
import { Clock, Loader2 } from "lucide-react";
import { ChangeEvent } from "react";

type GroupDetailsAddLessonDialogScrollAreaProps = {
  filteredLessonIds: string[] | undefined;
  isLessonDataLoading: boolean;
  lessonData: LessonListAvailableForGroupOutput | undefined;
  selectedLessonIds: string[];
  setSelectedLessonIds: (selectedLessonIds: string[]) => void;
};

const GroupDetailsAddLessonDialogScrollArea = ({
  isLessonDataLoading,
  lessonData,
  filteredLessonIds,
  selectedLessonIds,
  setSelectedLessonIds,
}: GroupDetailsAddLessonDialogScrollAreaProps) => {
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      setSelectedLessonIds([...selectedLessonIds, target.id]);
    } else {
      setSelectedLessonIds(selectedLessonIds.filter((id) => id !== target.id));
    }
  };

  if (isLessonDataLoading) {
    return (
      <div className="flex items-center justify-center h-64 rounded-md border">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }
  if (!lessonData) return null;
  if (lessonData.length == 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-md border">
        <span className="text-muted-foreground">
          No lessons available to add.
        </span>
      </div>
    );
  }
  return (
    <ScrollArea className="flex flex-col gap-4 h-64 rounded-md border">
      {lessonData &&
        lessonData.map((lesson) => (
          <>
            <div
              className={`flex items-center gap-4 p-4 ${
                !filteredLessonIds?.includes(lesson.id) && "hidden"
              }`}
            >
              <input
                type="checkbox"
                onChange={handleCheckboxChange}
                id={lesson.id}
              />
              <Label className="font-normal truncate w-52" htmlFor={lesson.id}>
                {lesson.title}
              </Label>
              <div className="flex ml-auto items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(lesson.duration)}</span>
              </div>
            </div>
            <Separator
              className={`last-of-type:opacity-0 ${
                !filteredLessonIds?.includes(lesson.id) && "hidden"
              }`}
            />
          </>
        ))}
    </ScrollArea>
  );
};

export default GroupDetailsAddLessonDialogScrollArea;
