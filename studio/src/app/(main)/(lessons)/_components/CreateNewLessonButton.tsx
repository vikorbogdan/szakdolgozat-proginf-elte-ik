import { buttonVariants } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import CreateNewLessonForm from "./CreateNewLessonForm";
type CreateNewLessonButtonProps = {};

const CreateNewLessonButton = ({}: CreateNewLessonButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        onClick={() => setIsDialogOpen(true)}
        className={buttonVariants({ variant: "default" })}
      >
        Add Lesson Outline
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Lesson Outline</DialogTitle>
          <DialogDescription>
            <CreateNewLessonForm closeDialog={() => setIsDialogOpen(false)} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewLessonButton;
