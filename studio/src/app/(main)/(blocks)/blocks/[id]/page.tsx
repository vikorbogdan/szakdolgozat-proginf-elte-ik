"use client";
import BlockContentRenderer from "@/app/(main)/_components/BlockContentRenderer";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";
type LearningBlockPageParams = {
  id: string;
};

type LearningBlockPageProps = {
  params: LearningBlockPageParams;
};

const LearningBlockPage = ({ params }: LearningBlockPageProps) => {
  const { data: blockData, isLoading: blockDataIsLoading } =
    trpc.blocks.getBlockById.useQuery(params.id);
  if (blockDataIsLoading) return <LoadingPage />;
  if (!blockData) return <div>Block not found</div>;
  if (!blockData?.content) return <div>Block has no content</div>;
  return (
    <div className="p-4 md:p-16 bg-primary-foreground min-h-screen h-full w-full">
      <h1 className="font-semibold text-4xl">{blockData?.title}</h1>
      <BlockContentRenderer blockContentData={JSON.parse(blockData?.content)} />
    </div>
  );
};

export default LearningBlockPage;
