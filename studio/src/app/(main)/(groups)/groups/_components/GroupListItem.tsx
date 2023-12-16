import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Edit, Loader2, Users2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { GroupItem } from "./GroupList";
import DeleteGroupListItemButton from "./DeleteGroupListItemButton";
import { useState } from "react";
import useOwnUserId from "@/hooks/useOwnUserId";
import EditGroupButton from "./EditGroupButton";

interface GroupListItemProps {
  group: GroupItem;
}

const GroupListItem = ({ group }: GroupListItemProps) => {
  const router = useRouter();
  const userId = useOwnUserId();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isOwnedGroup = group.ownerId === userId;
  return (
    <Card className="relative" key={group.id}>
      {isDeleteLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary-foreground opacity-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}
      <CardHeader className="flex items-center">
        <div className="rounded-full mb-4 bg-blue-400 w-16 h-16 select-none pt-5 flex items-center justify-center">
          <div className="w-14 h-14 text-center text-4xl">{group.icon}</div>
        </div>
        <CardTitle>{group.name}</CardTitle>
        <CardDescription className="text-center w-full truncate">
          {group.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="justify-between flex">
        <Badge className="items-center">
          <Users2 className="h-3.5 w-3.5 -translate-x-1" />
          <span className="ml-1">{group.users}</span>
        </Badge>
        {isOwnedGroup && (
          <>
            <DeleteGroupListItemButton
              setIsDeleteLoading={setIsDeleteLoading}
              groupId={group.id}
            />
            <EditGroupButton isCompact groupId={group.id} />
          </>
        )}
        <Button
          onClick={() => router.push(`/groups/${group.id}`)}
          variant={"secondary"}
          className="h-5 py-3"
        >
          <span className="text-sm">View</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default GroupListItem;
