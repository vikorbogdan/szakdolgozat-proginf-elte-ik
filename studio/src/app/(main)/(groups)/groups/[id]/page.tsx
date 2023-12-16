"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import EditGroupButton from "../_components/EditGroupButton";
import LoadingPage from "@/components/LoadingPage";

const SubjectGroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: groupData, isLoading: isGroupDataLoading } =
    trpc.groups.getGroupById.useQuery(id);
  if (isGroupDataLoading) return <LoadingPage />;
  return (
    <div className="p-4 md:p-16 gap-4 flex-col flex bg-primary-foreground min-h-screen h-full w-full">
      <header className="flex w-full items-center bg-card p-4 rounded-xl gap-4">
        <div className="rounded-full bg-blue-400 w-10 h-10 md:w-20 md:h-20 select-none pt-7 md:pt-5 flex items-center justify-center">
          <div className="w-14 h-14 text-center text-lg md:text-4xl">
            {groupData?.icon}
          </div>
        </div>
        <div className="flex-col flex gap-1 ">
          <h1 className="font-semibold text-2xl md:text-4xl">
            {groupData?.name}
          </h1>
        </div>
        <div className="ml-auto flex gap-4">
          <EditGroupButton groupId={id} />
          <Button>Delete</Button>
        </div>
      </header>
      <aside className="flex flex-col w-full bg-muted p-4 rounded-xl gap-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="text-lg md:text-xl text-justify text-muted-foreground ">
          {groupData?.description}
        </p>
      </aside>
    </div>
  );
};

export default SubjectGroupPage;
