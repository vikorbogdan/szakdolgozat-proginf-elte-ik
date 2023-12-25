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
import { useEdgeStore } from "@/lib/edgestore";
import { Trash2 } from "lucide-react";

interface AttachmentDeleteButtonProps {
  attachmentId: string;
  lessonId: string;
  setIsDeleteLoading: (isLoading: boolean) => void;
}

const AttachmentDeleteButton = ({
  attachmentId,
  lessonId,
  setIsDeleteLoading,
}: AttachmentDeleteButtonProps) => {
  const trpcUtils = trpc.useUtils();
  const { edgestore } = useEdgeStore();
  const { mutate: deleteFileMutation, isLoading: isDeleteFileLoading } =
    trpc.files.delete.useMutation({
      onSuccess: async (file) => {
        console.log("Successfully deleted file: ", file);
        await edgestore.publicFiles.delete({
          url: file.url,
        });
        trpcUtils.lessons.getLessonById.invalidate(lessonId);
      },
      onError: (err) => {
        console.log("Failed deleting file: ", err);
      },
      onMutate: () => {
        setIsDeleteLoading(true);
      },
    });
  const handleDelete = () => {
    deleteFileMutation(attachmentId);
  };
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
            file.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AttachmentDeleteButton;
