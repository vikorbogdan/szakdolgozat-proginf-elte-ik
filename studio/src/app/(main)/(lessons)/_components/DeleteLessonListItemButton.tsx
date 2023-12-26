import { trpc } from "@/app/_trpc/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
type DeleteLessonListItemButtonProps = {
  setIsDeleteLoading: (value: boolean) => void;
  lessonId: string;
};

const DeleteLessonListItemButton = ({
  lessonId,
  setIsDeleteLoading,
}: DeleteLessonListItemButtonProps) => {
  const trpcUtils = trpc.useUtils();
  const { mutate: deleteLessonMutation, isLoading: isDeleteLessonLoading } =
    trpc.lessons.delete.useMutation({
      onSuccess: () => {
        console.log("Successfully deleted lesson");
        trpcUtils.lessons.list.invalidate();
      },
      onError: (err) => {
        console.log("Failed deleting lesson: ", err);
      },
    });
  const handleDelete = () => {
    deleteLessonMutation(lessonId);
  };
  useEffect(() => {
    setIsDeleteLoading(isDeleteLessonLoading);
  }, [isDeleteLessonLoading, setIsDeleteLoading]);
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="w-10 h-10 p-1 group" variant="destructive">
          <Trash2 className="w-5 h-5 transition-colors text-destructive-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            lesson, and all corresponding attachments and handouts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLessonListItemButton;
