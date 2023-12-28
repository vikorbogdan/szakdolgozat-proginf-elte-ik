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
import { Info, Loader2 } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { useParams } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const AttachmentListItem = ({ attachment }: AttachmentListItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const { id: lessonId } = useParams<{ id: string }>();
  const { data: ownUserData } = trpc.getOwnUserId.useQuery();
  const { data: lessonData, isLoading: isLessonDataLoading } =
    trpc.lessons.getLessonById.useQuery(lessonId);
  const userId = ownUserData?.id;
  const { data: ownerPublicData } = trpc.getPublicDataByUserId.useQuery(
    attachment.ownerId ?? ""
  );
  return (
    <Card className="w-full relative items-center max-w-3xl">
      {isDeleteLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary-foreground opacity-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}
      <CardContent className="m-0 p-4 sm:gap-4 flex items-center h-full">
        <div>
          <AttachmentListItemIcon
            attachment={attachment}
            contentType={attachment.contentType ?? ""}
          />
        </div>
        <CardHeader>
          <CardTitle className="truncate max-w-[10rem] lg:max-w-sm w-12 md:w-full">
            {attachment.name}
          </CardTitle>
          <CardDescription>
            {attachment.size} - {moment(attachment.createdAt).fromNow()}
          </CardDescription>
        </CardHeader>
        <HoverCard>
          <HoverCardTrigger className="cursor-pointer group ml-auto">
            <Avatar className="sm:flex hidden">
              <div className="w-full h-full group-hover:opacity-100 opacity-0 flex items-center justify-center absolute bg-background/50 transition-opacity">
                <Info className="w-5 h-5" />
              </div>
              <AvatarImage aria-hidden src={ownerPublicData?.image ?? ""} />
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="flex items-center justify-center">
            <div>
              <p className="font-semibold">{ownerPublicData?.name}</p>
              <p className="text-sm">
                {moment(attachment.updatedAt).format("lll")}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
        <Link
          href={getDownloadUrl(attachment.url, attachment.name)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Download
        </Link>
        {(attachment.ownerId === userId || lessonData?.ownerId === userId) && (
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
