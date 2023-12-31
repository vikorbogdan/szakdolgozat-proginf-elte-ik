import { z } from "zod";

export const LessonValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(128, { message: "Title must be less than 128 characters long." }),
});

export type NewLessonRequest = z.infer<typeof LessonValidator>;
