import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { useNavbarStore } from "@/store/client/useStore";
import { spawn } from "child_process";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

const StartLessonButton = () => {
  const {
    setOnGoingLessonId,
    setOnGoingLessonDuration,
    startElapsedTimeTimer,
  } = useNavbarStore();
  const { id: lessonId } = useParams<{ id: string }>();
  const { data: lessonData, isLoading: isLessonDataLoading } =
    trpc.lessons.getLessonById.useQuery(lessonId as string);
  const handleLessonStart = () => {
    if (!lessonData) return;
    setOnGoingLessonId(lessonId);
    const lessonDuration = lessonData?.blocks?.reduce(
      (acc, curr) => acc + curr.duration,
      0
    );
    setOnGoingLessonDuration(lessonDuration * 60 * 1000);
    startElapsedTimeTimer();
  };

  return (
    <Button
      className="w-32"
      disabled={isLessonDataLoading}
      onClick={handleLessonStart}
    >
      {isLessonDataLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <span>Start Lesson</span>
      )}
    </Button>
  );
};

export default StartLessonButton;
