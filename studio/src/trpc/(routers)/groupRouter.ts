import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { Session, getServerSession } from "next-auth";
import { z } from "zod";
import { privateProcedure, router } from "../trpc";

export const groupRouter = router({
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
    const groups = await db.group.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
      },
      where: {
        users: {
          some: {
            id: dbUser.id,
          },
        },
      },
    });
    return groups;
  }),
  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        icon: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
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
      const group = await db.group.create({
        data: {
          name: input.name,
          description: input.description,
          icon: input.icon,
          users: {
            connect: {
              id: dbUser.id,
            },
          },
        },
      });
      return group;
    }),
  delete: privateProcedure.input(z.string()).mutation(async (opts) => {
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
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
    });
    if (!group) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found.",
      });
    }
    await db.group.delete({
      where: {
        id: groupId,
      },
    });
    return {
      group,
    };
  }),
  getGroupById: privateProcedure.input(z.string()).query(async (opts) => {
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
    const group = await db.group.findUnique({
      where: { id: groupId },
      include: {
        users: true,
      },
    });
    return group;
  }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        icon: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
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
      const group = await db.group.findUnique({
        where: { id: input.id },
      });
      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found.",
        });
      }
      const updatedGroup = await db.group.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          icon: input.icon,
        },
      });
      return updatedGroup;
    }),
});
