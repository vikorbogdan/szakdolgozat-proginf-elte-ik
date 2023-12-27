import { db } from "@/db";
import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || !user.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const dbUser = await db.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!dbUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found in database.",
    });
  }

  return opts.next({
    ctx: {
      userEmail: user.email,
      userId: dbUser.id,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
