import { User } from "@prisma/client";
import GroupDetailsMemberListItem from "./GroupDetailsMemberListItem";

type GroupDetailsMemberListProps = {
  users: User[] | undefined;
  ownerId: string;
};

const GroupDetailsMemberList = ({
  users,
  ownerId,
}: GroupDetailsMemberListProps) => {
  if (!users) return null;
  return (
    <ul className="flex w-full gap-4 flex-col">
      {users.map((user) => (
        <GroupDetailsMemberListItem
          key={user.id}
          user={user}
          isOwner={ownerId === user.id}
        />
      ))}
    </ul>
  );
};

export default GroupDetailsMemberList;
