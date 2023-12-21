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
import { Plus } from "lucide-react";
import { useState } from "react";
import GroupDetailsAddLessonDialogContent from "./GroupDetailsAddLessonDialogContent";

type GroupDetailsAddLessonButtonProps = {
  groupId: string;
};

const GroupDetailsAddLessonButton = ({
  groupId,
}: GroupDetailsAddLessonButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default" }), "h-6 group")}
      >
        <Plus className="w-4 h-4 group-hover:scale-125" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Lesson Outlines</DialogTitle>
          <DialogDescription>
            <GroupDetailsAddLessonDialogContent
              groupId={groupId}
              closeDialog={() => setIsDialogOpen(false)}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetailsAddLessonButton;
