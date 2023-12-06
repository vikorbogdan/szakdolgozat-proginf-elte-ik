"use client";
import BlockContentRenderer from "@/app/(main)/_components/BlockContentRenderer";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const LearningBlockPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: blockData, isLoading: blockDataIsLoading } =
    trpc.blocks.getBlockById.useQuery(params.id as string);
  if (blockDataIsLoading) return <LoadingPage />;
  if (!blockData) return <div>Block not found</div>;
  if (!blockData?.content) return <div>Block has no content</div>;
  return (
    <div className="p-4 md:p-16 bg-primary-foreground min-h-screen h-full w-full">
      <div className="flex w-full justify-between">
        <h1 className="font-semibold text-4xl">{blockData?.title}</h1>
        <Button
          variant={"outline"}
          onClick={() => {
            router.push(`/blocks/${params.id}/edit`);
          }}
          className="flex text-sm items-center gap-1"
        >
          <Edit className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
      <BlockContentRenderer blockContentData={JSON.parse(blockData?.content)} />
    </div>
  );
};

export default LearningBlockPage;
