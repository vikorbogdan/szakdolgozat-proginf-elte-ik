import { trpc } from "@/app/_trpc/client";
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
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface GroupDetailsDeleteLessonButtonProps {
  groupId: string;
  lessonId: string;
}

const GroupDetailsDeleteLessonButton = ({
  groupId,
  lessonId,
}: GroupDetailsDeleteLessonButtonProps) => {
  const trpcUtils = trpc.useUtils();
  const {
    mutate: removeLessonFromGroup,
    isLoading: isRemoveLessonFromGroupLoading,
  } = trpc.groups.removeLessonFromGroup.useMutation({
    onSuccess: async () => {
      console.log("Successfully removed lesson from group.");
      trpcUtils.groups.getGroupById.invalidate(groupId);
    },
    onError: () => {
      console.log("Failed to remove lesson from group.");
    },
  });
  const handleDelete = () => {
    removeLessonFromGroup({ lessonId, groupId });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          className={`w-10 h-10 p-1 group`}
          disabled={isRemoveLessonFromGroupLoading}
          variant="destructive"
        >
          {isRemoveLessonFromGroupLoading ? (
            <Loader2 className="animate-spin w-5 h-5 text-destructive-foreground" />
          ) : (
            <Trash2 className="w-5 h-5 transition-colors text-destructive-foreground" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Members of this group will no longer be able to access this lesson.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isRemoveLessonFromGroupLoading}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GroupDetailsDeleteLessonButton;
