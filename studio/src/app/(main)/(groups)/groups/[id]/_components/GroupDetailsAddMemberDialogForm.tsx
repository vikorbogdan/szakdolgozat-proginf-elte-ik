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
import {
  AddUserToGroupByEmailRequest,
  AddUserToGroupByEmailValidator,
} from "@/lib/validators/addUserToGroupByEmailValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormState, useForm } from "react-hook-form";

interface GroupDetailsAddMemberDialogFormProps {
  onSubmit: (data: any) => void;
}

const GroupDetailsAddMemberDialogForm = ({
  onSubmit,
}: GroupDetailsAddMemberDialogFormProps) => {
  const form = useForm<AddUserToGroupByEmailRequest>({
    resolver: zodResolver(AddUserToGroupByEmailValidator),
  });
  return (
    <Form {...form}>
      <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="johndoe@email.com" />
              </FormControl>
              <FormDescription>
                Please enter the email of the user you want to add to the group.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={`bg-primary mt-4 w-36 text-primary-foreground py-2 px-4 rounded-lg`}
        >
          Find User
        </Button>
      </form>
    </Form>
  );
};

export default GroupDetailsAddMemberDialogForm;
