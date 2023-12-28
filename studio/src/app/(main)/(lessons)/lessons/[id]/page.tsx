"use client";
import { trpc } from "@/app/_trpc/client";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/store/client/useStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import LessonContent from "./_components/LessonContent";
import AttachmentList from "./_components/_attachments/AttachmentList";
import AttachmentUploadButton from "./_components/_attachments/AttachmentUploadButton";

const LessonOutlinePage = () => {
  const { id } = useParams<{ id: string }>();
  const { onGoingLessonId } = useNavbarStore();
  const {
    data: lessonData,
    isLoading: isLessonDataLoading,
    isError: isLessonDataError,
  } = trpc.lessons.getLessonById.useQuery(id);
  const { data: ownUserData, isLoading: isOwnUserDataLoading } =
    trpc.getOwnUserId.useQuery();
  const userId = ownUserData?.id;

  if (isLessonDataError)
    return (
      <div className="p-4 md:p-16 bg-primary-foreground min-h-screen h-full w-full">
        <ErrorPage />
      </div>
    );
  if (isLessonDataLoading || isOwnUserDataLoading) return <LoadingPage />;
  if (!lessonData || !userId) return <div>Lesson not found</div>;
  if (!lessonData?.blocks) return <div>Could not retrieve blocks.</div>;
  return (
    <div className="p-4 md:p-16 bg-primary-foreground min-h-screen h-full w-full">
      <Tabs
        defaultValue="lesson-outline"
        className="items-center flex flex-col w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="lesson-outline">Lesson Outline</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>
        <TabsContent value="lesson-outline">
          <header className="w-full flex flex-col items-center justify-center">
            <h1 className="font-semibold text-2xl md:text-4xl">
              {lessonData?.title}
            </h1>
            {lessonData.ownerId === userId && (
              <div className="flex gap-2">
                {onGoingLessonId !== lessonData.id && (
                  <Link
                    href={`/lessons/${id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "mt-4"
                    )}
                  >
                    {lessonData.blocks.length === 0 ? "Add" : "Edit"} Blocks
                  </Link>
                )}
                <Link
                  href={`/lessons/${id}/edit/handout`}
                  className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
                >
                  {lessonData.sandbox ? "Edit" : "Add"} Handout
                </Link>
              </div>
            )}
          </header>
          <LessonContent userId={userId} lessonData={lessonData} />
        </TabsContent>
        <TabsContent
          value="attachments"
          className="w-full flex-col items-center"
        >
          <header className="w-full flex md:flex-row flex-col items-center justify-between">
            <h1 className="font-semibold text-2xl md:text-4xl">
              Download Attachments
            </h1>
            <AttachmentUploadButton lessonId={lessonData.id} />
          </header>
          <Separator className="my-4" />
          <AttachmentList attachments={lessonData.files} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonOutlinePage;
