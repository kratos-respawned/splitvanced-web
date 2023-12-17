import { db } from "@/lib/db";
import { APIErrorHandler } from "@/lib/error-handler";
import { getServerSession } from "@/lib/server-session";
import { friendshipSchema } from "@/validatiors/friendship-schema";

export const POST = async (req: Request) => {
  try {
    const reqJSON = await req.json();
    const { id } = friendshipSchema.parse(reqJSON);
    const { user, error } = await getServerSession();
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
    if (!arefriends) {
      return Response.json({
        status: "error",
        error: "You are not friends",
      });
    }
    const deletedFriendship = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          disconnect: {
            id: id,
          },
        },
        friendOf: {
          disconnect: {
            id: id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        friends: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return Response.json({
      status: "success",
      data: deletedFriendship,
    });
  } catch (error) {
    const errMessage = APIErrorHandler(error);
    return Response.json({
      status: "error",
      error: errMessage,
    });
  }
};
