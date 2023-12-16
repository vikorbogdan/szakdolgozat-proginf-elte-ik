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
import { Textarea } from "@/components/ui/textarea";
import { GroupRequest, GroupValidator } from "@/lib/validators/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type CreateNewGroupFormProps = {
  closeDialog?: () => void;
  groupId: string;
};

const CreateNewGroupForm = ({
  closeDialog,
  groupId,
}: CreateNewGroupFormProps) => {
  const { data: groupData, isLoading: groupDataIsLoading } =
    trpc.groups.getGroupById.useQuery(groupId as string, {
      onSuccess: (data) => {
        if (!data) return;
        form.setValue("name", data.name);
        form.setValue("description", data.description);
        form.setValue("icon", data.icon);
      },
    });
  const form = useForm<GroupRequest>({
    resolver: zodResolver(GroupValidator),
  });
  const trpcUtils = trpc.useUtils();
  const { setFocus } = form;
  const { mutate: editGroupMutation, isLoading: isCreateGroupLoading } =
    trpc.groups.update.useMutation({
      onSuccess: () => {
        console.log("Successfully created Group");
        trpcUtils.groups.getGroupById.invalidate(groupId);
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
    editGroupMutation({ id: groupId, ...data });
  };
  return (
    <Form {...form}>
      {groupDataIsLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-card opacity-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}
      <form
        className={`flex flex-col gap-8 ${groupDataIsLoading && "blur-md"}`}
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
          {isCreateGroupLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateNewGroupForm;
