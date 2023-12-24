import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { Session, getServerSession } from "next-auth";
import { z } from "zod";
import { privateProcedure, router } from "../trpc";

export const fileRouter = router({
  delete: privateProcedure.input(z.string()).mutation(async (opts) => {
    const session: Session | null = await getServerSession();
    const id = opts.input;
    if (!session) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Session not found.",
      });
    }
    const file = await db.file.delete({
      where: { id },
    });
    return file;
  }),
});
