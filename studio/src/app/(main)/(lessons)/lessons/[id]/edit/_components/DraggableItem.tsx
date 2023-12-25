import { Block } from "@prisma/client";
import { Loader2, X } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";
type DraggableItemProps = {
  block: Block;
  index: number;
};

const DraggableItem = ({ block, index }: DraggableItemProps) => {
  return (
    <Draggable key={block.id} draggableId={block.id} index={index}>
      {(provided, { isDragging, draggingOver, isDropAnimating }) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 flex m-4 rounded-md ${
            isDragging
              ? !draggingOver
                ? "bg-red-500 animate-pulse"
                : draggingOver === "available"
                ? "opacity-50 bg-primary text-primary-foreground"
                : "bg-primary text-primary-foreground"
              : "bg-primary-foreground"
          }`}
        >
          <span>{block.title}</span>
          {isDragging && !draggingOver ? (
            !isDropAnimating ? (
              <X className="ml-auto animate-ping" />
            ) : (
              <Loader2 className="ml-auto animate-spin" />
            )
          ) : (
            ""
          )}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableItem;
