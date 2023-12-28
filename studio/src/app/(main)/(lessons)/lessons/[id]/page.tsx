"use client";
import BlockContentRenderer from "@/app/(main)/_components/BlockContentRenderer";
import { trpc } from "@/app/_trpc/client";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDuration } from "@/lib/utils";
import { Clock, Edit } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AttachmentList from "./_components/_attachments/AttachmentList";
import AttachmentUploadButton from "./_components/_attachments/AttachmentUploadButton";
import { useNavbarStore } from "@/store/client/useStore";

const LessonOutlinePage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { onGoingLessonId } = useNavbarStore();
  const {
    data: lessonData,
    isLoading: isLessonDataLoading,
    isError: isLessonDataError,
  } = trpc.lessons.getLessonById.useQuery(id);
  const { data: ownUserData } = trpc.getOwnUserId.useQuery();
  const userId = ownUserData?.id;

  if (isLessonDataError)
    return (
      <div className="p-4 md:p-16 bg-primary-foreground min-h-screen h-full w-full">
        <ErrorPage />
      </div>
    );
  if (isLessonDataLoading) return <LoadingPage />;
  if (!lessonData) return <div>Lesson not found</div>;
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
          <main className="flex flex-col mt-4 gap-4 items-center w-full">
            {lessonData?.blocks.map((block, idx) => {
              return (
                <Card className="w-full md:w-[48rem]" key={block.id + idx}>
                  <CardHeader className="flex items-center flex-row w-full justify-between">
                    {userId === lessonData.ownerId && (
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          router.push(`/blocks/${block.id}/edit`);
                        }}
                        className="flex text-sm items-center gap-1"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    )}
                    <CardTitle className="text-center">{block.title}</CardTitle>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>{formatDuration(block.duration)}</span>
                      <Clock className="w-5 h-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {block.content && (
                      <BlockContentRenderer
                        blockContentData={JSON.parse(block.content)}
                      ></BlockContentRenderer>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </main>
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
