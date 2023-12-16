"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GroupValidator, GroupRequest } from "@/lib/validators/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
type CreateNewGroupFormProps = {
  closeDialog?: () => void;
};

const CreateNewGroupForm = ({ closeDialog }: CreateNewGroupFormProps) => {
  const form = useForm<GroupRequest>({
    resolver: zodResolver(GroupValidator),
    defaultValues: {
      name: "Untitled Group",
      description: "",
      icon: "📚",
    },
  });
  const trpcUtils = trpc.useUtils();
  const { register, setFocus } = form;
  const { mutate: createGroupMutation, isLoading: isCreateGroupLoading } =
    trpc.groups.create.useMutation({
      onSuccess: () => {
        console.log("Successfully created Group");
        trpcUtils.groups.list.invalidate();
        if (closeDialog) closeDialog();
      },
      onError: (err) => {
        console.log("Failed creating Group: ", err);
      },
    });
  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit = (data: GroupRequest) => {
    createGroupMutation(data);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Group" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your group that will be displayed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The description of my group"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short summary of what your group is about.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input placeholder="Pick your favourite emoji!" {...field} />
              </FormControl>
              <FormDescription>
                An emoji that will be used as the icon for your group.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isCreateGroupLoading}
          className={`bg-primary w-36 text-primary-background py-2 px-4 rounded-lg ${
            isCreateGroupLoading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          } $}`}
        >
          {isCreateGroupLoading ? "Creating Group..." : "Create Group"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateNewGroupForm;
