import Link from "next/link";
import GroupDetailsDeleteLessonButton from "./GroupDetailsDeleteLessonButton";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupDetailsLessonListItemProps {
  lesson: any;
  userId: string;
  groupData: any;
}
const GroupDetailsLessonListItem = ({
  lesson,
  userId,
  groupData,
}: GroupDetailsLessonListItemProps) => {
  const { data: ownerData } = trpc.getPublicDataByUserId.useQuery(
    lesson.ownerId
  );
  return (
    <li
      key={lesson.id}
      className={`bg-muted shadow-md transition-all gap-4 rounded-lg flex items-center p-4`}
    >
      <Avatar>
        <AvatarImage alt={ownerData?.name ?? ""} src={ownerData?.image ?? ""} />
        <AvatarFallback>
          {ownerData?.name &&
            ownerData?.name
              .split(" ")
              .slice(0, 2)
              .map((name: string) => name[0])
              .join("")}
        </AvatarFallback>
      </Avatar>
      <span className="text-2xl block">{lesson.title}</span>
      <div className="flex items-center gap-4 ml-auto">
        {lesson.ownerId == userId && (
          <GroupDetailsDeleteLessonButton
            groupId={groupData.id ?? ""}
            lessonId={lesson.id ?? ""}
          />
        )}
        <Link href={`/lessons/${lesson.id}`}>
          <ArrowRight />
        </Link>
      </div>
    </li>
  );
};

export default GroupDetailsLessonListItem;
