"use client";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

import GroupDetailsAddLessonButton from "./_components/GroupDetailsAddLessonButton";
import GroupDetailsMemberList from "./_components/GroupDetailsMemberList";
import { ArrowRight, Group, Loader2 } from "lucide-react";
import EditGroupButton from "../../_components/EditGroupButton";
import Link from "next/link";
import ErrorPage from "@/components/ErrorPage";
import GroupDetailsDeleteLessonButton from "./_components/GroupDetailsDeleteLessonButton";
import GroupDetailsLessonListItem from "./_components/GroupDetailsLessonListItem";
import GroupDetailsAddMemberButton from "./_components/GroupDetailsAddMemberButton";

const SubjectGroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: groupData,
    isFetching: isGroupDataFetching,
    isLoading: isGroupDataLoading,
  } = trpc.groups.getGroupById.useQuery(id);

  const { data: ownUserIdData } = trpc.getOwnUserId.useQuery();
  const userId = ownUserIdData?.id;
  if (isGroupDataLoading) return <LoadingPage />;
  if (!groupData)
    return (
      <div className="p-4 md:p-16 gap-4 flex-col flex bg-primary-foreground min-h-screen h-full w-full">
        <ErrorPage code={404} isFullPage message="Group Not Found." />{" "}
      </div>
    );

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
          {groupData.ownerId === userId && <EditGroupButton groupId={id} />}
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
            {<GroupDetailsAddLessonButton groupId={groupData.id ?? ""} />}
          </div>
          {groupData.lessons?.length == 0 ? (
            <span className="text-muted-foreground">
              You have no Lesson Outlines associated yet. Use the button to add
              some!
            </span>
          ) : (
            <ul className="flex flex-col gap-4">
              {groupData.lessons?.map((lesson, idx) => (
                <GroupDetailsLessonListItem
                  key={lesson.id + idx}
                  groupData={groupData}
                  lesson={lesson}
                  userId={userId ?? ""}
                />
              ))}
            </ul>
          )}
        </div>
        <div className="md:w-1/3">
          <div className="flex mb-4 items-center justify-between">
            <h2 className="text-xl font-semibold">Members</h2>
            {groupData.ownerId === userId && (
              <GroupDetailsAddMemberButton group={groupData} />
            )}
          </div>

          <GroupDetailsMemberList
            ownerId={groupData.ownerId ?? ""}
            users={groupData.users.map((user) => ({
              ...user,
              createdAt: new Date(user.createdAt),
            }))}
          />
        </div>
      </main>
    </div>
  );
};

export default SubjectGroupPage;
