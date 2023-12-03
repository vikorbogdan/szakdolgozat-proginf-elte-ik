"use client";
import { trpc } from "@/app/_trpc/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LessonValidator, NewLessonRequest } from "@/lib/validators/lesson";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
type CreateNewLessonFormProps = {
  closeDialog?: () => void;
};

const CreateNewLessonForm = ({ closeDialog }: CreateNewLessonFormProps) => {
  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    formState: { errors },
  } = useForm<NewLessonRequest>({
    resolver: zodResolver(LessonValidator),
    defaultValues: {
      title: "Untitled Lesson",
    },
  });
  const trpcUtils = trpc.useUtils();

  const { mutate: createLessonMutation, isLoading: isCreateLessonLoading } =
    trpc.lessons.createLesson.useMutation({
      onSuccess: () => {
        console.log("Successfully created lesson");
        trpcUtils.lessons.list.invalidate();
      },
      onError: (err) => {
        console.log("Failed creating lesson: ", err);
      },
    });
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
  const onSubmit = (data: NewLessonRequest) => {
    createLessonMutation(data.title, {
      onError: (err) => {
        console.log("Failed creating lesson: ", err);
      },
      onSuccess: () => {
        console.log("Successfully created lesson");
        if (closeDialog) closeDialog();
      },
    });
  };
  //TODO: Select group field for lesson form so lessons are automatically added to the selected group
  return (
    <form
      onSubmit={handleSubmit(() => {
        onSubmit(getValues());
      })}
      className="flex flex-col max-w-5xl gap-4"
    >
      <div className="flex flex-col gap-4">
        <Label htmlFor="title">Add Title</Label>
        <Input id="title" {...register("title")} />
      </div>
      <input
        type="submit"
        value={isCreateLessonLoading ? "Creating Lesson..." : "Create Lesson"}
        disabled={isCreateLessonLoading}
        className={`bg-primary w-36 text-primary-background py-2 px-4 rounded-lg ${
          isCreateLessonLoading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        } $}`}
      />
    </form>
  );
};

export default CreateNewLessonForm;
