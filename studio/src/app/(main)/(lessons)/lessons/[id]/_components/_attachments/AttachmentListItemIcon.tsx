import { LessonGetLessonByIdFileOutput } from "@/trpc/(routers)/lessonRouter";
import { FileText, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AttachmentListItemIconProps {
  contentType: string;
  attachment?: LessonGetLessonByIdFileOutput;
}

const AttachmentListItemIcon = ({
  contentType,
  attachment,
}: AttachmentListItemIconProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  // if there is no content type, return null
  if (!contentType) return null;
  // if its an image, render the image as a thumbnail
  if (contentType.includes("image") && attachment)
    return (
      <div className="relative w-10 h-10 sm:w-16 sm:h-16 border rounded-lg">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 sm:w-14 sm:h-14 animate-spin text-muted"></Loader2>
            <ImageIcon className="absolute w-6 h-6 text-muted"></ImageIcon>
          </div>
        )}
        <Image
          src={attachment.url}
          alt={attachment.name}
          fill
          sizes={"10vw"}
          onLoad={() => setImageLoading(false)}
          className="object-cover rounded-lg"
        />
      </div>
    );
  //otherwise return default icon
  return (
    <div className="w-14 h-14">
      <FileText className="w-full h-full text-muted-foreground " />
    </div>
  );
};

export default AttachmentListItemIcon;
