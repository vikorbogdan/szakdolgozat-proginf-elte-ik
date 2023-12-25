"use client";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import BlockListItem from "./BlockListItem";

const BlockList = () => {
  const { data: blocks, isLoading: blocksAreLoading } =
    trpc.blocks.list.useQuery();
  if (blocksAreLoading) {
    return (
      <div className="w-full flex items-center justify-center gap-2">
        <Loader2 className="h-10 text-foreground animate-spin"></Loader2>
        <p>Fetching learning blocks...</p>
      </div>
    );
  }
  if (blocks?.length === 0) {
    return (
      <div className="w-full flex items-center justify-center gap-2">
        <h2 className="font-semibold text-lg text-foreground">
          You don&apos;t have any Learning Blocks yet.
        </h2>
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-4">
      {blocks?.map((block) => (
        <BlockListItem key={block.id} block={block} />
      ))}
    </ul>
  );
};

export default BlockList;
