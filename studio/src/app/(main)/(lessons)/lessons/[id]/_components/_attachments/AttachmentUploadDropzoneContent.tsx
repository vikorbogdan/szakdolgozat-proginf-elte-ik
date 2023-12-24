import { FileIcon, UploadCloud } from "lucide-react";
import { FileRejection } from "react-dropzone";

interface AttachmentUploadDropzoneContentProps {
  getRootProps: any;
  getInputProps: any;
  acceptedFiles: any;
  isDragActive: any;
  rejectedFile: FileRejection | null;
}

const AttachmentUploadDropzoneContent = ({
  getRootProps,
  getInputProps,
  acceptedFiles,
  isDragActive,
  rejectedFile,
}: AttachmentUploadDropzoneContentProps) => {
  const rejectedError = rejectedFile
    ? rejectedFile.errors[0].code === "size-too-large"
      ? "File is too large"
      : rejectedFile.errors[0].code === "invalid-file-type"
      ? "Invalid file type"
      : "Unknown error"
    : null;

  if (rejectedError)
    return (
      <div className="flex flex-col items-center text-destructive">
        <UploadCloud className="w-10 h-10 " />
        <label className="text-center">
          Drag &apos;n&apos; drop a file here, or <b> click here </b> to select
          it
        </label>
        <p className="">Error: {rejectedError}</p>
      </div>
    );
  if (isDragActive) return <UploadCloud className="w-14 h-14 animate-bounce" />;

  if (acceptedFiles[0] && acceptedFiles)
    return (
      <div className="flex flex-col items-center">
        <FileIcon className="h-14 w-14 text-muted-foreground" />
        <span className="px-2 text-lg text-muted-foreground max-w-xs truncate">
          {acceptedFiles[0].name}
        </span>
      </div>
    );
  else
    return (
      <div className="flex flex-col items-center">
        <UploadCloud className="w-10 h-10 group-hover:animate-bounce" />
        <label className="text-center">
          Drag &apos;n&apos; drop a file here, or <b> click here </b> to select
          it
        </label>
        <p className="text-muted-foreground">(max 10 MB)</p>
      </div>
    );
};

export default AttachmentUploadDropzoneContent;
