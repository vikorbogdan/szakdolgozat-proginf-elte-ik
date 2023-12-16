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
type DeleteGroupListItemButtonProps = {
  setIsDeleteLoading: (value: boolean) => void;
  groupId: string;
};

const DeleteGroupListItemButton = ({
  groupId,
  setIsDeleteLoading,
}: DeleteGroupListItemButtonProps) => {
  const trpcUtils = trpc.useUtils();
  const { mutate: deleteGroupMutation, isLoading: isDeleteGroupLoading } =
    trpc.groups.delete.useMutation({
      onSuccess: () => {
        console.log("Successfully deleted Group");
        trpcUtils.groups.list.invalidate();
      },
      onError: (err) => {
        console.log("Failed deleting Group: ", err);
      },
    });
  const handleDelete = () => {
    deleteGroupMutation(groupId);
  };
  useEffect(() => {
    setIsDeleteLoading(isDeleteGroupLoading);
  }, [isDeleteGroupLoading, setIsDeleteLoading]);
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          className="flex absolute top-4 left-4 gap-1 opacity-50 hover:opacity-100 transition-opacity h-5 p-3 group"
          variant="destructive"
        >
          <Trash2 className="w-3 h-3 transition-colors text-destructive-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Group.
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

export default DeleteGroupListItemButton;
