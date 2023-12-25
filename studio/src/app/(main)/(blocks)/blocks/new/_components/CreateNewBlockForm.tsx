"use client";
import Editor from "@/components/Editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/utils";
import { BlockValidator, BlockRequest } from "@/lib/validators/block";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
const CreateNewBlockForm = () => {
  const [currentDuration, setCurrentDuration] = useState<number>(5);
  const {
    register,
    handleSubmit,
    setFocus,
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
  const { mutate: createBlockMutation, isLoading: isCreateBlockLoading } =
    trpc.blocks.create.useMutation();
  //TODO: Better loading state after creating block
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
    createBlockMutation(payload, {
      onError: (err) => {
        console.log("Failed creating block: ", err);
      },
      onSuccess: () => {
        console.log("Successfully created block");
        router.push("/blocks");
      },
    });
  }
  return (
    <form
      className="flex flex-col max-w-5xl gap-4"
      onSubmit={handleSubmit(() => {
        onSubmit(getValues());
      })}
    >
      <div className="flex flex-col gap-4">
        <Label htmlFor="title">Add Title</Label>
        <Input id="title" {...register("title")} />
      </div>
      <div className="flex flex-col gap-4">
        <Label htmlFor="duration">Set Duration of Learning Block</Label>
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
        <label className="flex items-center gap-2" htmlFor="content">
          <span>Edit Content</span>{" "}
          <HoverCard>
            <HoverCardTrigger>
              <Info className="w-4 h-4 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent>
              For markdown imports, the following elements are supported:
              <ul className="list-disc list-inside">
                <li>Headings</li>
                <li>Paragraphs</li>
                <li>Lists</li>
                <li>Code blocks</li>
              </ul>
            </HoverCardContent>
          </HoverCard>
        </label>
        <Editor editorRef={editorRef} className="bg-none border-2" />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="tags">Tags</label>
        <input type="text" name="tags" id="tags" />
      </div>
      <input
        type="submit"
        value="Create Block"
        disabled={isCreateBlockLoading}
        className={`bg-primary w-36 text-primary-background py-2 px-4 rounded-lg ${
          isCreateBlockLoading ? "opacity-50 cursor-not-allowed" : ""
        } $}`}
      />
    </form>
  );
};

export default CreateNewBlockForm;
