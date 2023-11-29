"use client";
import { trpc } from "@/app/_trpc/client";
import BlockListItem from "./BlockListItem";
import { Loader, Loader2 } from "lucide-react";
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
  return (
    <ul className="flex flex-col gap-4">
      {blocks?.map((block) => (
        <BlockListItem key={block.id} block={block} />
      ))}
    </ul>
  );
};

export default BlockList;
