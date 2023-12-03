import { Droppable } from "react-beautiful-dnd";
import DraggableItem from "./DraggableItem";
import { Block } from "@prisma/client";
type DroppableColumnProps = {
  id: string;
  items: Block[];
};
const DroppableColumn = ({ id, items }: DroppableColumnProps) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div className="flex flex-col w-full">
          <h2>{id === "available" ? "Available" : "Selected"}</h2>
          <div
            className="bg-card p-4 rounded-md w-full border-border border-2 overflow-y-auto h-96"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items?.map((block, index) => (
              <DraggableItem key={block.id} block={block} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default DroppableColumn;
