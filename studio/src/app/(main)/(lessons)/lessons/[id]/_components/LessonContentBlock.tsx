import BlockContentRenderer from "@/app/(main)/_components/BlockContentRenderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { Clock, Edit } from "lucide-react";
import { Block } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useNavbarStore } from "@/store/client/useStore";

interface LessonContentBlockProps {
  block: Block;
  canBeEdited: boolean;
  order: number;
}

const LessonContentBlock = ({
  order,
  block,
  canBeEdited,
}: LessonContentBlockProps) => {
  const { addProgress, onGoingLessonId, removeProgress, progress } =
    useNavbarStore();
  const router = useRouter();
  const { id: lessonId } = useParams();
  const blockData = {
    blockId: `${block.id}_${order}`,
    duration: block.duration * 60 * 1000,
  };
  const isInProgress = progress.some(
    (progressData) =>
      progressData.blockId === blockData.blockId &&
      progressData.duration === blockData.duration
  );
  const [isBlockCompleted, setIsBlockCompleted] = useState<boolean>(
    isInProgress as boolean
  );
  useEffect(() => {
    setIsBlockCompleted(isInProgress);
  }, [progress]);
  const handleCheckedChange = (checked: boolean) => {
    if (onGoingLessonId === lessonId) {
      if (checked) {
        addProgress(`${block.id}_${order}`, block.duration * 60 * 1000);
      } else {
        removeProgress(`${block.id}_${order}`);
      }
    }
    setIsBlockCompleted(checked);
  };

  return (
    <Card
      className={`w-screen group hover:opacity-100 transition-opacity md:w-[48rem] ${
        isBlockCompleted ? "opacity-50" : "opacity-100"
      }`}
    >
      <CardHeader className="flex items-center flex-row w-full justify-between">
        {canBeEdited && (
          <Button
            variant={"outline"}
            onClick={() => {
              router.push(`/blocks/${block.id}/edit`);
            }}
            className="flex text-sm items-center gap-1"
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}
        <CardTitle className="text-center">{block.title}</CardTitle>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span>{formatDuration(block.duration)}</span>
          <Clock className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        {block.content && (
          <BlockContentRenderer
            blockContentData={JSON.parse(block.content)}
          ></BlockContentRenderer>
        )}
      </CardContent>
      {!!onGoingLessonId && (
        <CardFooter className="flex gap-2  justify-end">
          {isBlockCompleted ? (
            <span className="text-muted-foreground">🎉 Completed!</span>
          ) : (
            <span className="text-muted-foreground group-hover:opacity-100 opacity-0 transition-opacity">
              Mark as completed:
            </span>
          )}
          <Checkbox
            checked={isBlockCompleted}
            onCheckedChange={handleCheckedChange}
            className="w-6 h-6"
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default LessonContentBlock;
