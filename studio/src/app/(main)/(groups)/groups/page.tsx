"use client";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";
import { Users2 } from "lucide-react";
import CreateNewGroupButton from "../_components/CreateNewGroupButton";
import GroupList from "../_components/GroupList";

const Groups = () => {
  const { data: groupData, isLoading: isGroupsLoading } =
    trpc.groups.list.useQuery();
  if (isGroupsLoading) return <LoadingPage />;
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-4">
          <Users2 className="h-14 w-14" />
          <h1 className="md:text-5xl text-xl font-semibold">Subject Groups</h1>
        </div>
        <CreateNewGroupButton />
      </div>
      {groupData && <GroupList groupData={groupData} />}
    </div>
  );
};

export default Groups;
