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
type DeleteBlockListItemButtonProps = {
  setIsDeleteLoading: (value: boolean) => void;
  blockId: string;
};

const DeleteBlockListItemButton = ({
  blockId,
  setIsDeleteLoading,
}: DeleteBlockListItemButtonProps) => {
  const trpcUtils = trpc.useUtils();
  const { mutate: deleteBlockMutation, isLoading: isDeleteBlockLoading } =
    trpc.blocks.delete.useMutation({
      onSuccess: () => {
        console.log("Successfully deleted block");
        trpcUtils.blocks.list.invalidate();
      },
      onError: (err) => {
        console.log("Failed deleting block: ", err);
      },
    });
  const handleDelete = () => {
    deleteBlockMutation(blockId);
  };
  useEffect(() => {
    setIsDeleteLoading(isDeleteBlockLoading);
  }, [isDeleteBlockLoading, setIsDeleteLoading]);
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
            block.
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

export default DeleteBlockListItemButton;
