import { Group } from "@prisma/client";
import GroupListItem from "./GroupListItem";

export interface GroupItem extends Group {
  users: number;
}

interface GroupListProps {
  groupData: GroupItem[];
}
const GroupList = ({ groupData }: GroupListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {groupData?.map((group) => (
        <GroupListItem key={group.id} group={group} />
      ))}
    </div>
  );
};

export default GroupList;
