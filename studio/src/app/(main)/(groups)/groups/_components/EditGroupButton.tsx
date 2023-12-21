import { buttonVariants } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import EditGroupForm from "./EditGroupForm";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
type EditGroupButtonProps = {
  groupId: string;
  isCompact?: boolean;
};

const EditGroupButton = ({ groupId, isCompact }: EditGroupButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {isCompact ? (
        <DialogTrigger
          onClick={() => setIsDialogOpen(true)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex absolute top-4 right-4 gap-1 transition-opacity h-5 p-3 group"
          )}
        >
          <Edit className="w-3 h-3 transition-colors" />
        </DialogTrigger>
      ) : (
        <DialogTrigger
          onClick={() => setIsDialogOpen(true)}
          className={cn("text-4xl", buttonVariants({ variant: "default" }))}
        >
          Edit
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Subject Group</DialogTitle>
          <DialogDescription>
            <EditGroupForm
              groupId={groupId}
              closeDialog={() => setIsDialogOpen(false)}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupButton;
