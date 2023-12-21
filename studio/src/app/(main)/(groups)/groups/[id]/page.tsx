"use client";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import EditGroupButton from "../_components/EditGroupButton";
import GroupDetailsAddLessonButton from "./_components/GroupDetailsAddLessonButton";
import GroupDetailsMemberList from "./_components/GroupDetailsMemberList";
import { Loader2 } from "lucide-react";

const SubjectGroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: groupData,
    isFetching: isGroupDataFetching,
    isLoading: isGroupDataLoading,
  } = trpc.groups.getGroupById.useQuery(id);
  if (isGroupDataLoading) return <LoadingPage />;
  if (!groupData) return null;
  return (
    <div className="p-4 md:p-16 gap-4 flex-col flex bg-primary-foreground min-h-screen h-full w-full">
      <header className="flex w-full items-center bg-card p-4 rounded-xl gap-4">
        <div className="rounded-full bg-blue-400 w-10 h-10 md:w-20 md:h-20 select-none pt-7 md:pt-5 flex items-center justify-center">
          <div className="w-14 h-14 text-center text-lg md:text-4xl">
            {groupData.icon}
          </div>
        </div>
        <div className="flex-col flex gap-1 ">
          <h1 className="font-semibold text-2xl md:text-4xl">
            {groupData.name}
          </h1>
        </div>
        <div className="ml-auto items-center flex gap-4">
          {isGroupDataFetching && <Loader2 className="animate-spin w-4 h-4" />}
          <EditGroupButton groupId={id} />
          <Button>Delete</Button>
        </div>
      </header>
      <aside className="flex flex-col w-full bg-muted p-4 rounded-xl gap-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="text-lg md:text-xl text-justify text-muted-foreground ">
          {groupData.description}
        </p>
      </aside>
      <main className="flex items-start flex-col md:flex-row">
        <div className="md:w-2/3 bg-card rounded-lg mr-4 p-4">
          <div className="flex mb-4 items-center justify-between">
            <h2 className="text-xl font-semibold">Lessons</h2>
            {<GroupDetailsAddLessonButton groupId={groupData.id} />}
          </div>
          {groupData.lessons.length == 0 ? (
            <span className="text-muted-foreground">
              You have no Lesson Outlines associated yet. Use the button to add
              some!
            </span>
          ) : (
            <ul className="flex flex-col gap-4">
              {groupData.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className={`bg-muted shadow-md transition-all rounded-lg justify-between flex items-center p-4`}
                >
                  <span className="text-2xl block">{lesson.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <GroupDetailsMemberList
          ownerId={groupData.ownerId ?? ""}
          users={groupData.users.map((user) => ({
            ...user,
            createdAt: new Date(user.createdAt),
          }))}
        />
      </main>
    </div>
  );
};

export default SubjectGroupPage;
