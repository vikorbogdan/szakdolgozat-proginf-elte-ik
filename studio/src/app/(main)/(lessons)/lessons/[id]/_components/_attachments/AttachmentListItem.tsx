import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LessonGetLessonByIdFileOutput } from "@/trpc/(routers)/lessonRouter";
import Link from "next/link";
import AttachmentListItemIcon from "./AttachmentListItemIcon";
import moment from "moment";
interface AttachmentListItemProps {
  attachment: LessonGetLessonByIdFileOutput;
}
import { getDownloadUrl } from "@edgestore/react/utils";
import { useState } from "react";
import AttachmentDeleteButton from "./AttachmentDeleteButton";
import { Loader2 } from "lucide-react";
import { trpc } from "@/app/_trpc/client";

const AttachmentListItem = ({ attachment }: AttachmentListItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const { data: userIdData } = trpc.getOwnUserId.useQuery();
  const { id: userId } = userIdData ?? {};
  return (
    <Card className="w-full relative items-center max-w-3xl">
      {isDeleteLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary-foreground opacity-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}
      <CardContent className="m-0 p-4 gap-4 flex items-center h-full">
        <div>
          <AttachmentListItemIcon
            attachment={attachment}
            contentType={attachment.contentType ?? ""}
          />
        </div>
        <CardHeader>
          <CardTitle className="truncate w-12 md:w-full">
            {attachment.name}
          </CardTitle>
          <CardDescription>
            {attachment.size} - {moment(attachment.createdAt).fromNow()}
          </CardDescription>
        </CardHeader>
        <Link
          href={getDownloadUrl(attachment.url, attachment.name)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "ml-auto")}
        >
          Download
        </Link>
        {attachment.ownerId === userId && (
          <AttachmentDeleteButton
            attachmentId={attachment.id}
            lessonId={attachment.lessonId ?? ""}
            setIsDeleteLoading={setIsDeleteLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AttachmentListItem;
