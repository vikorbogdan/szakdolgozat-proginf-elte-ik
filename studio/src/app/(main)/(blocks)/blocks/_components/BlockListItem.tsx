import { Block } from "@prisma/client";

type BlockListItemProps = {
  block: Block;
};

const BlockListItem = ({ block }: BlockListItemProps) => {
  return (
    <li className="h-24 bg-card rounded-lg flex items-center p-5">
      <a href={`/blocks/${block.id}`}>{block.title}</a>
    </li>
  );
};

export default BlockListItem;
