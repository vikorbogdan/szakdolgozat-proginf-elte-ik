"use client";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Block } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import DroppableColumn from "./_components/DroppableColumn";
const EditLesson = () => {
  const router = useRouter();
  const { id: lessonId } = useParams<{ id: string }>();
  const { data: availableBlocksData, isLoading: isAvailableBlocksLoading } =
    trpc.blocks.list.useQuery();
  const { data: lessonData, isLoading: isLessonDataLoading } =
    trpc.lessons.getLessonById.useQuery(lessonId);
  const { mutate: updateLessonBlocks, isLoading: isUpdatingLessonBlocks } =
    trpc.lessons.updateBlocks.useMutation({
      onSuccess: () => {
        console.log("Successfully updated lesson blocks");
        router.replace(`/lessons/${lessonId}`);
      },
      onError: (err) => {
        console.log("Something went wrong");
        console.error(err);
      },
    });

  const handleSaveChanges = () => {
    updateLessonBlocks({
      lessonId,
      blocks: columns.lesson.items.map((block) => block.id.split("-")[0]),
    });
  };

  const initialColumns = {
    available: {
      id: "available",
      items: [],
    },
    lesson: {
      id: "lesson",
      items: [],
    },
  };

  const [columns, setColumns] = useState<{
    available: { id: string; items: Block[] };
    lesson: { id: string; items: Block[] };
  }>(initialColumns);

  useEffect(() => {
    if (!availableBlocksData || !lessonData) return;
    const transformedLessonBlocks = lessonData.blocks.map((block) => ({
      ...block,
      id: `${block.id}-${uuidv4()}`,
    }));
    setColumns({
      available: {
        id: "available",
        items: availableBlocksData ?? [],
      },
      lesson: {
        id: "lesson",
        items: transformedLessonBlocks,
      },
    });
  }, [availableBlocksData, lessonData]);
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (source.droppableId === "available" && !destination) return null;

    if (
      source.droppableId === destination?.droppableId &&
      destination.index === source.index
    )
      return null;
    if (
      source.droppableId === "lesson" &&
      destination &&
      source.droppableId === destination.droppableId
    ) {
      // reorder
      const column = columns[source.droppableId];
      if (!column.items) return;
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    } else if (
      source.droppableId === "available" &&
      destination &&
      destination.droppableId === "lesson"
    ) {
      // copy
      const sourceColumn = columns[source.droppableId];
      const destinationColumn = columns[destination.droppableId];
      if (!sourceColumn.items || !destinationColumn.items) return;
      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];
      const copied = { ...sourceItems[source.index] };
      copied.id = `${copied.id}-${Date.now()}`;

      destinationItems.splice(destination.index, 0, copied);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destinationColumn,
          items: destinationItems,
        },
      });
    }
    // remove
    else if (source.droppableId === "lesson" && !destination) {
      const sourceColumn = columns[source.droppableId];
      if (!sourceColumn.items) return;
      const sourceItems = [...sourceColumn.items];
      sourceItems.splice(source.index, 1);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
    }
  };

  if (isAvailableBlocksLoading || isLessonDataLoading) return <LoadingPage />;
  if (isUpdatingLessonBlocks) return <div>Saving...</div>;
  if (!availableBlocksData || !lessonData)
    return <div>Something went wrong</div>;
  return (
    <div className="p-4 md:p-16 bg-primary-foreground min-h-screen h-full w-full">
      <main className="gap-4 flex-col flex items-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold">Edit Lesson</h1>
          <p>Use drag and drop to reorder the lesson content</p>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-4">
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.entries(columns).map(([key, column], idx) => (
              <DroppableColumn key={idx} id={column.id} items={column.items} />
            ))}
          </DragDropContext>
        </div>
        <Button className="w-32" onClick={handleSaveChanges}>
          Save changes
        </Button>
      </main>
    </div>
  );
};

export default EditLesson;
