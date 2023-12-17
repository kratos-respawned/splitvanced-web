import { db } from "@/lib/db";
import { APIErrorHandler } from "@/lib/error-handler";
import { getServerSession } from "@/lib/server-session";
import { friendshipSchema } from "@/validatiors/friendship-schema";

export const POST = async (req: Request) => {
  try {
    const { user, error } = await getServerSession();
    const reqJSON = await req.json();
    const { id } = friendshipSchema.parse(reqJSON);
    if (!user) {
      return Response.json({
        status: "unauthenticated",
        error: "You are not logged in",
      });
    }
    const arefriends = await db.user.findUnique({
      where: {
        id: user.id,
        friendOf: {
          some: {
            id: id,
          },
        },
        friends: {
          some: {
            id: id,
          },
        },
      },
    });
    if (arefriends) {
      return Response.json({
        status: "error",
        error: "You are already friends",
      });
    }
    const sentRequest = await db.friendRequest.findFirst({
      where: {
        fromId: user.id,
        toId: id,
      },
    });
    if (sentRequest) {
      return Response.json({
        status: "error",
        error: "Friend request already sent",
      });
    }
    const friendRequest = await db.friendRequest.create({
      data: {
        fromId: user.id,
        toId: id,
      },
    });
    return Response.json({
      status: "success",
      data: friendRequest,
    });
  } catch (e) {
    const errorMessage = APIErrorHandler(e);
    return Response.json({
      status: "error",
      error: errorMessage,
    });
  }
};
