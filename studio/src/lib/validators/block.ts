import { z } from "zod";

export const BlockValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(128),
  content: z.string().max(65535, {
    message: "Content must be less than 65,535 characters long.",
  }),
  duration: z
    .number()
    .int()
    .positive()
    .min(5, { message: "Duration must be at least 5 minutes" }),
  tags: z.array(z.string().max(32)),
});

export type NewBlockRequest = z.infer<typeof BlockValidator>;
