import { z } from "zod";

export const AddUserToGroupByEmailValidator = z.object({
  email: z.string().email({
    message: "Please provide a valid e-mail address.",
  }),
});
export type AddUserToGroupByEmailRequest = z.infer<
  typeof AddUserToGroupByEmailValidator
>;
