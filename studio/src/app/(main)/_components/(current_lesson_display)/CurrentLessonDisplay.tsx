import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/store/client/useStore";
import { ArrowUpRightSquare, Clock, XOctagon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import EndLessonButton from "./_components/EndLessonButton";
import StartLessonButton from "./_components/StartLessonButton";
import moment from "moment";
import { useEffect } from "react";
const CurrentLessonDisplay = () => {
  const {
    elapsedTime,
    onGoingLessonId,
    onGoingLessonDuration,
    continueElapsedTimeTimer,
  } = useNavbarStore();
  useEffect(() => {
    if (onGoingLessonId) continueElapsedTimeTimer();
  }, []);
  const elapsedTimePercentage = (elapsedTime / onGoingLessonDuration) * 100;
  const pathname = usePathname();
  const isOnLessonPage = /^\/lessons\/[a-zA-Z0-9]{25}$/.test(pathname);
  const isOnOngoingLessonPage =
    onGoingLessonId && pathname === `/lessons/${onGoingLessonId}`;
  // if there is no ongoing lesson and we are on a lesson page, show a button to start the lesson
  if (isOnLessonPage && !onGoingLessonId) return <StartLessonButton />;
  // if there is an ongoing lesson and we are not on the ongoing lesson's page, show ongoing lesson nam, show progress, elapsed time, and a button to resume the lesson
  if (onGoingLessonId)
    return (
      <div className="flex gap-4 items-center">
        {isOnOngoingLessonPage ? (
          <EndLessonButton />
        ) : (
          <Link
            href={`/lessons/${onGoingLessonId}`}
            className={cn(buttonVariants({ variant: "default" }), "flex gap-2")}
          >
            <ArrowUpRightSquare className="w-5 h-5" />
            <span className="md:flex hidden">Resume Lesson</span>
          </Link>
        )}
        {/* if there is an ongoing lesson and we are on the ongoing lesson's page, show progress, elapsed time, and a button to end the lesson */}
        <div className="text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="md:flex hidden w-20">Elapsed time</div>
            <Progress
              className="w-24 sm:w-36"
              value={elapsedTimePercentage <= 100 ? elapsedTimePercentage : 100}
            />
            <div className="hidden sm:flex">
              {moment.utc(elapsedTime).format("HH:mm:ss")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="md:flex hidden w-20">Your Progress</div>
            <Progress className="w-24 sm:w-36" value={100} />
            <div className="hidden sm:flex">00:00:00</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          / {moment.utc(onGoingLessonDuration).format("HH:mm:ss")}{" "}
          <Clock className="w-4 h-4" />{" "}
        </div>
      </div>
    );

  return null;
};
export default CurrentLessonDisplay;
