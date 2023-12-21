import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDuration } from "@/lib/utils";
import { Clock, Loader2 } from "lucide-react";
import { ChangeEvent, use, useMemo, useState } from "react";
import GroupDetailsAddLessonDialogScrollArea from "./GroupDetailsAddLessonDialogScrollArea";

type GroupDetailsAddLessonListProps = {
  groupId: string;
  closeDialog: () => void;
};

const GroupDetailsAddLessonDialogContent = ({
  groupId,
  closeDialog,
}: GroupDetailsAddLessonListProps) => {
  const trpcUtils = trpc.useUtils();
  const { data: availableLessonData, isLoading: isAvailableLessonDataLoading } =
    trpc.lessons.listAvailableForGroup.useQuery(groupId);

  const {
    mutate: addLessonsToGroup,
    isLoading: isAddLessonsToGroupLoading,
    isSuccess,
  } = trpc.groups.addLessonsToGroup.useMutation({
    onSuccess: () => {
      trpcUtils.groups.getGroupById.invalidate(groupId);
      setTimeout(() => {
        closeDialog();
      }, 1000);
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const filteredLessonIds = useMemo(() => {
    const filteredLessons =
      availableLessonData?.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? [];
    return filteredLessons.map((lesson) => lesson.id);
  }, [availableLessonData, searchQuery]);

  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);

  return (
    <>
      <div className="p-4">
        <Input
          aria-label="Search"
          className="mb-4 w-full "
          placeholder="Search..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <GroupDetailsAddLessonDialogScrollArea
          filteredLessonIds={filteredLessonIds}
          isLessonDataLoading={isAvailableLessonDataLoading}
          lessonData={availableLessonData}
          selectedLessonIds={selectedLessonIds}
          setSelectedLessonIds={setSelectedLessonIds}
        />
      </div>
      <Separator className="my-4" />
      <h2>
        {selectedLessonIds.length}{" "}
        {selectedLessonIds.length === 1 ? "Lesson" : "Lessons"} Selected
      </h2>
      <div className="flex items-center justify-center w-full">
        <Button
          onClick={async () => {
            addLessonsToGroup({ groupId, lessonIds: selectedLessonIds });
            closeDialog();
          }}
          variant="default"
        >
          {isAddLessonsToGroupLoading || isSuccess ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Add Lessons"
          )}
        </Button>
      </div>
    </>
  );
};

export default GroupDetailsAddLessonDialogContent;
