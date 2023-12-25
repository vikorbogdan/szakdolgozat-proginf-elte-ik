import { formatDuration } from "@/lib/utils";
import { Block } from "@prisma/client";
import { Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeleteBlockListItemButton from "./DeleteBlockListItemButton";

type BlockListItemProps = {
  block: Block;
};

const BlockListItem = ({ block }: BlockListItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  return (
    <li
      className={`h-24 ${
        isDeleteLoading && "opacity-50"
      } bg-card shadow-md transition-all rounded-lg justify-between flex items-center p-5`}
    >
      {isDeleteLoading ? (
        <Loader2 className="w-10 h-10 animate-spin mx-auto" />
      ) : (
        <>
          <Link href={`/blocks/${block.id}`} passHref>
            <span className="text-2xl hover:translate-x-2 transition-transform block font-semibold">
              {block.title}
            </span>
          </Link>
          <div className="flex gap-2 items-center">
            {/*
        TODO: Add more details to the block list item like tags, etc.
      */}
            <div className="flex gap-1 items-center">
              <span>{formatDuration(block.duration)}</span>
              <Clock className="w-5 h-5" />
            </div>
            <DeleteBlockListItemButton
              setIsDeleteLoading={setIsDeleteLoading}
              blockId={block.id}
            ></DeleteBlockListItemButton>
          </div>
        </>
      )}
    </li>
  );
};

export default BlockListItem;
