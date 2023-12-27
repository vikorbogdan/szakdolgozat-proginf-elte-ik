import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { Session, getServerSession } from "next-auth";
import { z } from "zod";
import { privateProcedure, router } from "../trpc";

const canAccessGroup = async (groupId: string, userId: string) => {
  // only the members of the group can read informations about it (lessons, users, etc)
  // TODO: Move this to a middleware file.
  const group = await db.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      users: true,
    },
  });

  if (!group) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Group not found.",
    });
  }

  if (group.users.some((user) => user.id === userId)) {
    return true;
  }
  return false;
};

const canModifyGroup = async (groupId: string, userId: string) => {
  // only the owner of the group can modify it
  // TODO: Move this to a middleware file.
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

  if (group.ownerId === userId) {
    return true;
  }

  return false;
};

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
        users: true,
        ownerId: true,
      },
      where: {
        users: {
          some: {
            id: dbUser.id,
          },
        },
      },
    });
    // create an array to return that contains id, name, description, icon, and the number of users in the group
    const groupList = groups.map((group) => {
      return {
        id: group.id,
        name: group.name,
        description: group.description,
        icon: group.icon,
        users: group.users.length,
        ownerId: group.ownerId,
      };
    });
    return groupList;
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
          ownerId: dbUser.id,
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

    const hasAccess = await canModifyGroup(groupId, opts.ctx.userId);
    if (!hasAccess) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authorized to delete this group.",
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

    const hasAccess = await canAccessGroup(groupId, opts.ctx.userId);
    if (!hasAccess) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authorized to access this group.",
      });
    }

    const group = await db.group.findUnique({
      where: { id: groupId },
      include: {
        users: true,
        lessons: true,
      },
    });

    // transform lessons data so tthey contain the ownerId, which they retrieve from the first user in the users array
    if (!group) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found.",
      });
    }
    const lessonData = [];
    for (const lesson of group?.lessons) {
      const owner = await db.user.findFirst({
        select: {
          id: true,
        },
        where: {
          lessons: {
            some: {
              id: lesson.id,
            },
          },
        },
      });
      lessonData.push({
        ...lesson,
        ownerId: owner?.id,
      });
    }

    const groupData = {
      ...group,
      lessons: lessonData,
    };

    return groupData;
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

      const hasAccess = await canModifyGroup(input.id, opts.ctx.userId);
      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authorized to modify this group.",
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
  addLessonsToGroup: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
        lessonIds: z.array(z.string()),
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
        where: { id: input.groupId },
      });
      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found.",
        });
      }
      const lessons = await db.lesson.findMany({
        where: {
          id: {
            in: input.lessonIds,
          },
        },
      });
      if (!lessons) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lessons not found.",
        });
      }

      const hasAccess = await canAccessGroup(input.groupId, opts.ctx.userId);
      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authorized to modify this group.",
        });
      }

      const updatedGroup = await db.group.update({
        where: { id: input.groupId },
        data: {
          lessons: {
            connect: lessons.map((lesson) => ({ id: lesson.id })),
          },
        },
        include: {
          lessons: true,
        },
      });
      return updatedGroup;
    }),
  removeLessonFromGroup: privateProcedure
    .input(
      z.object({
        lessonId: z.string(),
        groupId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const {
        input: { lessonId, groupId },
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
      const lesson = await db.lesson.findUnique({
        where: { id: lessonId },
      });
      if (!lesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found.",
        });
      }
      const group = await db.group.findFirst({
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

      const lessonUsers = await db.user.findMany({
        where: {
          lessons: {
            some: {
              id: lessonId,
            },
          },
        },
      });
      const lessonOwnerId = lessonUsers[0].id;

      // hasAccess: if the user is member of the group and they created the lesson that is being removed from group
      const hasAccess =
        (await canAccessGroup(group.id, opts.ctx.userId)) &&
        lessonOwnerId === opts.ctx.userId;

      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authorized to modify this group.",
        });
      }

      const updatedGroup = await db.group.update({
        where: { id: group.id },
        data: {
          lessons: {
            disconnect: {
              id: lessonId,
            },
          },
        },
        include: {
          lessons: true,
        },
      });
      return updatedGroup;
    }),
  addMemberToGroupByEmail: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
        userEmail: z.string(),
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
        where: { id: input.groupId },
      });
      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found.",
        });
      }
      const userToAdd = await db.user.findFirst({
        where: {
          email: input.userEmail,
        },
      });
      if (!userToAdd) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }

      const hasAccess = await canModifyGroup(input.groupId, opts.ctx.userId);
      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authorized to add members to this group.",
        });
      }
      // raise error if user is already in the group
      const isAlreadyMember = await db.group.findFirst({
        where: {
          id: input.groupId,
          users: {
            some: {
              id: userToAdd.id,
            },
          },
        },
      });
      if (isAlreadyMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already a member of this group.",
        });
      }
      const updatedGroup = await db.group.update({
        where: { id: input.groupId },
        data: {
          users: {
            connect: {
              id: userToAdd.id,
            },
          },
        },
        include: {
          users: true,
        },
      });
      return updatedGroup;
    }),
  removeMemberFromGroup: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const {
        input: { groupId, userId },
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
      const group = await db.group.findFirst({
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

      const hasAccess = await canModifyGroup(groupId, opts.ctx.userId);
      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authorized to remove members from this group.",
        });
      }

      const updatedGroup = await db.group.update({
        where: { id: groupId },
        data: {
          users: {
            disconnect: {
              id: userId,
            },
          },
        },
        include: {
          users: true,
        },
      });
      return updatedGroup;
    }),
});
