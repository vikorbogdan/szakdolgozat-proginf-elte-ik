import { db } from "@/db";
import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const handoutRouter = router({
  create: privateProcedure
    .input(
      z.object({
        lessonId: z.string(),
        template: z.string(),
        files: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const handout = await db.sandbox.findFirst({
        where: {
          Lesson: {
            some: {
              id: input.lessonId,
            },
          },
        },
      });
      if (handout) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Handout already exists for this lesson",
        });
      }

      const newSandbox = await db.sandbox.create({
        data: {
          template: input.template,
          files: input.files,
          Lesson: {
            connect: {
              id: input.lessonId,
            },
          },
        },
      });
      return newSandbox;
    }),

  update: privateProcedure
    .input(
      z.object({
        lessonId: z.string(),
        template: z.string(),
        files: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const handout = await db.sandbox.findFirst({
        where: {
          Lesson: {
            some: {
              id: input.lessonId,
            },
          },
        },
      });
      if (!handout) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Handout not found",
        });
      }

      const updatedSandbox = await db.sandbox.update({
        where: {
          id: handout.id,
        },
        data: {
          template: input.template,
          files: input.files,
        },
      });
      return updatedSandbox;
    }),

  delete: privateProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const handout = await db.sandbox.findFirst({
        where: {
          Lesson: {
            some: {
              id: input.lessonId,
            },
          },
        },
      });
      if (!handout) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Handout not found",
        });
      }

      const deletedSandbox = await db.sandbox.delete({
        where: {
          id: handout.id,
        },
      });
      return deletedSandbox;
    }),
  getHandoutById: privateProcedure
    .input(z.object({ handoutId: z.string() }))
    .query(async ({ ctx, input }) => {
      const handout = await db.sandbox.findFirst({
        where: {
          id: input.handoutId,
        },
      });
      if (!handout) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Handout not found",
        });
      }

      return handout;
    }),
});
