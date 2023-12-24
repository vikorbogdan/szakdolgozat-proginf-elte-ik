import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import { useState } from "react";
import AttachmentUploadDropzone from "./AttachmentUploadDropzone";

interface AttachmentUploadButtonProps {
  lessonId: string;
}
const AttachmentUploadButton = ({ lessonId }: AttachmentUploadButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDialogOpen = (dialogOpenState: boolean) => {
    if (!isUploading) setIsDialogOpen(dialogOpenState);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger
        onClick={() => setIsDialogOpen(true)}
        className={buttonVariants({ variant: "default" })}
      >
        <Plus className="w-5 h-5" /> Upload Attachment
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Attachment</DialogTitle>
          <DialogDescription className="flex flex-col items-center gap-4 w-full">
            <AttachmentUploadDropzone
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              lessonId={lessonId}
              setIsDialogOpen={handleDialogOpen}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentUploadButton;
