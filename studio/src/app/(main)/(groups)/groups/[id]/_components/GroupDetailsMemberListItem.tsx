import { User } from "@prisma/client";
import { Crown } from "lucide-react";
import GroupDetailsMemberListRemoveAvatarButton from "./GroupDetailsMemberListRemoveAvatarButton";

type GroupDetailsMemberListItemProps = {
  user: User;
  isOwner: boolean;
};

const GroupDetailsMemberListItem = ({
  user,
  isOwner,
}: GroupDetailsMemberListItemProps) => {
  return (
    <li
      key={user.id}
      className="bg-muted p-4 justify-start rounded-lg flex items-center gap-2"
    >
      <GroupDetailsMemberListRemoveAvatarButton isOwner={isOwner} user={user} />
      <span className="text-lg md:text-xl">{user.name}</span>
      {isOwner && (
        <div className="items-center ml-auto text-primary flex flex-col">
          <Crown className="w-5 h-5" />
          <span className="text-center text-xs">Owner</span>
        </div>
      )}
    </li>
  );
};

export default GroupDetailsMemberListItem;
