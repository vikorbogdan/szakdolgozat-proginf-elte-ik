"use client";
import Editor from "@/components/Editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BlockValidator, NewBlockRequest } from "@/lib/validators/block";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const NewBlock = () => {
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
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };
  useEffect(() => {
    setFocus("title");
  }, [setFocus]);
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <h1 className="text-5xl font-semibold">Add New Block</h1>
      <form className="flex flex-col max-w-5xl gap-4">
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
          <Editor className="bg-none border-2" />
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="tags">Tags</label>
          <input type="text" name="tags" id="tags" />
        </div>
        <input
          type="submit"
          value="Create Block"
          className="bg-primary w-36 text-primary-background py-2 px-4 rounded-lg"
        />
      </form>
    </div>
  );
};

export default NewBlock;
