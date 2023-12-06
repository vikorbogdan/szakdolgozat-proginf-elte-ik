"use client";
import Editor from "@/components/Editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/utils";
import { BlockValidator, BlockRequest } from "@/lib/validators/block";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import type EditorJS from "@editorjs/editorjs";
import { useParams, useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
const EditBlockForm = () => {
  const [currentDuration, setCurrentDuration] = useState<number>(5);
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BlockRequest>({
    resolver: zodResolver(BlockValidator),
    defaultValues: {
      title: "",
      content: "",
      duration: 5,
      tags: [],
    },
  });

  const editorRef = useRef<EditorJS>();
  const { id: blockId } = useParams();
  const { data: blockData } = trpc.blocks.getBlockById.useQuery(
    blockId as string,
    {
      onSuccess: (data) => {
        setValue("title", data.title);
        setValue("duration", data.duration);
        // setValue("tags", data.tags);
        setCurrentDuration(data.duration);
      },
    }
  );
  console.log(blockData);
  const { mutate: editBlockMutation, isLoading: isEditBlockLoading } =
    trpc.blocks.edit.useMutation();
  //TODO: Better loading state after changing block
  const router = useRouter();
  useEffect(() => {
    setFocus("title");
  }, [setFocus]);
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    for (const [key, value] of Object.entries(errors)) {
      //TODO: Add toast
      console.log(key, value.message);
    }
  }, [errors]);
  async function onSubmit(data: BlockRequest) {
    //TODO: Better name for this function
    const blocks = await editorRef.current?.save();
    const payload: BlockRequest = {
      title: data.title,
      content: JSON.stringify(blocks),
      duration: currentDuration,
      tags: data.tags,
    };
    if (typeof blockId === "string")
      editBlockMutation(
        {
          blockId,
          blockData: payload,
        },
        {
          onError: (err) => {
            console.log("Failed creating block: ", err);
          },
          onSuccess: () => {
            console.log("Successfully created block");
            router.push("/blocks");
          },
        }
      );
  }
  return (
    <form
      className="flex flex-col max-w-5xl gap-4"
      onSubmit={handleSubmit(() => {
        onSubmit(getValues());
      })}
    >
      <div className="flex flex-col gap-4">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
      </div>
      <div className="flex flex-col gap-4">
        <Label htmlFor="duration">Duration of Learning Block</Label>
        <div className="flex">
          <Slider
            id="duration"
            {...register("duration")}
            onValueChange={([value]) => {
              setCurrentDuration(value);
            }}
            value={[currentDuration]}
            min={5}
            max={480}
            step={5}
          />
          <div className="w-36 bg-primary mx-2 rounded-lg text-center">
            {formatDuration(currentDuration)}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="content">Edit Content</label>
        {blockData?.content ? (
          <Editor
            editorRef={editorRef}
            initialData={JSON.parse(blockData?.content || "")}
            className="bg-none border-2"
          />
        ) : (
          <LoadingPage />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="tags">Tags</label>
        <input type="text" name="tags" id="tags" />
      </div>
      <input
        type="submit"
        value="Save Changes"
        disabled={isEditBlockLoading}
        className={`bg-primary w-36 text-primary-background py-2 px-4 rounded-lg ${
          isEditBlockLoading ? "opacity-50 cursor-not-allowed" : ""
        } $}`}
      />
    </form>
  );
};

export default EditBlockForm;
