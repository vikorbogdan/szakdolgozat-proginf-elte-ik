import { db } from "@/db";
import { TRPCError, inferRouterOutputs } from "@trpc/server";
import { filesize } from "filesize";
import { Session, getServerSession } from "next-auth";
import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { backendEdgeClient } from "@/app/api/edgestore/[...edgestore]/route";

export const lessonRouter = router({
  list: privateProcedure.query(async () => {
    const session: Session | null = await getServerSession();
    if (!session) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Session not found.",
      });
    }
    const { user } = session;
    if (!user?.email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User has no e-mail associated with their profile.",
      });
    }
    const userEmail = user.email;
    const dbUser = await db.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    if (!dbUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }
    const lessons = await db.lesson.findMany({
      select: {
        id: true,
        title: true,
        LessonBlock: {
          select: {
            block: {
              select: {
                id: true,
                title: true,
                duration: true,
                content: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      where: {
        users: {
          some: {
            id: dbUser.id,
          },
        },
      },
    });
    return lessons.map((lesson) => {
      return {
        id: lesson.id,
        title: lesson.title,
        duration: lesson.LessonBlock.reduce((sum, lessonBlock) => {
          return sum + lessonBlock.block.duration;
        }, 0),
        numOfBlocks: lesson.LessonBlock.length,
      };
    });
  }),
  listAvailableForGroup: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const { input: groupId } = opts;
      const session: Session | null = await getServerSession();
      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found.",
        });
      }
      const { user } = session;
      if (!user?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User has no e-mail associated with their profile.",
        });
      }
      const userEmail = user.email;
      const dbUser = await db.user.findFirst({
        where: {
          email: userEmail,
        },
      });
      if (!dbUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }
      const lessons = await db.lesson.findMany({
        select: {
          id: true,
          title: true,
          LessonBlock: {
            select: {
              block: {
                select: {
                  id: true,
                  title: true,
                  duration: true,
                  content: true,
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
        where: {
          users: {
            some: {
              id: dbUser.id,
            },
          },
          groups: {
            none: {
              id: groupId,
            },
          },
        },
      });
      return lessons.map((lesson) => {
        return {
          id: lesson.id,
          title: lesson.title,
          duration: lesson.LessonBlock.reduce((sum, lessonBlock) => {
            return sum + lessonBlock.block.duration;
          }, 0),
          numOfBlocks: lesson.LessonBlock.length,
        };
      });
    }),
  /**
   * List all lessons.
   * @returns An array of all lessons.
   * @throws Error if the user is not logged in.
   */
  getLessonById: privateProcedure.input(z.string()).query(async (opts) => {
    const { input: lessonId } = opts;
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        LessonBlock: {
          include: {
            block: {
              select: {
                id: true,
                title: true,
                duration: true,
                content: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });
    const files = await db.file.findMany({
      where: {
        lessonId,
      },
    });
    const sandbox = await db.sandbox.findFirst({
      where: {
        Lesson: {
          some: {
            id: lessonId,
          },
        },
      },
    });
    return (
      lesson && {
        files: files.map((file) => ({
          ...file,
          size: filesize(file.size ?? 0),
        })),
        id: lesson.id,
        title: lesson.title,
        sandbox: sandbox ?? null,
        blocks: lesson.LessonBlock.map((lessonBlock) => {
          return {
            id: lessonBlock.block.id,
            title: lessonBlock.block.title,
            duration: lessonBlock.block.duration,
            content: lessonBlock.block.content,
          };
        }),
      }
    );
  }),
  /**
   * Add a block to a lesson.
   * @param lessonId The ID of the lesson to add the block to.
   * @param blockId The ID of the block to add to the lesson.
   * @returns The newly created LessonBlock.
   * @throws Error if the lesson or block is not found.
   */
  addBlockToLesson: privateProcedure
    .input(
      z.object({
        lessonId: z.string(),
        blockId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const lesson = await db.lesson.findUnique({
        where: { id: input.lessonId },
        include: {
          LessonBlock: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
      if (!lesson) {
        throw new Error("Lesson not found.");
      }
      const block = await db.block.findUnique({
        where: { id: input.blockId },
      });
      if (!block) {
        throw new Error("Block not found.");
      }
      const lessonBlock = await db.lessonBlock.create({
        data: {
          lessonId: input.lessonId,
          blockId: input.blockId,
          order: lesson.LessonBlock.length + 1,
          instance:
            lesson.LessonBlock.filter(
              (lessonBlock) => lessonBlock.blockId === input.blockId
            ).length + 1,
        },
      });
      return lessonBlock;
    }),

  createAndAddFileAttachmentToLesson: privateProcedure
    .input(
      z.object({
        lessonId: z.string(),
        ownerId: z.string(),
        url: z.string(),
        name: z.string(),
        contentType: z.string(),
        size: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const file = await db.file.create({
        data: {
          lessonId: input.lessonId,
          url: input.url,
          name: input.name,
          ownerId: input.ownerId,
          contentType: input.contentType,
          size: input.size,
        },
      });
      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "There was an error connecting the file to the database.",
        });
      }
      const lesson = await db.lesson.update({
        where: {
          id: input.lessonId,
        },
        data: {
          files: {
            connect: {
              id: file.id,
            },
          },
        },
      });
      if (!lesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found.",
        });
      }
      return { success: true };
    }),

  /**
   * Remove a block from a lesson.
   * @param lessonId The ID of the lesson to remove the block from.
   * @param blockId The ID of the block to remove from the lesson.
   * @returns The deleted LessonBlock.
   * @throws Error if the lesson or block is not found.
   * @throws Error if the user is not logged in.
   */
  createLesson: privateProcedure.input(z.string()).mutation(async (opts) => {
    const { input: title } = opts;
    const session: Session | null = await getServerSession();
    if (!session) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Session not found.",
      });
    }
    const { user } = session;
    if (!user?.email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User has no e-mail associated with their profile.",
      });
    }
    const userEmail = user.email;
    const dbUser = await db.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    if (!dbUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }
    const lesson = await db.lesson.create({
      data: {
        title,
        users: {
          connect: {
            id: dbUser.id,
          },
        },
      },
    });
    return lesson;
  }),
  delete: privateProcedure.input(z.string()).mutation(async (opts) => {
    const { input: lessonId } = opts;
    const session: Session | null = await getServerSession();
    if (!session) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Session not found.",
      });
    }
    const { user } = session;
    if (!user?.email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User has no e-mail associated with their profile.",
      });
    }
    const userEmail = user.email;
    const dbUser = await db.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    if (!dbUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }
    const lesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });
    if (!lesson) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Lesson not found.",
      });
    }
    const lessonBlocks = await db.lessonBlock.findMany({
      where: {
        lessonId,
      },
    });
    const files = await db.file.findMany({
      where: {
        lessonId,
      },
    });
    const fileUrls = files.map((file) => file.url);
    for (const url of fileUrls) {
      await backendEdgeClient.publicFiles.deleteFile({
        url,
      });
    }
    await db.file.deleteMany({
      where: {
        lessonId,
      },
    });

    await db.sandbox.deleteMany({
      where: {
        Lesson: {
          some: {
            id: lessonId,
          },
        },
      },
    });

    await db.lessonBlock.deleteMany({
      where: {
        lessonId,
      },
    });
    await db.lesson.delete({
      where: {
        id: lessonId,
      },
    });
    return {
      lesson,
      lessonBlocks,
    };
  }),
  updateBlocks: privateProcedure
    .input(
      z.object({
        lessonId: z.string(),
        blocks: z.array(z.string()),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const lesson = await db.lesson.findUnique({
        where: { id: input.lessonId },
        include: {
          LessonBlock: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
      if (!lesson) {
        throw new Error("Lesson not found.");
      }
      const lessonBlocks = await db.lessonBlock.findMany({
        where: {
          lessonId: input.lessonId,
        },
      });
      const oldBlockIds = lessonBlocks.map(
        (lessonBlock) => lessonBlock.blockId
      );
      const newBlockIds = input.blocks;
      await db.lessonBlock.deleteMany({
        where: {
          lessonId: input.lessonId,
        },
      });
      for (let i = 0; i < newBlockIds.length; i++) {
        const existingRecords = await db.lessonBlock.findMany({
          where: {
            lessonId: input.lessonId,
            blockId: newBlockIds[i],
          },
        });
        const instance = existingRecords.length;

        await db.lessonBlock.create({
          data: {
            lessonId: input.lessonId,
            blockId: newBlockIds[i],
            order: i + 1,
            instance: instance + 1,
          },
        });
      }
      return {
        oldBlockIds,
        newBlockIds,
      };
    }),
});

type LessonRouter = typeof lessonRouter;

type LessonRouterOutput = inferRouterOutputs<LessonRouter>;

export type LessonGetLessonByIdFileOutput = {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  contentType: string | null;
  url: string;
  lessonId: string | null;
  size: string;
};

export type LessonListAvailableForGroupOutput =
  LessonRouterOutput["listAvailableForGroup"];
