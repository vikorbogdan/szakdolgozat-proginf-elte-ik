import { db } from "@/db";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession, Session } from "next-auth";
import { NextResponse } from "next/server";
import allowedAttachmentFileTypes from "@/lib/allowedAttachmentFileTypes";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  console.log("body", body);
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname: string,
        clientPayload?: string
      ) => {
        const { userId, lessonId } = JSON.parse(clientPayload || "{}");
        const isAuthenticated = await verifyUserAuthentication(userId.id);
        if (!isAuthenticated) {
          throw new Error("Unauthorized upload attempt");
        }
        if (!lessonId) {
          throw new Error("No lessonId provided");
        }

        return {
          allowedContentTypes: allowedAttachmentFileTypes,
        };
      },
      onUploadCompleted: async () => {
        // db actions are done from client side via trpc api call
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

const verifyUserAuthentication = async (userId: string) => {
  const session: Session | null = await getServerSession();

  if (!session) {
    return false;
  }
  const { user } = session;
  if (!user?.email) {
    return false;
  }
  if (!userId) {
    return false;
  }
  const userEmail = user.email;
  const idQuery = await db.user.findFirst({
    select: {
      id: true,
    },
    where: {
      email: userEmail,
    },
  });
  return idQuery?.id === userId;
};
