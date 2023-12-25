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
    <div className="md:w-1/3">
      <h2 className="text-xl mb-4 font-semibold">Members</h2>
      <ul className="flex gap-4 flex-col">
        {users.map((user) => (
          <GroupDetailsMemberListItem
            key={user.id}
            user={user}
            isOwner={ownerId === user.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default GroupDetailsMemberList;
