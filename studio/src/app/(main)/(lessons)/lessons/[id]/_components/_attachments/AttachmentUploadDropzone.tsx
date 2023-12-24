import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import allowedAttachmentFileSize from "@/lib/allowedAttachmentFileSize";
import allowedAttachmentFileTypes from "@/lib/allowedAttachmentFileTypes";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import AttachmentUploadDropzoneContent from "./AttachmentUploadDropzoneContent";

interface AttachmentUploadDropzoneProps {
  lessonId: string;
  setIsDialogOpen: (isOpen: boolean) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

const fileValidator = (file: File) => {
  if (!allowedAttachmentFileTypes.includes(file.type)) {
    return {
      code: "invalid-file-type",
      message: `Invalid file type: ${file.type}`,
    };
  }

  if (file.size > allowedAttachmentFileSize) {
    return {
      code: "size-too-large",
      message: `File is larger than 10MB`,
    };
  }

  return null;
};

const AttachmentUploadDropzone = ({
  lessonId,
  setIsDialogOpen,
  isUploading,
  setIsUploading,
}: AttachmentUploadDropzoneProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [rejectedFile, setRejectedFile] = useState<FileRejection | null>(null);
  const trpcUtils = trpc.useUtils();
  const { data: userIdData } = trpc.getOwnUserId.useQuery();
  const ownerId = userIdData?.id ?? "";
  const { mutate: uploadAttachment } =
    trpc.lessons.createAndAddFileAttachmentToLesson.useMutation({
      onSuccess: () => {
        console.log("Successfully uploaded attachment to lesson.");
        trpcUtils.lessons.getLessonById.invalidate(lessonId);
      },
      onError: (err) => {
        console.error(
          "Something went wrong while uploading attachment to lesson: ",
          err
        );
      },
    });
  const { edgestore } = useEdgeStore();
  const handleUpload = async (acceptedFile: File) => {
    const file: File = acceptedFile;
    if (!file) throw new Error("No file selected");
    setIsUploading(true);
    const res = await edgestore.publicFiles
      .upload({
        file,
        onProgressChange: (progress) => {
          setUploadProgress(progress);
        },
      })
      .catch((err) => {
        console.error(err);
        setIsUploading(false);
        setIsDialogOpen(false);
      });

    if (!res) return;
    uploadAttachment({
      lessonId,
      contentType: file.type,
      size: file.size,
      name: file.name,
      url: res.url,
      ownerId,
    });
    setIsUploading(false);
    setIsDialogOpen(false);
  };
  return (
    <Dropzone
      validator={fileValidator}
      onDropRejected={(rejectedFiles) => setRejectedFile(rejectedFiles[0])}
      onDropAccepted={() => setRejectedFile(null)}
      multiple={false}
    >
      {({
        getRootProps,
        getInputProps,
        acceptedFiles,
        isDragActive,
        isDragReject,
      }) => (
        <>
          <div
            className={`group cursor-pointer w-full flex justify-center items-center h-64 mt-4 border-2 border-dashed ${
              isDragReject ? "border-destructive" : "border-primary-foreground"
            } rounded-lg`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <AttachmentUploadDropzoneContent
              rejectedFile={rejectedFile}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              acceptedFiles={acceptedFiles}
              isDragActive={isDragActive}
            />
          </div>
          {isUploading ? (
            <div className="w-full flex flex-col gap-4 items-center">
              <Progress
                value={uploadProgress}
                className={`h-1 w-full bg-muted transition-all  ${
                  uploadProgress === 100 && "border-2 border-green-500"
                }`}
              ></Progress>
              <span className="text-center">
                {uploadProgress < 100 ? "Uploading..." : "Uploaded!"}
              </span>
            </div>
          ) : (
            acceptedFiles.length > 0 && (
              <Button
                disabled={isDragReject}
                onClick={() => handleUpload(acceptedFiles[0] as File)}
              >
                Upload
              </Button>
            )
          )}
        </>
      )}
    </Dropzone>
  );
};

export default AttachmentUploadDropzone;
