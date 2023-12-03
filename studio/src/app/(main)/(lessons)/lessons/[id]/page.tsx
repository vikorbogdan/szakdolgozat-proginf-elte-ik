"use client";
import BlockContentRenderer from "@/app/(main)/_components/BlockContentRenderer";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { cn, formatDuration } from "@/lib/utils";
import { Clock, Edit } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const LessonOutlinePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: lessonData, isLoading: lessonDataIsLoading } =
    trpc.lessons.getLessonById.useQuery(id);
  if (lessonDataIsLoading) return <LoadingPage />;
  if (!lessonData) return <div>Lesson not found</div>;
  if (!lessonData?.blocks) return <div>Could not retrieve blocks.</div>;
  return (
    <div className="p-4 md:p-16 bg-primary-foreground min-h-screen h-full w-full">
      <header className="w-full flex flex-col items-center justify-center">
        <h1 className="font-semibold text-2xl md:text-4xl">
          {lessonData?.title}
        </h1>
        <Link
          href={`/lessons/${id}/edit`}
          className={cn(buttonVariants({ variant: "outline" }), "my-4")}
        >
          {lessonData.blocks.length === 0 ? "Add" : "Edit"} Blocks
        </Link>
      </header>
      <main className="flex flex-col gap-4 items-center w-full">
        {lessonData?.blocks.map((block, idx) => {
          return (
            <Card className="w-full md:w-[48rem]" key={block.id + idx}>
              <CardHeader className="flex items-center flex-row w-full justify-between">
                <Button
                  variant={"outline"}
                  className="flex text-sm items-center gap-1"
                >
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </Button>
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
    </div>
  );
};

export default LessonOutlinePage;
