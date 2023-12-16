import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import CreateNewGroupForm from "./CreateNewGroupForm";
import { useState } from "react";
type CreateNewGroupButtonProps = {};

const CreateNewGroupButton = ({}: CreateNewGroupButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        onClick={() => setIsDialogOpen(true)}
        className={buttonVariants({ variant: "default" })}
      >
        Add Subject Group
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Subject Group</DialogTitle>
          <DialogDescription>
            <CreateNewGroupForm closeDialog={() => setIsDialogOpen(false)} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewGroupButton;
