import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { BlockValidator } from "@/lib/validators/block";
import { z } from "zod";

export const blockRouter = router({
  // listAll: publicProcedure.query(async () => {
  //   const blocks = await db.block.findMany();
  //   return blocks.map((block) => ({
  //     id: block.id,
  //     title: block.title,
  //     duration: block.duration,
  //     content: null,
  //   }));
  // }),

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
      include: {
        blocks: true,
      },
    });
    if (!dbUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }
    return dbUser.blocks.map((block) => ({
      id: block.id,
      title: block.title,
      duration: block.duration,
      content: block.content,
    }));
  }),

  getBlockById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input: id } = opts;
    const block = await db.block.findUnique({
      where: {
        id,
      },
    });
    if (!block) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Block not found.",
      });
    }
    return {
      id: block.id,
      title: block.title,
      duration: block.duration,
      content: block.content,
    };
  }),

  create: privateProcedure.input(BlockValidator).mutation(async (opts) => {
    const { input: blockData } = opts;
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
    await db.user.update({
      where: {
        email: dbUser.email,
      },
      data: {
        blocks: {
          create: {
            title: blockData.title,
            content: blockData.content,
            duration: blockData.duration,
          },
        },
      },
    });
    return { success: true };
  }),
  delete: privateProcedure.input(z.string()).mutation(async (opts) => {
    const { input: blockId } = opts;
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
    await db.lessonBlock.deleteMany({
      where: {
        blockId,
      },
    });
    await db.user.update({
      where: {
        email: dbUser.email,
      },
      data: {
        blocks: {
          delete: {
            id: blockId,
          },
        },
      },
    });
    return { success: true };
  }),
  edit: privateProcedure
    .input(
      z.object({
        blockId: z.string(),
        blockData: BlockValidator,
      })
    )
    .mutation(async (opts) => {
      const {
        input: { blockId, blockData },
      } = opts;
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
      await db.user.update({
        where: {
          email: dbUser.email,
        },
        data: {
          blocks: {
            update: {
              where: {
                id: blockId,
              },
              data: {
                title: blockData.title,
                content: blockData.content,
                duration: blockData.duration,
              },
            },
          },
        },
      });
      return { success: true };
    }),
});
