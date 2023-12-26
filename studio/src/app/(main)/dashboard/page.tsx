"use client";
import { Library, TextQuote, Users2 } from "lucide-react";
import { useSession } from "next-auth/react";
import CardWithButton from "../_components/CardWithButton";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";

const Dashboard = () => {
  const { data: session } = useSession();
  const { data: dashboardInfo, isLoading: isDashboardInfoLoading } =
    trpc.dashboardInfo.useQuery();
  if (isDashboardInfoLoading) {
    return <LoadingPage />;
  }
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <h1 className="md:text-5xl text-xl font-semibold">
        Welcome to your Dashboard, {session?.user?.name}!
      </h1>
      <main>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <CardWithButton
            hoverAnimation
            className="w-full text-white md:w-96 bg-gradient-to-t from-orange-400 to-yellow-400"
            buttonClassName="w-56 text-black bg-yellow-200 hover:bg-yellow-300"
            Icon={Users2}
            title="Subject Groups"
            description="Manage your Subject Groups"
            buttonText="See my Subject Groups"
            href="/groups"
          >
            {dashboardInfo?.groupCount && dashboardInfo.groupCount > 0 ? (
              <p>
                You are currently a member of {dashboardInfo?.groupCount}{" "}
                {dashboardInfo?.groupCount > 1 ? "groups" : "group"}.
              </p>
            ) : (
              <p>You have no groups yet.</p>
            )}
          </CardWithButton>
          <CardWithButton
            hoverAnimation
            className="w-full text-white md:w-96 bg-gradient-to-t from-violet-400 to-fuchsia-400"
            buttonClassName="w-56 text-black bg-fuchsia-200 hover:bg-fuchsia-300"
            Icon={Library}
            title="Lesson Outlines"
            description="Manage your Lesson Outlines"
            buttonText="See my Lesson Outlines"
            href="/lessons"
          >
            {dashboardInfo?.lessonCount && dashboardInfo.lessonCount > 0 ? (
              <p>
                You have created {dashboardInfo?.lessonCount}{" "}
                {dashboardInfo?.lessonCount > 1
                  ? "Lesson Outlines"
                  : "Lesson Outline"}
                .
              </p>
            ) : (
              <p>You have no Lesson Outlines yet.</p>
            )}
          </CardWithButton>
          <CardWithButton
            hoverAnimation
            className="w-full text-white md:w-96 bg-gradient-to-t from-indigo-400 to-cyan-400"
            buttonClassName="w-56 text-black bg-cyan-200 hover:bg-cyan-300"
            Icon={TextQuote}
            title="Learning Blocks"
            description="Manage your Learning Blocks"
            buttonText="See my Learning Blocks"
            href="/blocks"
          >
            {dashboardInfo?.blockCount && dashboardInfo.blockCount > 0 ? (
              <p>
                You have created {dashboardInfo?.blockCount}{" "}
                {dashboardInfo?.blockCount > 1
                  ? "Learning Blocks"
                  : "Learning Block"}
                .
              </p>
            ) : (
              <p>You have no Learning Blocks yet.</p>
            )}
          </CardWithButton>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
