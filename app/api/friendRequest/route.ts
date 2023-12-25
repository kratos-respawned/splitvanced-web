import { db } from "@/lib/db";
import { APIErrorHandler } from "@/lib/error-handler";
import { getServerSession } from "@/lib/server-session"
import { friendshipSchema } from "@/validatiors/friendship-schema";

export async function GET(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return Response.json({
      status: "unauthenticated",
      error: "You are not logged in",
    });
  }

  const friendRequests = await db.friendRequest.findMany({
    where: {
      toId: user.id,
    }
  })

  return Response.json({
    data: friendRequests,
  })
}

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

export const DELETE = async (req: Request) => {
  try {
    const reqJSON = await req.json();
    const { id } = friendshipSchema.parse(reqJSON);
    const { user } = await getServerSession();
    if (!user) {
      return Response.json({
        status: "unauthenticated",
        error: "You are not logged in",
      });
    }
    const friendRequest = await db.friendRequest.findFirst({
      where: {
        OR: [
          {
            fromId: id,
            toId: user.id,
          },
          {
            fromId: user.id,
            toId: id,
          }
        ]
      }
    })

    if (!friendRequest) {
      return Response.json({
        status: "error",
        error: "No friend request found",
      });
    }
    const deletedReq = await db.friendRequest.delete({
      where: {
        id: friendRequest.id,
      },
    });
    return Response.json({
      status: "success",
      data: deletedReq,
    });
  } catch (error) {
    const errMessage = APIErrorHandler(error);
    return Response.json({
      status: "error",
      error: errMessage,
    });
  }
};