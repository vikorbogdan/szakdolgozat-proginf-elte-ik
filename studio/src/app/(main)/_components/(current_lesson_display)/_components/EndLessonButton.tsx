import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/store/client/useStore";
import { XOctagon } from "lucide-react";

const EndLessonButton = () => {
  const { resetLesson } = useNavbarStore();
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants({ variant: "destructive" }), "flex gap-2")}
      >
        <XOctagon className="w-5 h-5" />
        <span className="md:flex hidden">End Lesson</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you would like to end the lesson?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your currently ongoing lesson progress will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              resetLesson();
            }}
            className={buttonVariants({ variant: "destructive" })}
          >
            End Lesson
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EndLessonButton;
