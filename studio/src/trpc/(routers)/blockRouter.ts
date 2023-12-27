import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { BlockValidator } from "@/lib/validators/block";
import { z } from "zod";

const canAccessBlock = async (blockId: string, userId: string) => {
  // TODO: Move this to a middleware file.
  // user can access block if they are the owner of the block

  const block = await db.block.findUnique({
    where: {
      id: blockId,
    },
    include: {
      users: true,
    },
  });

  if (!block) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Block not found.",
    });
  }

  if (block.users[0].id === userId) {
    return true;
  }

  return false;
};
export const blockRouter = router({
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
        message: "You have no e-mail associated with your profile.",
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

  getBlockById: privateProcedure.input(z.string()).query(async (opts) => {
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
    const hasAccess = await canAccessBlock(id, opts.ctx.userId);
    if (!hasAccess) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You have no access to this block.",
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
        message: "You have no e-mail associated with your profile.",
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
        message: "You have no e-mail associated with your profile.",
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

    const hasAccess = await canAccessBlock(blockId, opts.ctx.userId);
    if (!hasAccess) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have access to delete this block.",
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
          message: "You have no e-mail associated with your profile.",
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

      const hasAccess = await canAccessBlock(blockId, opts.ctx.userId);
      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to edit this block.",
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
