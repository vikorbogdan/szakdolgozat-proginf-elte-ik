import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Group } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import GroupDetailsAddMemberDialogContent from "./GroupDetailsAddMemberDialogContent";

interface GroupDetailsAddMemberButtonProps {
  group: Group;
}

const GroupDetailsAddMemberButton = ({
  group,
}: GroupDetailsAddMemberButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default" }), "h-6 group")}
      >
        <Plus className="w-4 h-4 group-hover:scale-125" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new member to {group.name} group</DialogTitle>
          <DialogDescription>
            <GroupDetailsAddMemberDialogContent closeDialog={closeDialog} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetailsAddMemberButton;
