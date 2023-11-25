"use client";
import Editor from "@/app/(main)/(blocks)/blocks/new/_components/Editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/utils";
import { BlockValidator, NewBlockRequest } from "@/lib/validators/block";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
const CreateBlockForm = () => {
  const [currentDuration, setCurrentDuration] = useState<number>(5);
  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    formState: { errors },
  } = useForm<NewBlockRequest>({
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
  async function onSubmit(data: NewBlockRequest) {
    const blocks = await editorRef.current?.save();
    const payload: NewBlockRequest = {
      title: data.title,
      content: JSON.stringify(blocks),
      duration: currentDuration,
      tags: data.tags,
    };
    createBlockMutation(payload, {
      onError: (err) => {
        console.log("Failed creating block: ", err);
      },
      onSuccess: () => console.log("Successfully created block"),
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
        <label htmlFor="content">Edit Content</label>
        <Editor editorRef={editorRef} className="bg-none border-2" />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="tags">Tags</label>
        <input type="text" name="tags" id="tags" />
      </div>
      <input
        type="submit"
        value="Create Block"
        className={`bg-primary w-36 text-primary-background py-2 px-4 rounded-lg ${
          isCreateBlockLoading ? "opacity-50 disabled" : ""
        } $}`}
      />
    </form>
  );
};

export default CreateBlockForm;
